import mongoose, { Document, Schema } from "mongoose";
import { SPECIALTIES, SpecialtyType } from "../enums/employee.enum";
export interface IService extends Document {
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: SpecialtyType;
  requiredSpecialties: SpecialtyType[];
  images?: { url: string; publicId: string }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,

    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 5 },

    category: {
      type: String,
      enum: SPECIALTIES,
      required: true,
    },

    requiredSpecialties: {
      type: [String],
      enum: SPECIALTIES,
      default: [],
    },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ isActive: 1 });

const ServiceModel = mongoose.model<IService>("Service", ServiceSchema);
export default ServiceModel;
