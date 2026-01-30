import mongoose, { Document, Schema, Types } from "mongoose";

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no-show",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  REFUNDED = "refunded",
  FAILED = "failed",
}

export interface IBooking extends Document {
  _id: Types.ObjectId;
  // Participants
  customerId: Types.ObjectId;
  petId: Types.ObjectId;
  employeeId: Types.ObjectId;
  serviceId: Types.ObjectId;

  // Scheduling
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  duration: number;

  // Service snapshot (for historical accuracy)
  serviceSnapshot: {
    name: string;
    price: number;
    duration: number;
    category: string;
  };

  // Status
  status: BookingStatus;
  statusHistory: Array<{
    status: BookingStatus;
    changedAt: Date;
    changedBy: Types.ObjectId;
    reason?: string;
  }>;

  // Payment
  paymentStatus: PaymentStatus;
  totalAmount: number;
  paidAmount: number;
  paymentMethod?: string;
  transactionId?: string;

  // Notes
  customerNotes?: string;
  employeeNotes?: string;
  internalNotes?: string;

  // Reminders
  reminderSent: boolean;
  reminderSentAt?: Date;

  // Cancellation
  cancelledAt?: Date;
  cancelledBy?: Types.ObjectId;
  cancellationReason?: string;
  cancellationInitiator?: "customer" | "employee" | "admin" | "system";

  // Completion
  completedAt?: Date;
  completedBy?: Types.ObjectId;

  // Rating (after completion)
  rating?: {
    score: number;
    feedback?: string;
    ratedAt: Date;
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    petId: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
      index: true,
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
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
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
    },
    serviceSnapshot: {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      duration: { type: Number, required: true },
      category: { type: String, required: true },
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
      index: true,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: Object.values(BookingStatus),
          required: true,
        },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: "User" },
        reason: String,
      },
    ],
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentMethod: String,
    transactionId: String,
    customerNotes: { type: String, maxlength: 1000 },
    employeeNotes: { type: String, maxlength: 1000 },
    internalNotes: { type: String, maxlength: 1000, select: false },
    reminderSent: { type: Boolean, default: false },
    reminderSentAt: Date,
    cancelledAt: Date,
    cancelledBy: { type: Schema.Types.ObjectId, ref: "User" },
    cancellationReason: { type: String, maxlength: 500 },
    cancellationInitiator: {
      type: String,
      enum: ["customer", "employee", "admin", "system"],
    },
    completedAt: Date,
    completedBy: { type: Schema.Types.ObjectId, ref: "User" },
    rating: {
      score: { type: Number, min: 1, max: 5 },
      feedback: { type: String, maxlength: 1000 },
      ratedAt: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound indexes for common queries
BookingSchema.index({ employeeId: 1, scheduledDate: 1, status: 1 });
BookingSchema.index({ customerId: 1, scheduledDate: -1, status: 1 });
BookingSchema.index({ petId: 1, scheduledDate: -1 });
BookingSchema.index({ status: 1, scheduledDate: 1 });
BookingSchema.index({ scheduledDate: 1, startTime: 1 });

// Virtual: Check if booking is in the past
BookingSchema.virtual("isPast").get(function () {
  const bookingDateTime = new Date(this.scheduledDate);
  const [hours, minutes] = this.startTime.split(":").map(Number);
  bookingDateTime.setHours(hours, minutes, 0, 0);
  return bookingDateTime < new Date();
});

// Virtual: Check if cancellable
BookingSchema.virtual("isCancellable").get(function () {
  if (
    this.status !== BookingStatus.PENDING &&
    this.status !== BookingStatus.CONFIRMED
  ) {
    return false;
  }

  const bookingDateTime = new Date(this.scheduledDate);
  const [hours, minutes] = this.startTime.split(":").map(Number);
  bookingDateTime.setHours(hours, minutes, 0, 0);

  const hoursUntilBooking =
    (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntilBooking > 24; // Must cancel 24h before
});

// Pre-save: Add to status history
BookingSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      changedBy: (this as any).modifiedBy || this.customerId,
      reason: (this as any).statusChangeReason,
    });
  }
  next();
});

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
