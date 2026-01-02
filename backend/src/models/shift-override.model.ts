import mongoose, { Schema, Types } from "mongoose";

export interface IShiftOverride extends Document {
  employeeId: Types.ObjectId;
  date: Date;
  isWorking: boolean;
  startTime?: string;
  endTime?: string;
  reason?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ShiftOverrideSchema = new Schema<IShiftOverride>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    isWorking: {
      type: Boolean,
      required: true,
    },
    startTime: {
      type: String,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    endTime: {
      type: String,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    reason: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

ShiftOverrideSchema.index(
  {
    employeeId: 1,
    date: 1,
  },
  { unique: true }
);

export const ShiftOverrideModel = mongoose.model<IShiftOverride>(
  "ShiftOverride",
  ShiftOverrideSchema
);
