import { Roles } from "../enums/role.enum";
import { GenderType, StatusUser, StatusUserType } from "../enums/status-user.enum";
import UserModel from "../models/user.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { deleteFile } from "../utils/file-uploade";

export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    throw new BadRequestException("User not found");
  }
  if(user.status === StatusUser.BLOCKED) {
    throw new BadRequestException("Your account is blocked. Please contact support.");
  }

  return { user };
};

export const getProfileByIdService = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    throw new BadRequestException("User not found");
  }

  return { user };
};
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

interface CustomerFilters {
  search?: string;
  status?: StatusUserType;
  page?: number;
  limit?: number;
}

// Get all customers with filtering options
export const getAllCustomersService = async ({
  search,
  status,
  page = 1,
  limit = 10,
}: CustomerFilters) => {
  // Build filter query
  const query: any = {
    role: Roles.CUSTOMER, // Only get users with CUSTOMER role
  };

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  // Get total count for pagination
  const totalUsers = await UserModel.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);

  // Get paginated users
  const users = await UserModel.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return { users, totalUsers, totalPages };
};

// Get customer by ID
export const getCustomerByIdService = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    throw new NotFoundException("User not found");
  }

  // Verify the user is a customer
  if (user.role !== Roles.CUSTOMER) {
    throw new BadRequestException("User is not a customer");
  }

  return { user };
};

// Change user status (block/unblock)
export const changeUserStatusService = async (
  userId: string,
  status: StatusUserType
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  // Verify the user is a customer
  if (user.role !== Roles.CUSTOMER) {
    throw new BadRequestException("User is not a customer");
  }

  // Only allow ACTIVE or BANNED status changes
  if (status !== StatusUser.ACTIVE && status !== StatusUser.BLOCKED) {
    throw new BadRequestException("Invalid status change. Only ACTIVE or BLOCKED status is allowed.");
  }

  user.status = status;
  const updatedUser = await user.save();

  return { updatedUser };
};