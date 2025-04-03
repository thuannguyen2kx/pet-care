// src/models/interfaces/servicePackage.interface.ts
import mongoose, { Document, Schema, Types } from "mongoose";
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
  totalPrice: number;
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

const ServicePackageSchema: Schema = new Schema(
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
    totalPrice: Number,
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

const ServicePackageModel = mongoose.model<IServicePackage>(
  "ServicePackage",
  ServicePackageSchema
);
export default ServicePackageModel;