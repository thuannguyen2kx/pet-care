import mongoose, { Document, Schema, Types } from "mongoose";

export interface IVaccination {
  name: string;
  date: Date;
  expiryDate?: Date;
  certificate?: string;
}

export interface IMedicalRecord {
  condition: string;
  diagnosis: Date;
  treatment?: string;
  notes?: string;
}

export interface IPet extends Document {
  ownerId: Types.ObjectId;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: string;
  vaccinations?: IVaccination[];
  medicalHistory?: IMedicalRecord[];
  habits?: string[];
  allergies?: string[];
  specialNeeds?: string;
  profilePicture?: {
    url: string | null;
    publicId: string | null
  };
  createdAt: Date;
  updatedAt: Date;
}

const PetSchema: Schema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  breed: String,
  age: Number,
  weight: Number,
  gender: String,
  vaccinations: [{
    name: String,
    date: Date,
    expiryDate: Date,
    certificate: String
  }],
  medicalHistory: [{
    condition: String,
    diagnosis: Date,
    treatment: String,
    notes: String
  }],
  habits: [String],
  allergies: [String],
  specialNeeds: String,
  profilePicture: {
    url: {
      type: String,
      default: null
    },
    publicId: {
      type: String,
      default: null
    }
  }
}, { timestamps: true });

// Indexes
PetSchema.index({ ownerId: 1 });
PetSchema.index({ species: 1, breed: 1 });

const PetModel = mongoose.model<IPet>('Pet', PetSchema);
export default PetModel