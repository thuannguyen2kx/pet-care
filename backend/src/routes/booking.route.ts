import { Router } from "express";

import { passportAuthenticateJWT } from "../config/passport.config";
import {
  addRatingController,
  cancelBookingController,
  createBookingController,
  getBookingByIdController,
  getBookingsController,
  getStatisticsController,
  updateBookingController,
  updateStatusController,
} from "../controllers/booking.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";
const router = Router();

router.use(passportAuthenticateJWT);
// Customer routes
router.post("/", createBookingController);
router.get("/", getBookingsController);
router.get(
  "/stats",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  getStatisticsController
);
router.get("/:id", getBookingByIdController);
router.put("/:id", updateBookingController);
router.post("/:id/cancel", cancelBookingController);
router.post("/:id/rating", addRatingController);

router.patch(
  "/:id/status",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  updateStatusController
);

export default router;
