import express from "express";
import {
  getUserPetsController,
  getPetByIdController,
  createPetController,
  createPetWithPictureController,
  updatePetController,
  deletePetController,
  updatePetPictureController,
  addVaccinationController,
  addMedicalRecordController,
} from "../controllers/pet.controller";


const petRoutes = express.Router();



// Routes cơ bản CRUD
petRoutes
  .route("/:userId")
  .get(getUserPetsController)

petRoutes.post("/", createPetController);

// Route tạo pet kèm ảnh 
petRoutes.post("/with-picture", createPetWithPictureController);

petRoutes
  .route("/:id")
  .get(getPetByIdController)
  .put( 
    updatePetController
  )
  .delete(deletePetController);

// Route cập nhật ảnh đại diện
petRoutes.post(
  "/:id/picture",
  updatePetPictureController
);

// Route thêm tiêm phòng
petRoutes.post(
  "/:id/vaccinations", 
  addVaccinationController
);

// Route thêm lịch sử y tế
petRoutes.post(
  "/:id/medical", 
  addMedicalRecordController
);

export default petRoutes;