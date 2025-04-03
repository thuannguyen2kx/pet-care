import mongoose, { Document, Schema } from 'mongoose';
export interface IService extends Document {
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  applicablePetTypes?: string[];
  applicablePetSizes?: string[];
  images?: {url: string, publicId: string}[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  applicablePetTypes: [String],
  applicablePetSizes: [String],
  images: [{url: String, publicId: String}],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Indexes
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ applicablePetTypes: 1 });
ServiceSchema.index({ isActive: 1 });

const ServiceModel =  mongoose.model<IService>('Service', ServiceSchema);
export default ServiceModel