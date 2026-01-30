import { Schema, model, Types } from "mongoose";

export interface NotificationDocument {
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  senderId?: Types.ObjectId | null;
  priority: number;
  createdAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    type: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
    senderId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    priority: { type: Number, default: 2 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

export const NotificationModel = model("Notification", NotificationSchema);
