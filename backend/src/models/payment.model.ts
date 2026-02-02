import mongoose, { Document, Types, Schema } from "mongoose";
import {
  PaymentMethodEnum,
  PaymentMethodType,
  PaymentProcessorEnum,
  PaymentProcessorType,
  PaymentStatusEnum,
  PaymentStatusType,
} from "../enums/payment.enum";

export interface IRefundData {
  amount: number;
  reason?: string;
  processedAt: Date;
}

export interface IPayment extends Document {
  _id: Types.ObjectId;
  bookingId: Types.ObjectId;
  customerId: Types.ObjectId;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  status: PaymentStatusType;
  transactionId?: string;
  paymentProcessor?: PaymentProcessorType;
  receiptUrl?: string;
  refundData?: IRefundData;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "VND",
    },
    method: {
      type: String,
      enum: Object.values(PaymentMethodEnum),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatusEnum),
      default: PaymentStatusEnum.PENDING,
    },
    transactionId: String,
    paymentProcessor: {
      type: String,
      enum: Object.values(PaymentProcessorEnum),
      default: PaymentProcessorEnum.OFFLINE,
    },
    receiptUrl: String,
    refundData: {
      amount: Number,
      reason: String,
      processedAt: Date,
    },
  },
  { timestamps: true },
);

PaymentSchema.index({ bookingId: 1 });
PaymentSchema.index({ customerId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ method: 1 });
PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ "refundData.processedAt": -1 });

const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
export default PaymentModel;
