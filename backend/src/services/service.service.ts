import ServiceModel from "../models/service.model";
import ServicePackage from "../models/service-package.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { deleteFile } from "../utils/file-uploade";
import { SpecialtyType } from "../enums/employee.enum";

interface ServiceFilters {
  category?: string;
  petType?: string;
  isActive?: boolean;
}

interface CreateServiceData {
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  applicablePetTypes?: string[];
  applicablePetSizes?: string[];
  isActive?: boolean;
}

interface UpdateServiceData {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: SpecialtyType;
  applicablePetTypes?: string[];
  applicablePetSizes?: string[];
  images?: { url: string; publicId: string }[];
  isActive?: boolean;
}

// Get all services with optional filtering
export const getServicesService = async (filters: ServiceFilters) => {
  const queryFilters: any = {};

  if (filters.category) {
    queryFilters.category = filters.category;
  }

  if (filters.petType) {
    queryFilters.applicablePetTypes = filters.petType;
  }

  if (filters.isActive !== undefined) {
    queryFilters.isActive = filters.isActive;
  } else {
    // By default, only show active services
    queryFilters.isActive = true;
  }

  const services = await ServiceModel.find(queryFilters);
  return { services };
};

// Get a service by ID
export const getServiceByIdService = async (serviceId: string) => {
  const service = await ServiceModel.findById(serviceId);

  if (!service) {
    throw new NotFoundException("Service not found");
  }

  return { service };
};

// Create a new service
export const createServiceService = async ({
  serviceData,
  files,
}: {
  serviceData: CreateServiceData;
  files?: Express.Multer.File[];
}) => {
  // Process applicablePetTypes if it's a string
  let processedPetTypes = serviceData.applicablePetTypes;
  if (typeof serviceData.applicablePetTypes === "string") {
    processedPetTypes = (serviceData.applicablePetTypes as string)
      .split(",")
      .map((type: string) => type.trim());
  }

  // Process applicablePetSizes if it's a string
  let processedPetSizes = serviceData.applicablePetSizes;
  if (typeof serviceData.applicablePetSizes === "string") {
    processedPetSizes = (serviceData.applicablePetSizes as string)
      .split(",")
      .map((size: string) => size.trim());
  }

  const service = await ServiceModel.create({
    ...serviceData,
    applicablePetTypes: processedPetTypes || [],
    applicablePetSizes: processedPetSizes || [],
    isActive: serviceData.isActive !== undefined ? serviceData.isActive : true,
  });

  // Process upload service images
  if (files && files.length > 0) {
    const images = files.map((file: Express.Multer.File) => ({
      url: file.path,
      publicId: file.filename,
    }));
    service.images = images;

    await service.save();
  }

  return { service };
};

// Update a service
export const updateServiceService = async (
  serviceId: string,
  updateData: UpdateServiceData
) => {
  const service = await ServiceModel.findById(serviceId);

  if (!service) {
    throw new NotFoundException("Service not found");
  }

  // Process applicablePetTypes if it's a string
  if (updateData.applicablePetTypes) {
    // if (typeof updateData.applicablePetTypes === 'string') {
    //   service.applicablePetTypes = updateData.applicablePetTypes
    //     .split(',')
    //     .map((type: string) => type.trim());
    // } else {
    // }
    service.applicablePetTypes = updateData.applicablePetTypes;
  }

  // Process applicablePetSizes if it's a string
  if (updateData.applicablePetSizes) {
    // if (typeof updateData.applicablePetSizes === 'string') {
    //   service.applicablePetSizes = updateData.applicablePetSizes
    //     .split(',')
    //     .map((size: string) => size.trim());
    // } else {
    // }
    service.applicablePetSizes = updateData.applicablePetSizes;
  }

  // Update other fields
  if (updateData.name !== undefined) service.name = updateData.name;
  if (updateData.description !== undefined)
    service.description = updateData.description;
  if (updateData.price !== undefined) service.price = updateData.price;
  if (updateData.duration !== undefined) service.duration = updateData.duration;
  if (updateData.category !== undefined) service.category = updateData.category;
  if (updateData.images !== undefined) service.images = updateData.images;
  if (updateData.isActive !== undefined) service.isActive = updateData.isActive;

  const updatedService = await service.save();

  return { service: updatedService };
};

// Delete a service
export const deleteServiceService = async (serviceId: string) => {
  const service = await ServiceModel.findById(serviceId);

  if (!service) {
    throw new NotFoundException("Service not found");
  }

  // Check if service is used in any packages
  const packagesUsingService = await ServicePackage.findOne({
    "services.serviceId": service._id,
  });

  if (packagesUsingService) {
    throw new BadRequestException(
      "Cannot delete service that is used in packages. Deactivate it instead."
    );
  }
  // Delete images of service from cloudinary
  if (service.images && service.images.length > 0) {
    for (const image of service.images) {
      try {
        if (image.publicId) {
          await deleteFile(image.publicId);
        }
      } catch (error) {
        console.log("Failed to delete image of service from cloudinary", error);
      }
    }
  }

  await service.deleteOne();

  return { message: "Service deleted successfully" };
};