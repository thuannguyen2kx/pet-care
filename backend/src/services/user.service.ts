import mongoose from "mongoose";
import { Roles, RoleType } from "../enums/role.enum";
import {
  GenderType,
  UserStatus,
  UserStatusType,
} from "../enums/status-user.enum";
import UserModel from "../models/user.model";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/app-error";
import { deleteFile } from "../utils/file-uploade";
import { ProviderEnum } from "../enums/account-provider.enum";
import AccountModel from "../models/account.model";

export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    throw new NotFoundException("Người dùng không tồn tại");
  }

  if (user.status === UserStatus.INACTIVE) {
    throw new UnauthorizedException(
      "Tài khoản của bạn đã bị ngừng hoạt động. Vui lòng liên hệ với quản trị viên để được hổ trợ."
    );
  }

  return { user };
};

export const getProfileByIdService = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    throw new NotFoundException("Người dùng không tồn tại");
  }

  return { user };
};

export const updateProfileService = async (
  userId: string,
  body: {
    fullName?: string;
    phoneNumber?: string;
    gender?: GenderType | string;
    dateOfBirth?: string;
    bio?: string;
  }
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("Người dùng không tồn tại");
  }

  // Update fields
  if (body.fullName) user.fullName = body.fullName;
  if (body.phoneNumber) user.phoneNumber = body.phoneNumber;
  if (body.gender) user.gender = body.gender as GenderType;
  if (body.dateOfBirth) user.dateOfBirth = new Date(body.dateOfBirth);

  const updatedUser = await user.save();

  return { updatedUser };
};

export const updateAddressService = async (
  userId: string,
  address: {
    province: string;
    ward: string;
  }
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("Người dùng không tồn tại");
  }

  user.address = {
    ...user.address,
    ...address,
  };

  const updatedUser = await user.save();

  return { updatedUser };
};

export const updatePreferencesService = async (
  userId: string,
  preferences: {
    preferredEmployeeId?: string;
    communicationPreferences?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  }
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("Người dùng không tồn tại");
  }

  if (preferences.preferredEmployeeId) {
    user.customerInfo.preferredEmployeeId = new mongoose.Types.ObjectId(
      preferences.preferredEmployeeId
    );
  }

  if (preferences.communicationPreferences) {
    user.customerInfo.communicationPreferences = {
      ...user.customerInfo.communicationPreferences,
      ...preferences.communicationPreferences,
    };
  }

  const updatedUser = await user.save();

  return { updatedUser };
};

export const changeProfilePictureService = async (
  userId: string,
  file?: Express.Multer.File
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("Người dùng không tồn tại");
  }

  if (!file) {
    throw new BadRequestException("Không có ảnh được tải lên");
  }

  // Delete old picture if exists
  if (user.profilePicture?.publicId) {
    try {
      await deleteFile(user.profilePicture.publicId);
    } catch (error) {
      console.error("Không thể xoá ảnh đại diện cũ:", error);
    }
  }

  // Update with new picture
  user.profilePicture = {
    url: file.path,
    publicId: file.filename,
  };

  const updatedUser = await user.save();

  return { updatedUser };
};

export const deleteProfilePictureService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (user.profilePicture?.publicId) {
    try {
      await deleteFile(user.profilePicture.publicId);
    } catch (error) {
      console.error("Failed to delete profile picture:", error);
    }
  }

  user.profilePicture = {
    url: null,
    publicId: null,
  };

  const updatedUser = await user.save();

  return { updatedUser };
};

// ============================================
// ADMIN USER MANAGEMENT SERVICES
// ============================================

// Get all users with filters
export const getAllUsersService = async (filters: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const { search, role, status, page = 1, limit = 10 } = filters;

  const query: any = {};

  // Search by name or email
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by role
  if (role) {
    query.role = role;
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  const totalUsers = await UserModel.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);

  const users = await UserModel.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    users,
    totalUsers,
    totalPages,
    currentPage: page,
  };
};

export const getUserByIdService = async (userId: string) => {
  const user = await UserModel.findById(userId)
    .select("-password")
    .populate("customerInfo.preferredEmployeeId", "fullName email");

  if (!user) {
    throw new NotFoundException("Người dùng không tồn tại");
  }

  return { user };
};

