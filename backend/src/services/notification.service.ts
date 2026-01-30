import { Types } from "mongoose";
import {
  CreateNotificationInput,
  NotificationType,
} from "../@types/notification.type";
import { UserNotificationModel } from "../models/user-notification";
import { NotificationModel } from "../models/notification.model";
import { emitNewNotification } from "../socket/emitters/notification.emitter";

type NotificationPayload = Omit<CreateNotificationInput, "recipientIds">;
export class NotificationFactory {
  /* -------------------- BOOKING -------------------- */

  static bookingCreated(
    bookingId: string,
    petName: string,
  ): NotificationPayload {
    return {
      type: NotificationType.APPOINTMENT_CREATED,
      title: "Đã tạo lịch hẹn",
      message: `Lịch hẹn chăm sóc cho ${petName} đã được tạo`,
      data: { bookingId },
      priority: 3,
    };
  }

  static bookingConfirmed(
    bookingId: string,
    petName: string,
    date: string,
    time: string,
  ) {
    return {
      type: NotificationType.APPOINTMENT_CONFIRMED,
      title: "Lịch hẹn đã được xác nhận",
      message: `Lịch chăm sóc cho ${petName} vào ${date} lúc ${time} đã được xác nhận.`,
      data: {
        bookingId,
      },
      priority: 3,
    };
  }

  static bookingCompleted(bookingId: string, petName: string) {
    return {
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      title: "Lịch hẹn đã hoàn tất",
      message: `Buổi chăm sóc cho ${petName} đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ 🐾`,
      data: {
        bookingId,
      },
      priority: 1,
    };
  }

  static bookingNoShow(bookingId: string, petName: string) {
    return {
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      title: "Không ghi nhận bạn đến",
      message: `Chúng tôi không ghi nhận bạn đưa ${petName} đến theo lịch hẹn.`,
      data: {
        bookingId,
        policy: "no-show",
      },
      priority: 4,
    };
  }

  static bookingCancelled(
    bookingId: string,
    petName: string,
    initiator: "customer" | "employee" | "admin" | "system",
    reason?: string,
  ) {
    const initiatorTextMap = {
      customer: "Khách hàng",
      employee: "Nhân viên",
      admin: "Quản trị viên",
      system: "Hệ thống",
    };

    return {
      type: NotificationType.APPOINTMENT_CANCELLED,
      title: "Lịch hẹn đã bị huỷ",
      message: `${initiatorTextMap[initiator]} đã huỷ lịch chăm sóc cho ${petName}`,
      data: {
        bookingId,
        initiator,
        reason,
      },
      priority: 3,
    };
  }

  static bookingRescheduled(
    bookingId: string,
    petName: string,
    newTime: Date,
  ): NotificationPayload {
    return {
      type: NotificationType.APPOINTMENT_RESCHEDULED,
      title: "Lịch hẹn đã thay đổi",
      message: `Lịch chăm sóc cho ${petName} được dời sang ${newTime.toLocaleString()}`,
      data: { bookingId, newTime },
      priority: 4,
    };
  }

  static bookingReminder(
    bookingId: string,
    petName: string,
    time: Date,
  ): NotificationPayload {
    return {
      type: NotificationType.APPOINTMENT_REMINDER,
      title: "Nhắc lịch hẹn",
      message: `Bạn có lịch chăm sóc cho ${petName} vào ${time.toLocaleString()}`,
      data: { bookingId, time },
      priority: 5,
    };
  }

  /* -------------------- PET HEALTH -------------------- */

  static petVaccineDue(
    petId: string,
    petName: string,
    vaccine: string,
  ): NotificationPayload {
    return {
      type: NotificationType.PET_VACCINE_DUE,
      title: "Đến hạn tiêm vaccine",
      message: `${petName} đã đến hạn tiêm vaccine ${vaccine}`,
      data: { petId, vaccine },
      priority: 4,
    };
  }

  static petVaccineOverdue(
    petId: string,
    petName: string,
    vaccine: string,
  ): NotificationPayload {
    return {
      type: NotificationType.PET_VACCINE_OVERDUE,
      title: "Quá hạn tiêm vaccine",
      message: `${petName} đã quá hạn tiêm vaccine ${vaccine}`,
      data: { petId, vaccine },
      priority: 5,
    };
  }

  static petCheckupReminder(
    petId: string,
    petName: string,
  ): NotificationPayload {
    return {
      type: NotificationType.PET_CHECKUP_REMINDER,
      title: "Nhắc khám định kỳ",
      message: `${petName} đã đến thời gian khám sức khoẻ định kỳ`,
      data: { petId },
      priority: 3,
    };
  }

