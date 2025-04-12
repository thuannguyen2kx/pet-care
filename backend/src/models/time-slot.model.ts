import mongoose, { Document, Schema } from "mongoose";

export interface Slot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointmentId?: mongoose.Types.ObjectId;
  employeeId?: mongoose.Types.ObjectId;
}

export interface ITimeSlot extends Document {
  date: Date;
  slots: Slot[];
}

const TimeSlotSchema = new Schema<ITimeSlot>(
  {
    date: {
      type: Date,
      required: true
    },
    slots: [
      {
        startTime: {
          type: String,
          required: true
        },
        endTime: {
          type: String,
          required: true
        },
        isAvailable: {
          type: Boolean,
          default: true
        },
        appointmentId: {
          type: Schema.Types.ObjectId,
          ref: "Appointment"
        },
        employeeId: {
          type: Schema.Types.ObjectId,
          ref: "Employee"
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const TimeSlotModel = mongoose.model<ITimeSlot>("TimeSlot", TimeSlotSchema);
export default TimeSlotModel;