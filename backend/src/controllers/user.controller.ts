import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  changeProfilePictureService,
  getCurrentUserService,
  getProfileByIdService,
  updateProfileService,
} from "../services/user.service";
import { HTTPSTATUS } from "../config/http.config";
import { uploadProfilePicture } from "../utils/file-uploade";
import { updateProfileSchema, userIdSchema } from "../validation/user.validation";

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
