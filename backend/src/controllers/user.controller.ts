import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  changeProfilePictureService,
  changeUserRoleService,
  changeUserStatusService,
  createEmployeeService,
  deleteProfilePictureService,
  deleteUserService,
  getAllUsersService,
  getCurrentUserService,
  getCustomerListService,
  getEmployeeListService,
  getProfileByIdService,
  getUserByIdService,
  updateAddressService,
  updateEmployeeService,
  updatePreferencesService,
  updateProfileService,
} from "../services/user.service";
import { HTTPSTATUS } from "../config/http.config";
import { uploadProfilePicture } from "../utils/file-uploade";
import {
  changeUserRoleSchema,
  changeUserStatusSchema,
  createEmployeeSchema,
  getAllUsersSchema,
  updateAddressSchema,
  updateEmployeeSchema,
  updatePreferencesSchema,
  updateProfileSchema,
  userIdSchema,
} from "../validation/user.validation";
import { UserStatusType } from "../enums/status-user.enum";
import { RoleType } from "../enums/role.enum";
import { Types } from "mongoose";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { user } = await getCurrentUserService(new Types.ObjectId(userId));

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thông tin người dùng thành công",
      data: {
        user,
      },
    });
  },
);
export const getProfileByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = userIdSchema.parse(req.params.id);

    const { user } = await getProfileByIdService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thông tin người dùng thành công",
      user,
    });
  },
);
export const updateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req?.user?._id;
    const body = updateProfileSchema.parse({ ...req.body });

    const { updatedUser } = await updateProfileService(
      new Types.ObjectId(userId),
      body,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật thông tin người dùng thành công",
      data: { user: updatedUser },
    });
  },
);

export const updateAddressController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const address = updateAddressSchema.parse(req.body);

    const { updatedUser } = await updateAddressService(userId, address);

    return res.status(HTTPSTATUS.OK).json({
      message: "Địa chỉ cập nhật thành công",
      data: {
        user: updatedUser,
      },
    });
  },
);

export const updatePreferencesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const preferences = updatePreferencesSchema.parse(req.body);

    const { updatedUser } = await updatePreferencesService(userId, preferences);

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật tuỳ chọn thành công",
      data: { user: updatedUser },
    });
  },
);
export const updateProfilePictureController = [
  uploadProfilePicture.single("profilePicture"),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const result = await changeProfilePictureService(userId, req.file);
    res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật ảnh người dùng thành công",
      data: {
        user: result.updatedUser,
      },
    });
  }),
];

export const deleteProfilePictureController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const { updatedUser } = await deleteProfilePictureService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Xoá ảnh người dùng thành công",
      data: { user: updatedUser },
    });
  },
);

// ========================================
// ADMIN CONTROLLERS
// ========================================

export const getAllUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = getAllUsersSchema.parse(req.query);

    const result = await getAllUsersService(filters);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách người dùng thành công",
      data: result,
    });
  },
);

// Get customer by ID
export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = userIdSchema.parse(req.params.id);

    const { user } = await getUserByIdService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thông tin người dùng thành công",
      data: { user },
    });
  },
);
export const createEmployeeController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createEmployeeSchema.parse(req.body);

    const { employee } = await createEmployeeService(data);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Tạo nhân viên thành công",
      data: { employee },
    });
  },
);

export const updateEmployeeController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = userIdSchema.parse(req.params.id);
    const data = updateEmployeeSchema.parse(req.body);

    const { updatedUser } = await updateEmployeeService(userId, data);

    return res.status(HTTPSTATUS.OK).json({
      message: "Cập nhật thông tin nhân viên thành công",
      data: { employee: updatedUser },
    });
  },
);
export const changeUserStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = userIdSchema.parse(req.params.id);
    const { status } = changeUserStatusSchema.parse(req.body);

    const { updatedUser } = await changeUserStatusService(
      userId,
      status as UserStatusType,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: `Trạng thái người dùng đã thành đổi thành ${status} thành công`,
      data: { user: updatedUser },
    });
  },
);
export const changeUserRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = userIdSchema.parse(req.params.id);
    const { role } = changeUserRoleSchema.parse(req.body);

    const result = await changeUserRoleService(userId, role as RoleType);

    return res.status(HTTPSTATUS.OK).json({
      message: `Quyền người dùng đã thay đổi từ ${result.oldRole} thành ${result.newRole}`,
      data: { user: result.updatedUser },
    });
  },
);
export const deleteUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = userIdSchema.parse(req.params.id);

    await deleteUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Xoá tài khoản thành công",
    });
  },
);

export const getEmployeeListController = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = req.query;

    const result = await getEmployeeListService(filters);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách nhân viên thành công",
      data: result,
    });
  },
);

export const getCustomerListController = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = getAllUsersSchema.parse(req.query);

    const result = await getCustomerListService(filters);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy danh sách người dùng thành công",
      data: result,
    });
  },
);
