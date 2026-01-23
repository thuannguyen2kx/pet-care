import PetModel, { IPet } from "../models/pet.model";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/app-error";
import { deleteFile } from "../utils/file-uploade";
import { Roles, RoleType } from "../enums/role.enum";
import mongoose, { Types } from "mongoose";
import { PetGender, PetType } from "../enums/pet";
import {
  PetFilterQuery,
  PetListResponse,
  PetResponse,
  PetStatsResponse,
} from "../@types/pet";
import { BookingModel } from "../models/booking.model";
import { parseDateOnly } from "../utils/format-date";

// Helper: Convert Pet document to PetResponse
const formatPetResponse = (pet: IPet): PetResponse => {
  return {
    _id: pet._id.toString(),
    ownerId: pet.ownerId.toString(),
    name: pet.name,
    type: pet.type as PetType,
    breed: pet.breed,
    gender: pet.gender as PetGender,
    dateOfBirth: pet.dateOfBirth.toISOString(),
    weight: pet.weight,
    color: pet.color,
    microchipId: pet.microchipId,
    isNeutered: pet.isNeutered,
    allergies: pet.allergies || [],
    medicalNotes: pet.medicalNotes,
    vaccinations: pet.vaccinations?.map((v) => ({
      _id: v._id?.toString() || "",
      name: v.name,
      date: v.date.toISOString(),
      expiryDate: v.expiryDate?.toISOString(),
      nextDueDate: v.nextDueDate?.toISOString(),
      batchNumber: v.batchNumber,
      veterinarianName: v.veterinarianName,
      clinicName: v.clinicName,
      certificate: v.certificate,
      notes: v.notes,
    })),
    medicalHistory: pet.medicalHistory?.map((m) => ({
      _id: m._id?.toString() || "",
      condition: m.condition,
      diagnosis: m.diagnosis.toISOString(),
      treatment: m.treatment,
      veterinarianName: m.veterinarianName,
      clinicName: m.clinicName,
      followUpDate: m.followUpDate?.toISOString(),
      cost: m.cost,
      notes: m.notes,
    })),
    image: pet.image,
    isActive: pet.isActive,
    createdAt: pet.createdAt.toISOString(),
    updatedAt: pet.updatedAt.toISOString(),
  };
};

/**
 * Service để lấy danh sách thú cưng của người dùng
 */
