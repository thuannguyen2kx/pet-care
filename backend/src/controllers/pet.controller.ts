import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  getUserPetsService,
  getPetByIdService,
  createPetService,
  updatePetService,
  deletePetService,
  updatePetPictureService,
  addVaccinationService,
  addMedicalRecordService
} from "../services/pet.service";
import { HTTPSTATUS } from "../config/http.config";
import { uploadPetPicture } from "../utils/file-uploade";
import { createPetSchema, medicalRecordSchema, petIdSchema, updatePetSchema, vaccinationSchema } from "../validation/pet.validatioin";
import { userIdSchema } from "../validation/user.validation";

/**
 * @desc    Lấy danh sách thú cưng của người dùng đăng nhập
 * @route   GET /api/pets
 * @access  Private
 */
export const getUserPetsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = userIdSchema.parse(req.params.userId);
    const { pets } = await getUserPetsService(userId);
    
    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách thú cưng thành công",
      pets,
    });
  }
);

/**
 * @desc    Lấy thông tin thú cưng theo ID
 * @route   GET /api/pets/:id
 * @access  Private
 */
export const getPetByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const petId = petIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    const role = req.user?.role;
    
    const { pet } = await getPetByIdService({ petId, userId, role });
    
    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thông tin thú cưng thành công",
      pet,
    });
  }
);

/**
 * @desc    Tạo thú cưng mới (không kèm ảnh)
 * @route   POST /api/pets
 * @access  Private
 */
export const createPetController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { name, species, breed, age, weight, gender, habits, allergies, specialNeeds } = createPetSchema.parse({...req.body});
    
    // Chuyển đổi habits và allergies từ chuỗi thành mảng nếu cần
    const petData = {
      name,
      species,
      breed,
      age: age ? Number(age) : undefined,
      weight: weight ? Number(weight) : undefined,
      gender,
      habits: habits ? (typeof habits === 'string' ? habits.split(',').map(item => item.trim()) : habits) : [],
      allergies: allergies ? (typeof allergies === 'string' ? allergies.split(',').map(item => item.trim()) : allergies) : [],
      specialNeeds
    };
    
    const { pet } = await createPetService({ userId, petData });
    
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Tạo thú cưng thành công",
      pet,
    });
  }
);

/**
 * @desc    Tạo thú cưng mới (có kèm ảnh)
 * @route   POST /api/pets/with-picture
 * @access  Private
 */
export const createPetWithPictureController = [
  uploadPetPicture.single("petPicture"),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { name, species, breed, age, weight, gender, habits, allergies, specialNeeds } = createPetSchema.parse({...req.body});
    
    // Chuyển đổi habits và allergies từ chuỗi thành mảng nếu cần
    const petData = {
      name,
      species,
      breed,
      age: age ? Number(age) : undefined,
      weight: weight ? Number(weight) : undefined,
      gender,
      habits: habits ? (typeof habits === 'string' ? habits.split(',').map(item => item.trim()) : habits) : [],
      allergies: allergies ? (typeof allergies === 'string' ? allergies.split(',').map(item => item.trim()) : allergies) : [],
      specialNeeds
    };
    
    // Tạo thú cưng với ảnh
    const { pet } = await createPetService({ 
      userId, 
      petData,
      file: req.file
    });
    
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Tạo thú cưng thành công",
      pet,
    });
  }),
];

/**
 * @desc    Cập nhật thông tin thú cưng
 * @route   PUT /api/pets/:id
 * @access  Private
 */
export const updatePetController = asyncHandler(
  async (req: Request, res: Response) => {
    const petId = petIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { name, species, breed, age, weight, gender, habits, allergies, specialNeeds } = updatePetSchema.parse({...req.body});
    
    // Chuẩn bị dữ liệu cập nhật
    const updateData: any = {};
    if (name) updateData.name = name;
    if (species) updateData.species = species;
    if (breed) updateData.breed = breed;
    if (age !== undefined) updateData.age = Number(age);
    if (weight !== undefined) updateData.weight = Number(weight);
    if (gender) updateData.gender = gender;
    
    if (habits) {
      updateData.habits = typeof habits === 'string' 
        ? habits.split(',').map(item => item.trim()) 
        : habits;
    }
    
    if (allergies) {
      updateData.allergies = typeof allergies === 'string' 
        ? allergies.split(',').map(item => item.trim()) 
        : allergies;
    }
    
    if (specialNeeds !== undefined) updateData.specialNeeds = specialNeeds;
    
    const { pet } = await updatePetService({ petId, userId, updateData });
    
    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật thông tin thú cưng thành công",
      pet,
    });
  }
);

/**
 * @desc    Xóa thú cưng
 * @route   DELETE /api/pets/:id
 * @access  Private
 */
export const deletePetController = asyncHandler(
  async (req: Request, res: Response) => {
    const petId = petIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    
    const result = await deletePetService({ petId, userId });
    
    return res.status(HTTPSTATUS.OK).json({
      message: result.message,
    });
  }
);

/**
 * @desc    Cập nhật ảnh đại diện cho thú cưng
 * @route   POST /api/pets/:id/picture
 * @access  Private
 */
export const updatePetPictureController = [
  uploadPetPicture.single("petPicture"),
  asyncHandler(async (req: Request, res: Response) => {
    const petId =  petIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    
    const { pet } = await updatePetPictureService({
      petId,
      userId,
      file: req.file,
    });
    
    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật ảnh đại diện thú cưng thành công",
      pet,
    });
  }),
];

/**
 * @desc    Thêm thông tin tiêm phòng cho thú cưng
 * @route   POST /api/pets/:id/vaccinations
 * @access  Private
 */
export const addVaccinationController = asyncHandler(
  async (req: Request, res: Response) => {
    const petId = petIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { name, date, expiryDate, certificate } = vaccinationSchema.parse(req.body);
    
    const vaccinationData = {
      name,
      date: new Date(date),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      certificate
    };
    
    const { pet } = await addVaccinationService({
      petId,
      userId,
      role: req.user?.role,
      vaccinationData
    });
    
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Thêm thông tin tiêm phòng thành công",
      pet,
    });
  }
);

/**
 * @desc    Thêm lịch sử y tế cho thú cưng
 * @route   POST /api/pets/:id/medical
 * @access  Private
 */
export const addMedicalRecordController = asyncHandler(
  async (req: Request, res: Response) => {
    const petId = petIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { condition, diagnosis, treatment, notes } = medicalRecordSchema.parse(req.body);
    
    const medicalData = {
      condition,
      diagnosis: new Date(diagnosis),
      treatment,
      notes
    };
    
    const { pet } = await addMedicalRecordService({
      petId,
      userId,
      role: req.user?.role,
      medicalData
    });
    
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Thêm lịch sử y tế thành công",
      pet,
    });
  }
);