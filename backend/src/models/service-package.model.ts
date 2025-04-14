// src/models/interfaces/servicePackage.interface.ts
import mongoose, {
  Document,
  Schema,
  Types,
} from "mongoose";
import { IService } from "./service.model";
import { SpecialtyType } from "../enums/employee.enum";

export interface IServiceItem {
  serviceId: Types.ObjectId;
  quantity: number;
}

export interface ISeasonalAvailability {
  isLimited: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface IServicePackage extends Document {
  name: string;
  description?: string;
  services: IServiceItem[];
  specialties: SpecialtyType[];
  price: number;
  discountedPrice?: number;
  discountPercentage?: number;
  duration: number;
  applicablePetTypes?: string[];
  applicablePetSizes?: string[];
  images?: { url: string; publicId: string }[];
  isActive: boolean;
  seasonalAvailability?: ISeasonalAvailability;
  createdAt: Date;
  updatedAt: Date;
}

const ServicePackageSchema = new Schema<IServicePackage>(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    services: [
      {
        serviceId: {
          type: Schema.Types.ObjectId,
          ref: "Service",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    specialties: [String],
    price: Number,
    discountedPrice: Number,
    discountPercentage: Number,
    duration: Number,
    applicablePetTypes: [String],
    applicablePetSizes: [String],
    images: [{ url: { type: String }, publicId: { type: String } }],
    isActive: {
      type: Boolean,
      default: true,
    },
    seasonalAvailability: {
      isLimited: {
        type: Boolean,
        default: false,
      },
      startDate: Date,
      endDate: Date,
    },
  },
  { timestamps: true }
);

ServicePackageSchema.pre("save", async function (next) {
  if (this.isModified("services")) {
    try {
      // Lấy tất cả các ID dịch vụ
      const serviceIds = this.services.map((s) => s.serviceId);

      // Tìm tất cả dịch vụ liên quan
      const services = await mongoose.model<IService>("Service").find({
        _id: { $in: serviceIds },
      });

      // Trích xuất các chuyên môn không trùng lặp
      const uniqueSpecialties = new Set<SpecialtyType>();
      services.forEach((service) => {
        if (service.category) {
          uniqueSpecialties.add(service.category);
        }
      });

      // Cập nhật trường specialties
      this.specialties = Array.from(uniqueSpecialties);

      next();
    } catch (error) {
      throw error;
    }
  } else {
    next();
  }
});

const ServicePackageModel = mongoose.model<IServicePackage>(
  "ServicePackage",
  ServicePackageSchema
);

export default ServicePackageModel;