export const getUserPetsService = async (userId: Types.ObjectId) => {
  const pets = await PetModel.find({ ownerId: userId, isActive: true });
  return { pets: pets.map(formatPetResponse) };
};
export const getPetStatsService = async (
  userId: Types.ObjectId,
): Promise<PetStatsResponse> => {
  const pets = await PetModel.find({ ownerId: userId, isActive: true });

  const stats: PetStatsResponse = {
    totalPets: pets.length,
    byType: {
      dog: 0,
      cat: 0,
    },
    byGender: {
      male: 0,
      female: 0,
    },
    upcomingVaccinations: 0,
  };

  let totalAge = 0;
  const today = new Date();
  const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  pets.forEach((pet) => {
    stats.byType[pet.type as PetType]++;
    stats.byGender[pet.gender as PetGender]++;

    // Check upcoming vaccinations
    if (pet.vaccinations) {
      const hasUpcoming = pet.vaccinations.some(
        (v) =>
          v.nextDueDate && v.nextDueDate >= today && v.nextDueDate <= in30Days,
      );
      if (hasUpcoming) stats.upcomingVaccinations++;
    }
  });

  return stats;
};
// Get all pets (admin/employee)
export const getAllPetsService = async (
  filters?: PetFilterQuery,
  role?: RoleType,
): Promise<PetListResponse> => {
  if (role !== Roles.ADMIN && role !== Roles.EMPLOYEE) {
    throw new UnauthorizedException("Không có quyền xem tất cả thú cưng");
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const skip = (page - 1) * limit;

  const query: any = { isActive: true };

  // Apply same filters as getUserPetsService
  if (filters?.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { breed: { $regex: filters.search, $options: "i" } },
      { microchipId: { $regex: filters.search, $options: "i" } },
    ];
  }

  if (filters?.type) query.type = filters.type;
  if (filters?.gender) query.gender = filters.gender;
  if (filters?.isNeutered !== undefined) query.isNeutered = filters.isNeutered;

  const sortBy = filters?.sortBy || "createdAt";
  const sortOrder = filters?.sortOrder === "asc" ? 1 : -1;
  const sort: any = { [sortBy]: sortOrder };

  const [pets, total] = await Promise.all([
    PetModel.find(query)
      .populate("ownerId", "fullName email phoneNumber")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    PetModel.countDocuments(query),
  ]);

  return {
    pets: pets.map(formatPetResponse),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Service để lấy thông tin thú cưng theo id
 */
export const getPetByIdService = async ({
  petId,
  userId,
  role,
}: {
  petId: string;
  userId: Types.ObjectId;
  role: RoleType | undefined;
}) => {
  const pet = await PetModel.findById(petId);
  if (!pet || !pet.isActive) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }

  if (
    !(
      pet.ownerId.equals(userId) ||
      role === Roles.ADMIN ||
      role === Roles.EMPLOYEE
    )
  ) {
    throw new UnauthorizedException("Không có quyền cập nhật thú cưng này");
  }

  return { pet: formatPetResponse(pet) };
};

/**
 * Service để tạo thú cưng mới
 */
export const createPetService = async ({
  userId,
  petData,
  file,
}: {
  userId: Types.ObjectId;
  petData: {
    name: string;
    type: string;
    breed: string;
    gender: string;
    dateOfBirth: string;
    weight: number;
    color: string;
    microchipId?: string;
    isNeutered?: boolean;
    allergies?: string[];
    medicalNotes?: string;
  };
  file?: Express.Multer.File;
}) => {
  // Chuẩn bị dữ liệu thú cưng
  const petInfo: any = {
    ownerId: userId,
    name: petData.name,
    type: petData.type,
    breed: petData.breed,
    gender: petData.gender,
    dateOfBirth: new Date(petData.dateOfBirth),
    weight: Number(petData.weight),
    color: petData.color,
    microchipId: petData.microchipId,
    isNeutered: petData.isNeutered || false,
    allergies: petData.allergies || [],
    medicalNotes: petData.medicalNotes,
  };

  if (file) {
    petInfo.image = {
      url: file.path,
      publicId: file.filename,
    };
  }

  const pet = await PetModel.create(petInfo);

  return { pet: formatPetResponse(pet) };
};

/**
 * Service để cập nhật thông tin thú cưng
 */
export const updatePetService = async ({
  petId,
  userId,
  updateData,
}: {
  petId: string;
  userId: Types.ObjectId;
  updateData: Partial<IPet>;
}) => {
  const pet = await PetModel.findOne({ _id: petId, isActive: true });

  if (!pet) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }

  if (!pet.ownerId.equals(userId)) {
    throw new UnauthorizedException("Không có quyền cập nhật thú cưng này");
  }

  if (updateData.microchipId && updateData.microchipId !== pet.microchipId) {
    const existingPet = await PetModel.findOne({
      microchipId: updateData.microchipId,
      _id: { $ne: petId },
    });

    if (existingPet) {
      throw new BadRequestException(
        "Mã chip này đã được đăng ký cho thú cưng khác",
      );
    }
  }

  const updatedPet = await PetModel.findByIdAndUpdate(
    petId,
    { $set: updateData },
    {
      new: true,
      runValidators: false,
    },
  );

  return { pet: formatPetResponse(updatedPet!) };
};

/**
 * Service để xóa thú cưng
 */
