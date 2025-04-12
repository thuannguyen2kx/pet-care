import mongoose, { Document, Schema } from "mongoose";

export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  REFUNDED = "refunded"
}

export enum ServiceType {
  SINGLE = "Service",
  PACKAGE = "ServicePackage"
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface IAppointment extends Document {
  customerId: mongoose.Types.ObjectId;
  petId: mongoose.Types.ObjectId;
  serviceType: ServiceType;
  serviceId: mongoose.Types.ObjectId;
  employeeId?: mongoose.Types.ObjectId;
  scheduledDate: Date;
  scheduledTimeSlot: TimeSlot;
  notes?: string;
  serviceNotes?: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    petId: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true
    },
    serviceType: {
      type: String,
      enum: Object.values(ServiceType),
      required: true
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      refPath: "serviceType",
      required: true
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    scheduledTimeSlot: {
      start: {
        type: String,
        required: true
      },
      end: {
        type: String,
        required: true
      }
    },
    notes: {
      type: String
    },
    serviceNotes: {
      type: String
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING
    },
    totalAmount: {
      type: Number,
      required: true
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const AppointmentModel = mongoose.model<IAppointment>("Appointment", AppointmentSchema);
export default AppointmentModel;