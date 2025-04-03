import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  createServiceSchema,
  serviceIdSchema,
  updateServiceSchema,
} from "../validation/service.validation";
import {
  getServicesService,
  getServiceByIdService,
  createServiceService,
  updateServiceService,
  deleteServiceService,
} from "../services/service.service";
import { uploadServiceImage } from "../utils/file-uploade";

// @desc    Get all services with filtering
// @route   GET /api/services
// @access  Public
export const getServicesController = asyncHandler(
  async (req: Request, res: Response) => {
    const { category, petType, isActive } = req.query;

    const filters: any = {};

    if (category) {
      filters.category = category.toString();
    }

    if (petType) {
      filters.petType = petType.toString();
    }

    if (isActive !== undefined) {
      filters.isActive = isActive === "true";
    }

    const { services } = await getServicesService(filters);

    return res.status(HTTPSTATUS.OK).json({
      message: "Services fetched successfully",
      services,
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

    return res.status(HTTPSTATUS.OK).json({
      message: "Service fetched successfully",
      service,
    });
  }
);

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
export const createServiceController = [
  uploadServiceImage.array("images", 5),
  asyncHandler(async (req: Request, res: Response) => {
    const serviceData = createServiceSchema.parse(req.body);

    const { service } = await createServiceService({
      serviceData,
      files: req.files as Express.Multer.File[],
    });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Service created successfully",
      service,
    });
  }),
];

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateServiceController = asyncHandler(
  async (req: Request, res: Response) => {
    const serviceId = serviceIdSchema.parse(req.params.id);
    const updateData = updateServiceSchema.parse(req.body);

    const { service } = await updateServiceService(serviceId, updateData);

    return res.status(HTTPSTATUS.OK).json({
      message: "Service updated successfully",
      service,
    });
  }
);

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteServiceController = asyncHandler(
  async (req: Request, res: Response) => {
    const serviceId = serviceIdSchema.parse(req.params.id);

    await deleteServiceService(serviceId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Service deleted successfully",
    });
  }
);