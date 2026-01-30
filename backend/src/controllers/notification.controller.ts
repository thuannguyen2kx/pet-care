import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const getMyNotificationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const limit = Number(req.query.limit) || 20;
    const cursor = req.query.cursor
      ? new Date(req.query.cursor as string)
      : undefined;

    const result = await NotificationService.getUserNotificationsCursor(
      userId,
      limit,
      cursor,
    );

    res.status(200).json(result);
  },
);

export const countUnreadController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const count = await NotificationService.countUnread(userId);
    res.status(200).json({ count });
  },
);

export const markAsReadController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const notificationId = req.params.notificationId;

    await NotificationService.markAsRead(userId, notificationId);
    res.status(200).json({ success: true });
  },
);

export const markAllAsReadController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;

    await NotificationService.markAllAsRead(userId);
    res.status(200).json({ success: true });
  },
);
