import mongoose, { Document, Schema } from "mongoose";

// Định nghĩa interface cho trạng thái khả dụng của nhân viên
export interface EmployeeAvailability {
  employeeId: mongoose.Types.ObjectId;
  isAvailable: boolean;
  appointmentId?: mongoose.Types.ObjectId;
}

export interface Slot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointmentId?: mongoose.Types.ObjectId;
  // Thay thế employeeId đơn lẻ bằng mảng trạng thái nhân viên
  employeeAvailability: EmployeeAvailability[];
  originalSlotIndexes?: number[];
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
        employeeAvailability: [
          {
            employeeId: {
              type: Schema.Types.ObjectId,
              ref: "User"
            },
            isAvailable: {
              type: Boolean,
              default: true
            },
            appointmentId: {
              type: Schema.Types.ObjectId,
              ref: "Appointment"
            }
          }
        ],
        originalSlotIndexes: {
          type: [Number],
          required: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Thêm index để tăng tốc độ truy vấn
TimeSlotSchema.index({ date: 1 });

const TimeSlotModel = mongoose.model<ITimeSlot>("TimeSlot", TimeSlotSchema);
export default TimeSlotModel;