export const createEmployeeService = async (data: {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  specialties: string[];
  hourlyRate?: number;
  department?: string;
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if email exists
    const existingUser = await UserModel.findOne({ email: data.email }).session(
      session
    );
    if (existingUser) {
      throw new BadRequestException("Email đã tồn tại");
    }

    // Create employee
    const employee = new UserModel({
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      phoneNumber: data.phoneNumber,
      role: Roles.EMPLOYEE,
      status: UserStatus.ACTIVE,
      employeeInfo: {
        specialties: data.specialties,
        hourlyRate: data.hourlyRate,
        department: data.department,
        defaultSchedule: {
          workDays: [1, 2, 3, 4, 5],
          workHours: {
            start: "09:00",
            end: "17:00",
          },
        },
        stats: {
          rating: 0,
          totalBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          noShowRate: 0,
          totalRevenue: 0,
          averageServiceTime: 0,
        },
        hireDate: new Date(),
        isAcceptingBookings: true,
        maxDailyBookings: 8,
        vacationMode: false,
      },
    });
    await employee.save({ session });

    // Create account
    const account = new AccountModel({
      userId: employee._id,
      provider: ProviderEnum.EMAIL,
      providerId: data.email,
    });
    await account.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { employee };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const updateEmployeeService = async (userId: string, data: any) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("Người dùng không tồn tại");
  }

  if (user.role !== Roles.EMPLOYEE && user.role !== Roles.ADMIN) {
    throw new BadRequestException("Người dùng không phải là nhân viên");
  }

  // Update basic info
  if (data.fullName) user.fullName = data.fullName;
  if (data.phoneNumber) user.phoneNumber = data.phoneNumber;

  // Update employee info
  if (user.employeeInfo) {
    if (data.specialties) user.employeeInfo.specialties = data.specialties;
    if (data.hourlyRate !== undefined)
      user.employeeInfo.hourlyRate = data.hourlyRate;
    if (data.commissionRate !== undefined)
      user.employeeInfo.commissionRate = data.commissionRate;
    if (data.department) user.employeeInfo.department = data.department;
    if (data.isAcceptingBookings !== undefined) {
      user.employeeInfo.isAcceptingBookings = data.isAcceptingBookings;
    }
    if (data.maxDailyBookings)
      user.employeeInfo.maxDailyBookings = data.maxDailyBookings;
    if (data.vacationMode !== undefined)
      user.employeeInfo.vacationMode = data.vacationMode;
  }

  const updatedUser = await user.save();

  return { updatedUser };
};

export const changeUserStatusService = async (
  userId: string,
  status: UserStatusType
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("Người dùng không tồn tại");
  }

  user.status = status;
  const updatedUser = await user.save();

  return { updatedUser };
};

export const changeUserRoleService = async (
  userId: string,
  newRole: RoleType
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("Người dùng không tồn tại");
  }

  const oldRole = user.role;
  user.role = newRole as RoleType;

  // Initialize employeeInfo if promoting to employee/admin
  if (
    (newRole === Roles.EMPLOYEE || newRole === Roles.ADMIN) &&
    !user.employeeInfo
  ) {
    user.employeeInfo = {
      specialties: [],
      defaultSchedule: {
        workDays: [1, 2, 3, 4, 5],
        workHours: {
          start: "09:00",
          end: "17:00",
        },
      },
      stats: {
        rating: 0,
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        noShowRate: 0,
        totalRevenue: 0,
        averageServiceTime: 0,
      },
      hireDate: new Date(),
      isAcceptingBookings: true,
      maxDailyBookings: 8,
      vacationMode: false,
    };
  }

  const updatedUser = await user.save();

  return { updatedUser, oldRole, newRole };
};

export const deleteUserService = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  // Check if user has active appointments
  const hasActiveAppointments = await mongoose.model("Appointment").findOne({
    $or: [{ customerId: userId }, { employeeId: userId }],
    status: { $in: ["pending", "confirmed", "in-progress"] },
  });

  if (hasActiveAppointments) {
    throw new BadRequestException(
      "Không thể xóa người dùng khi có lịch hẹn đang hoạt động."
    );
  }

  user.status = UserStatus.DELETED;
  await user.save();

  return { message: "Xoá người dùng thành công" };
};

export const getEmployeeListService = async (filters: {
  specialty?: string;
  isAcceptingBookings?: boolean;
  page?: number;
  limit?: number;
}) => {
  const { specialty, isAcceptingBookings, page = 1, limit = 20 } = filters;

  const query: any = {
    role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
    status: UserStatus.ACTIVE,
  };

  if (specialty) {
    query["employeeInfo.specialties"] = specialty;
  }

  if (isAcceptingBookings !== undefined) {
    query["employeeInfo.isAcceptingBookings"] = isAcceptingBookings;
  }

  const total = await UserModel.countDocuments(query);
  const employees = await UserModel.find(query)
    .select("-password")
    .sort({ "employeeInfo.stats.rating": -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    employees,
    total,
    pages: Math.ceil(total / limit),
  };
};

// Get customer list
export const getCustomerListService = async (filters: {
  search?: string;
  status?: UserStatusType;
  membershipTier?: string;
  page?: number;
  limit?: number;
}) => {
  const { search, status, membershipTier, page = 1, limit = 20 } = filters;

  const query: any = {
    role: Roles.CUSTOMER,
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

  if (membershipTier) {
    query["customerInfo.membershipTier"] = membershipTier;
  }

  const total = await UserModel.countDocuments(query);
  const customers = await UserModel.find(query)
    .select("-password")
    .sort({ "customerInfo.stats.totalSpent": -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    customers,
    total,
    pages: Math.ceil(total / limit),
  };
};
