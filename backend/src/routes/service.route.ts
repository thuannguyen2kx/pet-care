import express from "express";
import {
  getServicesController,
  getServiceByIdController,
  getServicesByCategoryController,
  getPopularServicesController,
  createServiceController,
  updateServiceController,
  toggleServiceStatusController,
  deleteServiceController,
  getServiceStatisticsController,
} from "../controllers/service.controller";
import { Roles } from "../enums/role.enum";
import { serviceQuerySchema } from "../validation/service.validation";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { passportAuthenticateJWT } from "../config/passport.config";

const serviceRoutes = express.Router();

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

/**
 * @route   GET /api/services
 * @desc    Get all active services with filters, sorting & pagination
 * @access  Public
 * @params  Query: category, petType, petSize, minPrice, maxPrice, search, sortBy, sortOrder, page, limit
 */
serviceRoutes.get("/", getServicesController);

/**
 * @route   GET /api/services/popular
 * @desc    Get popular services for homepage
 * @access  Public
 * @params  Query: limit (default: 6)
 */
serviceRoutes.get("/popular", getPopularServicesController);

/**
 * @route   GET /api/services/category/:category
 * @desc    Get all active services in a specific category
 * @access  Public
 * @params  Path: category (grooming, healthcare, training, boarding, spa)
 */
serviceRoutes.get("/category/:category", getServicesByCategoryController);

/**
 * @route   GET /api/services/:id
 * @desc    Get a single service by ID
 * @access  Public
 * @params  Path: id (MongoDB ObjectId)
 */
serviceRoutes.get("/:id", getServiceByIdController);

// ============================================
// PROTECTED ROUTES (Authentication Required)
// ============================================

/**
 * @route   GET /api/services/admin/statistics
 * @desc    Get service statistics for admin dashboard
 * @access  Private/Admin
 */
serviceRoutes.get(
  "/admin/statistics",
  passportAuthenticateJWT,
  authorizeRoles([Roles.ADMIN]),
  getServiceStatisticsController
);

/**
 * @route   POST /api/services
 * @desc    Create a new service
 * @access  Private/Admin/Employee
 * @body    FormData: name, description, price, duration, category, applicablePetTypes[], applicablePetSizes[], images[]
 */
serviceRoutes.post(
  "/",
  passportAuthenticateJWT,
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  createServiceController
);

/**
 * @route   PUT /api/services/:id
 * @desc    Update a service
 * @access  Private/Admin
 * @params  Path: id (MongoDB ObjectId)
 * @body    FormData: Any service fields to update
 */
serviceRoutes.put(
  "/:id",
  passportAuthenticateJWT,
  authorizeRoles([Roles.ADMIN]),
  updateServiceController
);

/**
 * @route   PATCH /api/services/:id/toggle-status
 * @desc    Toggle service active/inactive status
 * @access  Private/Admin
 * @params  Path: id (MongoDB ObjectId)
 */
serviceRoutes.patch(
  "/:id/toggle-status",
  passportAuthenticateJWT,
  authorizeRoles([Roles.ADMIN]),
  toggleServiceStatusController
);

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete a service (soft delete by default)
 * @access  Private/Admin
 * @params  Path: id (MongoDB ObjectId)
 * @query   hard: 'true' for permanent deletion
 */
serviceRoutes.delete(
  "/:id",
  passportAuthenticateJWT,
  authorizeRoles([Roles.ADMIN]),
  deleteServiceController
);

export default serviceRoutes;
