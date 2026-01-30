import { Router } from "express";
import { passportAuthenticateJWT } from "../config/passport.config";
import * as NotificationController from "../controllers/notification.controller";
const router = Router();

router.use(passportAuthenticateJWT);

router.get("/", NotificationController.getMyNotificationsController);
router.get("/unread-count", NotificationController.countUnreadController);
router.patch(
  "/:notificationId/read",
  NotificationController.markAsReadController,
);
router.patch("/read-all", NotificationController.markAllAsReadController);

export default router;
