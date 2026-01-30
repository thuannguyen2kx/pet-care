import { Schema, model, Types } from "mongoose";

export interface UserNotificationDocument {
  userId: Types.ObjectId;
  notificationId: Types.ObjectId;
  isRead: boolean;
  readAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
}

const UserNotificationSchema = new Schema<UserNotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    notificationId: {
      type: Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
      index: true,
    },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

UserNotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const UserNotificationModel = model(
  "UserNotification",
  UserNotificationSchema,
);
