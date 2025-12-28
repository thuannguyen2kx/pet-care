import mongoose, { Document, Schema, Types } from "mongoose";

export interface IVaccination {
  _id?: Types.ObjectId;
  name: string;
  date: Date;
  expiryDate?: Date;
  nextDueDate?: Date;
  batchNumber?: string;
  veterinarianName?: string;
  clinicName?: string;
  certificate?: string;
  notes?: string;
}

export interface IMedicalRecord {
  _id?: Types.ObjectId;
  condition: string;
  diagnosis: Date;
  treatment?: string;
  veterinarianName?: string;
  clinicName?: string;
  followUpDate?: Date;
  cost?: number;
  notes?: string;
}
export interface IPet extends Document {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;

  name: string;
  type: string;
  breed: string;
  gender: string;
  dateOfBirth: Date;
  weight: number;
  color: string;

  // Medical Info
  microchipId?: string;
  isNeutered: boolean;
  allergies: string[];
  medicalNotes?: string;

  // Detailed Medical Records
  vaccinations?: IVaccination[];
  medicalHistory?: IMedicalRecord[];

  // Media
  image?: {
    url: string | null;
    publicId: string | null;
  };
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const PetSchema = new Schema<IPet>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic Info
    name: {
      type: String,
      required: [true, "Tên thú cưng là bắt buộc"],
      trim: true,
      maxlength: [100, "Tên không được quá 100 ký tự"],
    },
    type: {
      type: String,
      required: [true, "Loại thú cưng là bắt buộc"],
      enum: {
        values: ["dog", "cat"],
        message: "{VALUE} không phải là loại thú cưng hợp lệ",
      },
      index: true,
    },
    breed: {
      type: String,
      required: [true, "Giống là bắt buộc"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Giới tính là bắt buộc"],
      enum: {
        values: ["male", "female"],
        message: "{VALUE} không phải là giới tính hợp lệ",
      },
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Ngày sinh là bắt buộc"],
      validate: {
        validator: function (value: Date) {
          return value <= new Date();
        },
        message: "Ngày sinh không thể ở tương lai",
      },
    },

    // Physical Info
    weight: {
      type: Number,
      required: [true, "Cân nặng là bắt buộc"],
      min: [0.1, "Cân nặng phải lớn hơn 0"],
      max: [500, "Cân nặng không hợp lệ"],
    },
    color: {
      type: String,
      required: [true, "Màu lông là bắt buộc"],
      trim: true,
    },

    // Medical Info
    microchipId: {
      type: String,
      trim: true,
    },
    isNeutered: {
      type: Boolean,
      default: false,
    },
    allergies: {
      type: [String],
      default: [],
    },
    medicalNotes: {
      type: String,
      maxlength: [2000, "Ghi chú y tế không được quá 2000 ký tự"],
    },

    // Detailed Medical Records
    vaccinations: [
      {
        _id: Schema.Types.ObjectId,
        name: { type: String, required: true },
        date: { type: Date, required: true },
        expiryDate: Date,
        nextDueDate: Date,
        batchNumber: String,
        veterinarianName: String,
        clinicName: String,
        certificate: String,
        notes: String,
      },
    ],

    medicalHistory: [
      {
        _id: Schema.Types.ObjectId,
        condition: { type: String, required: true },
        diagnosis: { type: Date, required: true },
        treatment: String,
        veterinarianName: String,
        clinicName: String,
        followUpDate: Date,
        cost: Number,
        notes: String,
      },
    ],

    // Media
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
PetSchema.index({ ownerId: 1 });
PetSchema.index({ type: 1, breed: 1 });
PetSchema.index(
  { microchipId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      microchipId: { $exists: true, $ne: null },
    },
  }
);
PetSchema.index({ name: "text" });

const PetModel = mongoose.model<IPet>("Pet", PetSchema);
export default PetModel;
