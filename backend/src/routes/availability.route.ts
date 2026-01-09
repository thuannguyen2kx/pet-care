import { Router } from "express";
import {
  getAvailableEmployeesController,
  getAvailableSlotsController,
  getBookableEmployeesByServiceController,
} from "../controllers/availability.controller";
import { passportAuthenticateJWT } from "../config/passport.config";

const router = Router();

router.use(passportAuthenticateJWT);

router.get("/slots", getAvailableSlotsController);
router.get("/employees", getAvailableEmployeesController);
router.get(
  "/services/:serviceId/bookable-employees",
  getBookableEmployeesByServiceController
);

export default router;
