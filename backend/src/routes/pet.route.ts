import express from "express";
import * as controller from "../controllers/pet.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";
const petRoutes = express.Router();

// Routes cơ bản CRUD
// Get user's pets with filters
petRoutes.get("/", controller.getUserPetsController);

// Get all pets (admin/employee only)
petRoutes.get(
  "/all",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  controller.getAllPetsController
);

// Get statistics
petRoutes.get("/stats", controller.getPetStatsController);

// Get pet by ID
petRoutes.get("/:id", controller.getPetByIdController);

// Create pet
petRoutes.post("/", controller.createPetWithImageController);
petRoutes.post("/without-picture", controller.createPetController);

// Update pet
petRoutes.put("/:id", controller.updatePetController);

// Delete pet
petRoutes.delete("/:id", controller.deletePetController);

// Update picture
petRoutes.post("/:id/image", controller.updatePetImageController);

// Vaccination management
petRoutes.post("/:id/vaccinations", controller.addVaccinationController);
petRoutes.put(
  "/:id/vaccinations/:vaccinationId",
  controller.updateVaccinationController
);
petRoutes.delete(
  "/:id/vaccinations/:vaccinationId",
  controller.deleteVaccinationController
);

// Medical record management
petRoutes.post("/:id/medical", controller.addMedicalRecordController);
petRoutes.put(
  "/:id/medical/:recordId",
  controller.updateMedicalRecordController
);
petRoutes.delete(
  "/:id/medical/:recordId",
  controller.deleteMedicalRecordController
);

export default petRoutes;
