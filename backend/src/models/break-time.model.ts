import mongoose, { Schema, Types } from "mongoose";

export interface IBreakTemplate extends Document {
  employeeId: Types.ObjectId;
  dayOfWeek?: number;
  startTime: string;
  endTime: string;
  name: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BreakTemplateSchema = new Schema<IBreakTemplate>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    name: {
      type: String,
      required: true,
    },
    effectiveFrom: {
      type: Date,
      required: true,
    },
    effectiveTo: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

BreakTemplateSchema.index({
  employeeId: 1,
  effectiveFrom: 1,
  isActive: 1,
});

export const BreakTemplateModel = mongoose.model<IBreakTemplate>(
  "BreakTemplate",
  BreakTemplateSchema
);
