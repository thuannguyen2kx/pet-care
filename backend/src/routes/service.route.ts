import express from "express";
import {
  getServicesController,
  getServiceByIdController,
  createServiceController,
  updateServiceController,
  deleteServiceController,
} from "../controllers/service.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";

const serviceRoutes = express.Router();

// Public routes
serviceRoutes.get("/", getServicesController);
serviceRoutes.get("/:id", getServiceByIdController);

// Admin routes - protected with auth and admin middleware
serviceRoutes.post("/", authorizeRoles([Roles.ADMIN]), createServiceController);
serviceRoutes.put(
  "/:id",
  authorizeRoles([Roles.ADMIN]),
  updateServiceController
);
serviceRoutes.delete(
  "/:id",
  authorizeRoles([Roles.ADMIN]),
  deleteServiceController
);

export default serviceRoutes;