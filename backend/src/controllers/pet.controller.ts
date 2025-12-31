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
  addMedicalRecordService,
  getAllPetsService,
  updateVaccinationService,
  deleteVaccinationService,
  updateMedicalRecordService,
  deleteMedicalRecordService,
  getPetStatsService,
} from "../services/pet.service";
import { HTTPSTATUS } from "../config/http.config";
import { uploadPetPicture } from "../utils/file-uploade";
import {
  createPetSchema,
  medicalRecordSchema,
  petFilterSchema,
  petIdSchema,
  updatePetSchema,
  vaccinationSchema,
} from "../validation/pet.validatioin";
import { userIdSchema } from "../validation/user.validation";

/**
 * @desc    Lấy danh sách thú cưng của người dùng đăng nhập
 * @route   GET /api/pets
 * @access  Private
 */
export const getUserPetsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { pets } = await getUserPetsService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách thú cưng thành công",
      data: pets,
    });
  }
);

/**
 * @desc    Get all pets (admin/employee only)
 * @route   GET /api/pets/all
 * @access  Private (Admin/Employee)
 */
export const getAllPetsController = asyncHandler(
  async (req: Request, res: Response) => {
    const role = req.user?.role;
    const filters = petFilterSchema.parse(req.query);

    const result = await getAllPetsService(filters, role);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách tất cả thú cưng thành công",
      data: {
        ...result,
      },
    });
  }
);

/**
 * @desc    Get pet statistics
 * @route   GET /api/pets/stats
 * @access  Private
 */
export const getPetStatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const stats = await getPetStatsService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thống kê thành công",
      data: stats,
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
    const userId = req.user!._id;
    const role = req.user?.role;

    const { pet } = await getPetByIdService({ petId, userId, role });

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thông tin thú cưng thành công",
      data: pet,
    });
  }
);

/**
 * @desc    Create pet without picture
 * @route   POST /api/pets
 * @access  Private
 */
export const createPetController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const petData = createPetSchema.parse(req.body);

    const { pet } = await createPetService({ userId, petData });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Tạo thú cưng thành công",
      data: pet,
    });
  }
);

/**
 * @desc    Create pet with picture
 * @route   POST /api/pets/with-picture
 * @access  Private
 */
export const createPetWithImageController = [
  uploadPetPicture.single("petImage"),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const petData = createPetSchema.parse(req.body);

    const { pet } = await createPetService({
      userId,
      petData,
      file: req.file,
    });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Tạo thú cưng thành công",
      data: pet,
    });
  }),
];

/**
 * @desc    Update pet
 * @route   PUT /api/pets/:id
 * @access  Private
 */
export const updatePetController = asyncHandler(
  async (req: Request, res: Response) => {
    const petId = petIdSchema.parse(req.params.id);
    const userId = req.user!._id;
    const updateData = updatePetSchema.parse(req.body);

    const { dateOfBirth, ...rest } = updateData;
    const normalizedUpdateData = {
      ...rest,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    };
    const { pet } = await updatePetService({
      petId,
      userId,
      updateData: normalizedUpdateData,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật thông tin thú cưng thành công",
      data: pet,
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
    const userId = req.user!._id;

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
export const updatePetImageController = [
  uploadPetPicture.single("petImage"),
  asyncHandler(async (req: Request, res: Response) => {
    const petId = petIdSchema.parse(req.params.id);
    const userId = req.user!._id;

    const { pet } = await updatePetPictureService({
      petId,
      userId,
      file: req.file,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật ảnh đại diện thú cưng thành công",
      data: pet,
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
    const userId = req.user!._id;
    const { name, date, expiryDate, certificate } = vaccinationSchema.parse(
      req.body
    );

    const vaccinationData = {
      name,
      date: new Date(date),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      certificate,
    };

    const { pet } = await addVaccinationService({
      petId,
      userId,
      role: req.user?.role,
      vaccinationData,
    });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Thêm thông tin tiêm phòng thành công",
      data: pet,
    });
  }
);
/**
 * @desc    Update vaccination record
 * @route   PUT /api/pets/:id/vaccinations/:vaccinationId
 * @access  Private
 */
export const updateVaccinationController = asyncHandler(
  async (req: Request, res: Response) => {
    const petId = petIdSchema.parse(req.params.id);
    const vaccinationId = petIdSchema.parse(req.params.vaccinationId);
    const userId = req.user!._id;
    const role = req.user?.role;
    const updateData = vaccinationSchema.partial().parse(req.body);

    const { pet } = await updateVaccinationService({
      petId,
      vaccinationId,
      userId,
      role,
      updateData,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật thông tin tiêm phòng thành công",
      data: pet,
    });
  }
);

/**
 * @desc    Delete vaccination record
 * @route   DELETE /api/pets/:id/vaccinations/:vaccinationId
 * @access  Private
 */
export const deleteVaccinationController = asyncHandler(
  async (req: Request, res: Response) => {
    const petId = petIdSchema.parse(req.params.id);
    const vaccinationId = petIdSchema.parse(req.params.vaccinationId);
    const userId = req.user!._id;
    const role = req.user?.role;

    const { pet } = await deleteVaccinationService({
      petId,
      vaccinationId,
      userId,
      role,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Xóa thông tin tiêm phòng thành công",
      data: pet,
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
    const userId = req.user!._id;
    const { condition, diagnosis, treatment, notes } =
      medicalRecordSchema.parse(req.body);

    const medicalData = {
      condition,
      diagnosis: new Date(diagnosis),
      treatment,
      notes,
    };

    const { pet } = await addMedicalRecordService({
      petId,
      userId,
      role: req.user?.role,
      medicalData,
    });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Thêm lịch sử y tế thành công",
      data: pet,
    });
  }
);

/**
 * @desc    Update medical record
 * @route   PUT /api/pets/:id/medical/:recordId
 * @access  Private
 */
export const updateMedicalRecordController = asyncHandler(
  async (req: Request, res: Response) => {
    const petId = petIdSchema.parse(req.params.id);
    const recordId = petIdSchema.parse(req.params.recordId);
    const userId = req.user!._id;
    const role = req.user?.role;
    const updateData = medicalRecordSchema.partial().parse(req.body);

    const { pet } = await updateMedicalRecordService({
      petId,
      recordId,
      userId,
      role,
      updateData,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật hồ sơ y tế thành công",
      data: pet,
    });
  }
);

/**
 * @desc    Delete medical record
 * @route   DELETE /api/pets/:id/medical/:recordId
 * @access  Private
 */
export const deleteMedicalRecordController = asyncHandler(
  async (req: Request, res: Response) => {
    const petId = petIdSchema.parse(req.params.id);
    const recordId = petIdSchema.parse(req.params.recordId);
    const userId = req.user!._id;
    const role = req.user?.role;

    const { pet } = await deleteMedicalRecordService({
      petId,
      recordId,
      userId,
      role,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Xóa hồ sơ y tế thành công",
      data: pet,
    });
  }
);
