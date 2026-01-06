import ServiceModel, { IService } from "../models/service.model";

import mongoose from "mongoose";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { deleteFile } from "../utils/file-uploade";

interface ServiceFilters {
  category?: string;
  isActive?: boolean;
  price?: {
    $gte?: number;
    $lte?: number;
  };
  $or?: Array<{
    name?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
}

/**
 * Get all services with filters, sorting & pagination
 */
export const getServicesService = async (
  filters: ServiceFilters = {},
  sort: any = { createdAt: -1 },
  skip: number = 0,
  limit: number = 10
) => {
  const [services, total] = await Promise.all([
    ServiceModel.find(filters).sort(sort).skip(skip).limit(limit).lean().exec(),
    ServiceModel.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  const result = {
    services,
    total,
    totalPages,
    currentPage,
  };

  return result;
};

/**
 * Get service by ID
 */
export const getServiceByIdService = async (serviceId: string) => {
  const service = await ServiceModel.findById(serviceId).lean();

  if (!service) {
    throw new NotFoundException("Dịch vụ không tồn tại");
  }

  return { service };
};

/**
 * Create new service
 */
export const createServiceService = async ({
  serviceData,
  files,
  createdBy,
}: {
  serviceData: Partial<IService>;
  files?: Express.Multer.File[];
  createdBy: string;
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check duplicate name (case-insensitive)
    const existingService = await ServiceModel.findOne({
      name: { $regex: new RegExp(`^${serviceData.name}$`, "i") },
    }).session(session);

    if (existingService) {
      throw new BadRequestException("Tên dịch vụ này đã tồn tại");
    }

    const images =
      files?.map((file) => ({
        url: file.path,
        publicId: file.filename,
      })) ?? [];

    const [service] = await ServiceModel.create(
      [
        {
          ...serviceData,
          images,
          createdBy,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return { service };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Update service
 */
export const updateServiceService = async (
  serviceId: string,
  updateData: Partial<IService> & { keepImageIds: string[] },
  files?: Express.Multer.File[],
  updatedBy?: string
) => {
  const session = await mongoose.startSession();

  let imagesToDelete: { publicId: string }[] = [];

  try {
    session.startTransaction();

    const service = await ServiceModel.findById(serviceId).session(session);

    if (!service) {
      throw new NotFoundException("Dịch vụ này không tồn tại");
    }

    // ===== Check duplicate name =====
    if (updateData.name && updateData.name !== service.name) {
      const escapedName = updateData.name.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const existingService = await ServiceModel.findOne({
        name: { $regex: new RegExp(`^${escapedName}$`, "i") },
        _id: { $ne: serviceId },
      }).session(session);

      if (existingService) {
        throw new BadRequestException("Tên dịch vụ này đã tồn tại");
      }
    }

    // ===== IMAGE HANDLING =====
    const oldImages = service.images ?? [];
    const keepIds = updateData.keepImageIds ?? [];

    imagesToDelete = oldImages.filter((img) => !keepIds.includes(img.publicId));

    const uploadedImages =
      files?.map((file) => ({
        url: file.path,
        publicId: file.filename,
      })) ?? [];

    service.images = [
      ...oldImages.filter((img) => keepIds.includes(img.publicId)),
      ...uploadedImages,
    ];

    // ===== REMOVE fields not allowed to be assigned =====
    delete (updateData as any).images;
    delete (updateData as any).keepImageIds;

    Object.assign(service, updateData);

    if (updatedBy) {
      (service as any).updatedBy = updatedBy;
    }

    await service.save({ session });
    await session.commitTransaction();

    // ===== DELETE FILES AFTER COMMIT =====
    await Promise.allSettled(
      imagesToDelete.map((img) => deleteFile(img.publicId))
    );

    return { service };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Toggle service status
 */
export const toggleServiceStatusService = async (
  serviceId: string,
  updatedBy?: string
) => {
  const service = await ServiceModel.findById(serviceId);

  if (!service) {
    throw new NotFoundException("Dịch vụ này không tồn tại");
  }

  service.isActive = !service.isActive;
  if (updatedBy) {
    (service as any).updatedBy = updatedBy;
  }

  await service.save();

  return { service };
};

/**
 * Delete service (soft or hard delete)
 */
export const deleteServiceService = async (
  serviceId: string,
  hardDelete: boolean = false,
  deletedBy?: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const service = await ServiceModel.findById(serviceId).session(session);

    if (!service) {
      throw new NotFoundException("Dịch vụ không tồn tại");
    }

    if (hardDelete) {
      // Delete images from Cloudinary
      if (service.images && service.images.length > 0) {
        const deletePromises = service.images.map((image) =>
          deleteFile(image.publicId)
        );

        await Promise.allSettled(deletePromises);
      }

      // Permanently delete
      await ServiceModel.findByIdAndDelete(serviceId).session(session);
    } else {
      // Soft delete
      service.isActive = false;
      if (deletedBy) {
        (service as any).deletedBy = deletedBy;
        (service as any).deletedAt = new Date();
      }
      await service.save({ session });
    }

    await session.commitTransaction();

    return { message: "Đã xoá dịch vụ thành công" };
  } catch (error) {
    await session.abortTransaction();

    if (error instanceof NotFoundException) throw error;

    throw new BadRequestException("Có lỗi khi xoá dịch vụ");
  } finally {
    session.endSession();
  }
};

/**
 * Get popular services (for homepage)
 */
export const getPopularServicesService = async (limit: number = 6) => {
  // TODO: Join with bookings to get actual popular services
  // For now, return most recent active services
  const services = await ServiceModel.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const result = { services };

  return result;
};

/**
 * Get service statistics (for admin dashboard)
 */
export const getServiceStatisticsService = async () => {
  const [totalServices, activeServices, servicesByCategory] = await Promise.all(
    [
      ServiceModel.countDocuments(),
      ServiceModel.countDocuments({ isActive: true }),
      ServiceModel.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            activeCount: {
              $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
            },
            totalRevenue: { $sum: "$price" },
            avgPrice: { $avg: "$price" },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]),
    ]
  );

  const statistics = {
    total: totalServices,
    active: activeServices,
    inactive: totalServices - activeServices,
    byCategory: servicesByCategory.map((cat) => ({
      category: cat._id,
      total: cat.count,
      active: cat.activeCount,
      inactive: cat.count - cat.activeCount,
      totalRevenue: cat.totalRevenue,
      avgPrice: Math.round(cat.avgPrice),
    })),
  };

  return statistics;
};
