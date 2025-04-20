import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  changeProfilePictureService,
  changeUserStatusService,
  getAllCustomersService,
  getCurrentUserService,
  getCustomerByIdService,
  getProfileByIdService,
  updateProfileService,
} from "../services/user.service";
import { HTTPSTATUS } from "../config/http.config";
import { uploadProfilePicture } from "../utils/file-uploade";
import { changeUserStatusSchema, getAllCustomersSchema, updateProfileSchema, userIdSchema } from "../validation/user.validation";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { user } = await getCurrentUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User fetch successfully",
      user,
    });
  }
);
export const getProfileByController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = userIdSchema.parse(req.params.id);

    const { user } = await getProfileByIdService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User fetch successfully",
      user,
    });
  }
)
export const updateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req?.user?._id 
    const body =  updateProfileSchema.parse({ ...req.body });

    const { updatedUser } = await updateProfileService({ userId: userId, body });

    return res.status(HTTPSTATUS.OK).json({
      message: "Profile updated successfully",
      user: updatedUser,
    })
  }
)

export const updateProfilePictureController = [
  uploadProfilePicture.single("profilePicture"),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await changeProfilePictureService({
      userId: req.user?._id,
      file: req.file,
    });
    res.status(HTTPSTATUS.OK).json({
      message: "Profile picture updated successfully",
      user: result.updatedUser,
    });
  }),
];


// Get all customers with filtering options
export const getAllCustomersController = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = getAllCustomersSchema.parse(req.query);

    const { users, totalUsers, totalPages } = await getAllCustomersService(filters);

    return res.status(HTTPSTATUS.OK).json({
      message: "Customers fetched successfully",
      users,
      totalUsers,
      totalPages,
      currentPage: filters.page || 1,
    });
  }
);

// Get customer by ID
export const getCustomerByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = userIdSchema.parse(req.params.id);

    const { user } = await getCustomerByIdService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Customer fetched successfully",
      user,
    });
  }
);

// Change customer status (block/unblock)
export const changeCustomerStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = userIdSchema.parse(req.params.id);
    const { status } = changeUserStatusSchema.parse(req.body);

    const { updatedUser } = await changeUserStatusService(userId, status);

    return res.status(HTTPSTATUS.OK).json({
      message: `Customer status changed to ${status} successfully`,
      user: updatedUser,
    });
  }
);
