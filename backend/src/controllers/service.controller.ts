import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  createServiceSchema,
  serviceIdSchema,
  serviceQuerySchema,
  updateServiceSchema,
} from "../validation/service.validation";
import {
  getServicesService,
  getServiceByIdService,
  createServiceService,
  updateServiceService,
  deleteServiceService,
  toggleServiceStatusService,
  getServiceStatisticsService,
  getPopularServicesService,
} from "../services/service.service";
import { Roles } from "../enums/role.enum";
import { BadRequestException } from "../utils/app-error";
import { uploadServiceImage } from "../utils/file-uploade";
import { parseArrayField } from "../utils/parser-data";

// @desc    Get all services with filtering, sorting & pagination
// @route   GET /api/services
// @access  Public
export const getServicesController = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate query parameters
    const validatedQuery = serviceQuerySchema.parse(req.query);

    const {
      category,
      isActive,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page,
      limit,
    } = validatedQuery;

    const filters: any = {};
    // Build filters
    if (category) filters.category = category;

    // Public users only see active services
    if (req.user?.role === Roles.ADMIN || req.user?.role === Roles.EMPLOYEE) {
      if (isActive !== undefined) filters.isActive = isActive;
    } else {
      filters.isActive = true;
    }

    // Price range
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = minPrice;
      if (maxPrice) filters.price.$lte = maxPrice;
    }

    // Search
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Pagination

    const skip = (page - 1) * limit;

    const { services, total, totalPages, currentPage } =
      await getServicesService(filters, sort, skip, limit);

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Lấy danh sách dịch vụ thành công",
      data: {
        services,
        pagination: {
          total,
          totalPages,
          currentPage,
          limit: limit,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      },
    });
  }
);

// @desc    Get a service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const serviceId = serviceIdSchema.parse(req.params.id);

    const { service } = await getServiceByIdService(serviceId);

    // Check if service is active for public users
    if (
      !service.isActive &&
      (!req.user ||
        (req.user.role !== Roles.ADMIN && req.user.role !== Roles.EMPLOYEE))
    ) {
      throw new BadRequestException("Dịch vụ này không tồn tại");
    }

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Lấy thông tin dịch vụ thành công",
      data: { service },
    });
  }
);

// @desc    Get services by category
// @route   GET /api/services/category/:category
// @access  Public
export const getServicesByCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { category } = req.params;

    const filters: any = {
      category: category.toString(),
      isActive: true,
    };

    const sort = { createdAt: -1 };

    const { services, total } = await getServicesService(filters, sort, 0, 100);

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: `Lấy dịch vụ theo danh mục '${category}' thành công`,
      data: {
        category,
        total,
        services,
      },
    });
  }
);

// @desc    Get popular services
// @route   GET /api/services/popular
// @access  Public
export const getPopularServicesController = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 6;

    const { services } = await getPopularServicesService(limit);

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Lấy danh sách dịch vụ phổ biến thành công",
      data: { services },
    });
  }
);

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin/Employee
export const createServiceController = [
  uploadServiceImage.array("images", 5),
  asyncHandler(async (req: Request, res: Response) => {
    // Parse and validate request body
    const serviceData = createServiceSchema.parse({
      ...req.body,
      requiredSpecialties: parseArrayField(req.body.requiredSpecialties),
    });

    const { service } = await createServiceService({
      serviceData,
      files: req.files as Express.Multer.File[],
      createdBy: req.user!._id.toString(),
    });

    return res.status(HTTPSTATUS.CREATED).json({
      success: true,
      message: "Tạo dịch vụ thành công",
      data: { service },
    });
  }),
];

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateServiceController = [
  uploadServiceImage.array("images", 5),
  asyncHandler(async (req: Request, res: Response) => {
    const serviceId = serviceIdSchema.parse(req.params.id);

    // Parse arrays if they exist
    const parsedBody = { ...req.body };
    if (req.body.requiredSpecialties) {
      parsedBody.requiredSpecialties = parseArrayField(
        req.body.requiredSpecialties
      );
    }
    if (req.body.keepImageIds) {
      parsedBody.keepImageIds = parseArrayField(req.body.keepImageIds);
    }

    const updateData = updateServiceSchema.parse(parsedBody);
    const { service } = await updateServiceService(
      serviceId,
      updateData,
      req.files as Express.Multer.File[],
      req.user!._id.toString()
    );

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Đã cập nhật thông tin dịch vụ thành công",
      data: { service },
    });
  }),
];

// @desc    Toggle service active status
// @route   PATCH /api/services/:id/toggle-status
// @access  Private/Admin
export const toggleServiceStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const serviceId = serviceIdSchema.parse(req.params.id);

    const { service } = await toggleServiceStatusService(
      serviceId,
      req.user!._id.toString()
    );

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: `Dịch vụ ${
        service.isActive ? "đã hoạt động" : "đã  ngưng hoạt động"
      } thành công`,
      data: { service },
    });
  }
);

// @desc    Delete a service (soft delete)
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteServiceController = asyncHandler(
  async (req: Request, res: Response) => {
    const serviceId = serviceIdSchema.parse(req.params.id);
    const hardDelete = req.query.hard === "true";

    await deleteServiceService(serviceId, hardDelete, req.user!._id.toString());

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: `Dịch vụ ${
        hardDelete ? "đã xoá vĩnh viễn" : "đã xoá"
      } thành công`,
    });
  }
);

// @desc    Get service statistics (for admin dashboard)
// @route   GET /api/services/admin/statistics
// @access  Private/Admin
export const getServiceStatisticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const statistics = await getServiceStatisticsService();

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Lấy số liệu thống kê dịch vụ thành công",
      data: { statistics },
    });
  }
);
