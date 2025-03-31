import { Types } from "mongoose";
import PetModel, { IPet } from "../models/pet.model";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/app-error";
import { deleteFile } from "../utils/file-uploade";

/**
 * Service để lấy danh sách thú cưng của người dùng
 */
export const getUserPetsService = async (userId: string) => {
  const pets = await PetModel.find({ ownerId: userId });
  return { pets };
};

/**
 * Service để lấy thông tin thú cưng theo id
 */
export const getPetByIdService = async ({ petId, userId }: { petId: string; userId: string }) => {
  const pet = await PetModel.findById(petId);
  if (!pet) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  } 
  // Kiểm tra quyền truy cập
  if (!pet.ownerId.equals(userId)) {
  throw new UnauthorizedException("Không có quyền truy cập thú cưng này");
}
  
  return { pet };
};

/**
 * Service để tạo thú cưng mới
 */
export const createPetService = async ({
  userId,
  petData,
  file
}: {
  userId: string;
  petData: {
    name: string;
    species: string;
    breed?: string;
    age?: number;
    weight?: number;
    gender?: string;
    habits?: string[];
    allergies?: string[];
    specialNeeds?: string;
  };
  file?: Express.Multer.File;
}) => {
  // Chuẩn bị dữ liệu thú cưng
  const petInfo: any = {
    ownerId: userId,
    ...petData,
    habits: Array.isArray(petData.habits) ? petData.habits : [],
    allergies: Array.isArray(petData.allergies) ? petData.allergies : [],
  };
  
  // Nếu có file ảnh, thêm thông tin ảnh
  if (file) {
    petInfo.profilePicture = {
      url: file.path,
      publicId: file.filename
    };
  }
  
  // Tạo thú cưng mới
  const pet = await PetModel.create(petInfo);
  
  return { pet };
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
  userId: string;
  updateData: Partial<IPet>;
}) => {
  const pet = await PetModel.findById(petId);
  
  if (!pet) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }
  
  // Kiểm tra quyền truy cập
  if (!pet.ownerId.equals(userId)) {
    throw new UnauthorizedException("Không có quyền cập nhật thú cưng này");
  }
  
  // Cập nhật thông tin
  Object.keys(updateData).forEach((key) => {
    if (key !== 'ownerId' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'profilePicture') {
      // @ts-ignore - Động với các thuộc tính
      pet[key] = updateData[key];
    }
  });
  
  const updatedPet = await pet.save();
  return { pet: updatedPet };
};

/**
 * Service để xóa thú cưng
 */
export const deletePetService = async ({ petId, userId }: { petId: string; userId: string }) => {
  const pet = await PetModel.findById(petId);
  
  if (!pet) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }
  
  // Kiểm tra quyền truy cập
  if (!pet.ownerId.equals(userId)) {
    throw new UnauthorizedException("Không có quyền xóa thú cưng này");
  }
  
  // Xóa ảnh đại diện trên cloud nếu có
  if (pet.profilePicture && pet.profilePicture.publicId) {
    try {
      await deleteFile(pet.profilePicture.publicId);
    } catch (error) {
      console.error("Lỗi khi xóa ảnh đại diện:", error);
    }
  }
  
  await pet.deleteOne();
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
  userId: string;
  file?: Express.Multer.File;
}) => {
  const pet = await PetModel.findById(petId);
  
  if (!pet) {
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
  if (pet.profilePicture && pet.profilePicture.publicId) {
    try {
      await deleteFile(pet.profilePicture.publicId);
    } catch (error) {
      console.error("Lỗi khi xóa ảnh đại diện cũ:", error);
    }
  }
  
  // Cập nhật ảnh mới
  pet.profilePicture = {
    url: file.path,
    publicId: file.filename,
  };
  
  const updatedPet = await pet.save();
  return { pet: updatedPet };
};

/**
 * Service để thêm thông tin tiêm phòng cho thú cưng
 */
export const addVaccinationService = async ({
  petId,
  userId,
  vaccinationData,
}: {
  petId: string;
  userId: string;
  vaccinationData: {
    name: string;
    date: Date;
    expiryDate?: Date;
    certificate?: string;
  };
}) => {
  const pet = await PetModel.findById(petId);
  
  if (!pet) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }
  
  // Kiểm tra quyền truy cập
  if (!pet.ownerId.equals(userId)) {
    throw new UnauthorizedException("Không có quyền cập nhật thú cưng này");
  }
  
  if (!pet.vaccinations) {
    pet.vaccinations = [];
  }
  
  pet.vaccinations.push(vaccinationData);
  const updatedPet = await pet.save();
  
  return { pet: updatedPet };
};

/**
 * Service để thêm lịch sử y tế cho thú cưng
 */
export const addMedicalRecordService = async ({
  petId,
  userId,
  medicalData,
}: {
  petId: string;
  userId: string;
  medicalData: {
    condition: string;
    diagnosis: Date;
    treatment?: string;
    notes?: string;
  };
}) => {
  const pet = await PetModel.findById(petId);
  
  if (!pet) {
    throw new NotFoundException("Không tìm thấy thú cưng");
  }
  
  // Kiểm tra quyền truy cập
  if (!pet.ownerId.equals(userId)) {
    throw new UnauthorizedException("Không có quyền cập nhật thú cưng này");
  }
  
  if (!pet.medicalHistory) {
    pet.medicalHistory = [];
  }
  
  pet.medicalHistory.push(medicalData);
  const updatedPet = await pet.save();
  
  return { pet: updatedPet };
};