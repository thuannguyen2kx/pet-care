import mongoose, { Schema, Types } from "mongoose";

export interface IShiftTemplate extends Document {
  employeeId: Types.ObjectId;
  dayOfWeek: number; // 0-6
  startTime: string;
  endTime: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShiftTemplateSchema = new Schema<IShiftTemplate>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    endTime: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return v > this.startTime;
        },
        message: "Thời gian kết thúc phải sau thời gian bắt đầu.",
      },
    },
    effectiveFrom: {
      type: Date,
      required: true,
      index: true,
    },
    effectiveTo: {
      type: Date,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

ShiftTemplateSchema.index({
  employeeId: 1,
  dayOfWeek: 1,
  effectiveFrom: 1,
  isActive: 1,
});

export const ShiftTemplateModel = mongoose.model<IShiftTemplate>(
  "ShiftTemplate",
  ShiftTemplateSchema
);
