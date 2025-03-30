import { GenderType } from "../enums/status-user.enum";
import UserModel from "../models/user.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { deleteFile } from "../utils/file-uploade";

export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    throw new BadRequestException("User not found");
  }

  return { user };
};

export const getProfileByIdService = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    throw new BadRequestException("User not found");
  }

  return { user };
}
export const updateProfileService = async ({
  userId,
  body,
}: {
  userId: string;
  body: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    gender?: GenderType;
  };
}) => {
  const { fullName, email, phoneNumber, gender } = body;

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("User not found");
  }
  user.fullName = fullName || user.fullName;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.gender = gender || user.gender;

  const updatedUser = await user.save();

  return { updatedUser };
};

interface ProfilePictureUpdate {
  userId: string;
  file?: Express.Multer.File;
}

export const changeProfilePictureService = async ({
  userId,
  file,
}: ProfilePictureUpdate) => {
  // Find user by ID
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (!file) {
    throw new BadRequestException("No file uploaded");
  }

  if (user.profilePicture && user.profilePicture.publicId) {
    try {
      await deleteFile(user.profilePicture.publicId);
    } catch (error) {
      console.error("Failed to delete old profile picture:", error);
    }
  }

  user.profilePicture = {
    url: file.path,
    publicId: file.filename,
  };

  const updatedUser = await user.save();

  return { updatedUser };
};