  static petHealthRecordUpdated(
    petId: string,
    petName: string,
  ): NotificationPayload {
    return {
      type: NotificationType.PET_HEALTH_RECORD_UPDATED,
      title: "Cập nhật hồ sơ sức khoẻ",
      message: `Hồ sơ sức khoẻ của ${petName} đã được cập nhật`,
      data: { petId },
      priority: 2,
    };
  }

  /* -------------------- PAYMENT -------------------- */

  static paymentSuccess(
    paymentId: string,
    amount: number,
  ): NotificationPayload {
    return {
      type: NotificationType.PAYMENT_SUCCESS,
      title: "Thanh toán thành công",
      message: `Thanh toán ${amount.toLocaleString()}₫ đã thành công`,
      data: { paymentId, amount },
      priority: 5,
    };
  }

  static paymentFailed(paymentId: string): NotificationPayload {
    return {
      type: NotificationType.PAYMENT_FAILED,
      title: "Thanh toán thất bại",
      message: "Thanh toán không thành công, vui lòng thử lại",
      data: { paymentId },
      priority: 5,
    };
  }

  static refundProcessed(
    paymentId: string,
    amount: number,
  ): NotificationPayload {
    return {
      type: NotificationType.REFUND_PROCESSED,
      title: "Hoàn tiền thành công",
      message: `Bạn đã được hoàn ${amount.toLocaleString()}₫`,
      data: { paymentId, amount },
      priority: 4,
    };
  }

  /* -------------------- STAFF / CLINIC -------------------- */

  static newBookingAssigned(
    bookingId: string,
    petName: string,
  ): NotificationPayload {
    return {
      type: NotificationType.NEW_BOOKING_ASSIGNED,
      title: "Lịch hẹn mới",
      message: `Bạn được phân công chăm sóc ${petName}`,
      data: { bookingId },
      priority: 4,
    };
  }

  static staffScheduleUpdated(date: Date): NotificationPayload {
    return {
      type: NotificationType.STAFF_SCHEDULE_UPDATED,
      title: "Cập nhật lịch làm việc",
      message: `Lịch làm việc ngày ${date.toLocaleDateString()} đã được cập nhật`,
      data: { date },
      priority: 3,
    };
  }

  /* -------------------- SYSTEM -------------------- */

  static systemAnnouncement(
    title: string,
    message: string,
  ): NotificationPayload {
    return {
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      title,
      message,
      priority: 2,
    };
  }

  static systemMaintenance(startTime: Date): NotificationPayload {
    return {
      type: NotificationType.SYSTEM_MAINTENANCE,
      title: "Bảo trì hệ thống",
      message: `Hệ thống sẽ bảo trì vào ${startTime.toLocaleString()}`,
      data: { startTime },
      priority: 5,
    };
  }

  static policyUpdated(): NotificationPayload {
    return {
      type: NotificationType.POLICY_UPDATED,
      title: "Cập nhật chính sách",
      message: "Chính sách hệ thống đã được cập nhật",
      priority: 2,
    };
  }
}

export class NotificationService {
  static async create(input: CreateNotificationInput) {
    const notification = await NotificationModel.create({
      type: input.type,
      title: input.title,
      message: input.message,
      data: input.data,
      senderId: input.senderId ? new Types.ObjectId(input.senderId) : null,
      priority: input.priority ?? 2,
    });

    await UserNotificationModel.insertMany(
      input.recipientIds.map((userId) => ({
        userId: new Types.ObjectId(userId),
        notificationId: notification._id,
      })),
    );

    for (const userId of input.recipientIds) {
      emitNewNotification(userId);
    }

    return notification;
  }

  static async getUserNotificationsCursor(
    userId: Types.ObjectId,
    limit = 20,
    cursor?: Date,
  ) {
    const filter: any = {
      userId,
      isDeleted: false,
    };

    if (cursor) {
      filter.createdAt = { $lt: cursor };
    }

    const items = await UserNotificationModel.find(filter)
      .populate("notificationId")
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    const hasNext = items.length > limit;

    if (hasNext) items.pop();

    const nextCursor =
      items.length > 0 ? items[items.length - 1].createdAt : null;

    return {
      items,
      meta: {
        limit,
        hasNext,
        nextCursor,
      },
    };
  }

  static async countUnread(userId: Types.ObjectId) {
    return UserNotificationModel.countDocuments({
      userId,
      isRead: false,
      isDeleted: false,
    });
  }

  static async markAsRead(userId: Types.ObjectId, notificationId: string) {
    return UserNotificationModel.updateOne(
      { userId, notificationId },
      { isRead: true, readAt: new Date() },
    );
  }

  static async markAllAsRead(userId: Types.ObjectId) {
    return UserNotificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }
}