export const deletePetService = async ({
  petId,
  userId,
}: {
  petId: string;
  userId: Types.ObjectId;
}) => {
  const pet = await PetModel.findById(petId);

  if (!pet || !pet.isActive) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }

  // Kiểm tra quyền truy cập
  if (!pet.ownerId.equals(userId)) {
    throw new UnauthorizedException("Không có quyền xóa thú cưng này");
  }

  // Check for upcoming appointments
  const upcomingAppointments = await BookingModel.countDocuments({
    petId: petId,
    scheduledDate: { $gte: parseDateOnly(new Date().toISOString()) },
    status: { $in: ["pending", "confirmed"] },
  });

  if (upcomingAppointments > 0) {
    throw new BadRequestException(
      `Không thể xóa thú cưng vì còn ${upcomingAppointments} lịch hẹn sắp tới`,
    );
  }

  pet.isActive = false;
  await pet.save();
  return { message: "Đã xóa thú cưng thành công" };
};

/**
 * Service để cập nhật ảnh đại diện của thú cưng
 */
export const updatePetPictureService = async ({
  petId,
  userId,
  file,
}: {
  petId: string;
  userId: Types.ObjectId;
  file?: Express.Multer.File;
}) => {
  const pet = await PetModel.findById(petId);
  if (!pet || !pet.isActive) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }

  // Kiểm tra quyền truy cập
  if (!pet.ownerId.equals(userId)) {
    throw new UnauthorizedException("Không có quyền cập nhật thú cưng này");
  }

  if (!file) {
    throw new BadRequestException("Không có file được tải lên");
  }

  // Xóa ảnh cũ nếu có
  if (pet.image && pet.image.publicId) {
    try {
      await deleteFile(pet.image.publicId);
    } catch (error) {
      console.error("Lỗi khi xóa ảnh đại diện cũ:", error);
    }
  }

  // Cập nhật ảnh mới
  pet.image = {
    url: file.path,
    publicId: file.filename,
  };

  const updatedPet = await pet.save();
  return { pet: formatPetResponse(updatedPet) };
};

/**
 * Service để thêm thông tin tiêm phòng cho thú cưng
 */
export const addVaccinationService = async ({
  petId,
  userId,
  role,
  vaccinationData,
}: {
  petId: string;
  userId: Types.ObjectId;
  role: RoleType | undefined;
  vaccinationData: {
    name: string;
    date: Date;
    expiryDate?: Date;
    nextDueDate?: Date;
    batchNumber?: string;
    veterinarianName?: string;
    clinicName?: string;
    certificate?: string;
    notes?: string;
  };
}) => {
  const pet = await PetModel.findById(petId);

  if (!pet || !pet.isActive) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }

  // Kiểm tra quyền truy cập
  if (
    !(
      pet.ownerId.equals(userId) ||
      role === Roles.ADMIN ||
      role === Roles.EMPLOYEE
    )
  ) {
    throw new UnauthorizedException("Không có quyền cập nhật thú cưng này");
  }

  if (!pet.vaccinations) {
    pet.vaccinations = [];
  }

  pet.vaccinations.push(vaccinationData);
  const updatedPet = await pet.save();

  return { pet: formatPetResponse(updatedPet) };
};

export const updateVaccinationService = async ({
  petId,
  vaccinationId,
  userId,
  role,
  updateData,
}: {
  petId: string;
  vaccinationId: string;
  userId: Types.ObjectId;
  role: RoleType | undefined;
  updateData: any;
}): Promise<{ pet: PetResponse }> => {
  const pet = await PetModel.findById(petId);

  if (!pet || !pet.isActive) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }

  if (
    !(
      pet.ownerId.equals(userId) ||
      role === Roles.ADMIN ||
      role === Roles.EMPLOYEE
    )
  ) {
    throw new UnauthorizedException("Không có quyền cập nhật");
  }

  const vaccination = pet.vaccinations?.find(
    (v) => v._id?.toString() === vaccinationId,
  );
  if (!vaccination) {
    throw new NotFoundException("Không tìm thấy thông tin tiêm phòng");
  }

  Object.keys(updateData).forEach((key) => {
    if (key === "date" || key === "expiryDate" || key === "nextDueDate") {
      (vaccination as any)[key] = new Date(updateData[key]);
    } else {
      (vaccination as any)[key] = updateData[key];
    }
  });

  const updatedPet = await pet.save();
  return { pet: formatPetResponse(updatedPet) };
};

export const deleteVaccinationService = async ({
  petId,
  vaccinationId,
  userId,
  role,
}: {
  petId: string;
  vaccinationId: string;
  userId: Types.ObjectId;
  role: RoleType | undefined;
}): Promise<{ pet: PetResponse }> => {
  const pet = await PetModel.findById(petId);

  if (!pet || !pet.isActive) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }

  if (
    !(
      pet.ownerId.equals(userId) ||
      role === Roles.ADMIN ||
      role === Roles.EMPLOYEE
    )
  ) {
    throw new UnauthorizedException("Không có quyền xóa");
  }

  pet.vaccinations = pet.vaccinations?.filter(
    (v) => v._id?.toString() !== vaccinationId,
  );
  const updatedPet = await pet.save();
  return { pet: formatPetResponse(updatedPet) };
};

/**
 * Service để thêm lịch sử y tế cho thú cưng
 */
export const addMedicalRecordService = async ({
  petId,
  userId,
  role,
  medicalData,
}: {
  petId: string;
  userId: Types.ObjectId;
  role: RoleType | undefined;
  medicalData: {
    condition: string;
    diagnosis: Date;
    treatment?: string;
    notes?: string;
  };
}) => {
  const pet = await PetModel.findById(petId);

  if (!pet || !pet.isActive) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }

  if (
    !(
      pet.ownerId.equals(userId) ||
      role === Roles.ADMIN ||
      role === Roles.EMPLOYEE
    )
  ) {
    throw new UnauthorizedException("Không có quyền cập nhật thú cưng này");
  }

  if (!pet.medicalHistory) {
    pet.medicalHistory = [];
  }

  pet.medicalHistory.push(medicalData);
  const updatedPet = await pet.save();

  return { pet: formatPetResponse(updatedPet) };
};

// Update medical record
export const updateMedicalRecordService = async ({
  petId,
  recordId,
  userId,
  role,
  updateData,
}: {
  petId: string;
  recordId: string;
  userId: Types.ObjectId;
  role: RoleType | undefined;
  updateData: any;
}): Promise<{ pet: PetResponse }> => {
  const pet = await PetModel.findById(petId);

  if (!pet || !pet.isActive) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }

  if (
    !(
      pet.ownerId.equals(userId) ||
      role === Roles.ADMIN ||
      role === Roles.EMPLOYEE
    )
  ) {
    throw new UnauthorizedException("Không có quyền cập nhật");
  }

  const record = pet.medicalHistory?.find(
    (m) => m._id?.toString() === recordId,
  );
  if (!record) {
    throw new NotFoundException("Không tìm thấy hồ sơ y tế");
  }

  Object.keys(updateData).forEach((key) => {
    if (key === "diagnosis" || key === "followUpDate") {
      (record as any)[key] = new Date(updateData[key]);
    } else {
      (record as any)[key] = updateData[key];
    }
  });

  const updatedPet = await pet.save();
  return { pet: formatPetResponse(updatedPet) };
};

// Delete medical record
export const deleteMedicalRecordService = async ({
  petId,
  recordId,
  userId,
  role,
}: {
  petId: string;
  recordId: string;
  userId: Types.ObjectId;
  role: RoleType | undefined;
}): Promise<{ pet: PetResponse }> => {
  const pet = await PetModel.findById(petId);

  if (!pet || !pet.isActive) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }

  if (
    !(
      pet.ownerId.equals(userId) ||
      role === Roles.ADMIN ||
      role === Roles.EMPLOYEE
    )
  ) {
    throw new UnauthorizedException("Không có quyền xóa");
  }

  pet.medicalHistory = pet.medicalHistory?.filter(
    (m) => m._id?.toString() !== recordId,
  );
  const updatedPet = await pet.save();
  return { pet: formatPetResponse(updatedPet) };
};
