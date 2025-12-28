import mongoose from "mongoose";
import crypto from "crypto";
import UserModel, { UserDocument } from "../models/user.model";
import AccountModel from "../models/account.model";
import { Roles } from "../enums/role.enum";
import { UserStatus } from "../enums/status-user.enum";
import { ProviderEnum } from "../enums/account-provider.enum";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/app-error";
import { hashValue } from "../utils/bcrypt";

export const loginOrCreateAccountService = async (data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) => {
  const { providerId, provider, displayName, picture, email } = data;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    let user = await UserModel.findOne({ email }).session(session);

    if (!user) {
      user = new UserModel({
        email,
        fullName: displayName,
        profilePicture: {
          url: picture || null,
          publicId: null,
        },
        role: Roles.CUSTOMER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      });
      await user.save({ session });

      const account = new AccountModel({
        userId: user._id,
        provider: provider,
        providerId: providerId,
      });
      await account.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    return { user };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  } finally {
    session.endSession();
  }
};

export const registerUserService = async (body: {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}) => {
  const { fullName, email, password, phoneNumber } = body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const existingUser = await UserModel.findOne({ email }).session(session);
    if (existingUser) {
      throw new BadRequestException("Email đã tồn tại");
    }
    const user = new UserModel({
      email,
      fullName,
      password,
      role: Roles.CUSTOMER,
      status: UserStatus.ACTIVE,
    });
    await user.save({ session });
    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerId: email,
    });
    await account.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}) => {
  const account = await AccountModel.findOne({
    provider,
    providerId: email,
  });
  if (!account) {
    throw new NotFoundException("Thông tin tài khoản không tồn tại");
  }
  const user = await UserModel.findById(account.userId).select("+password");
  if (!user) {
    throw new NotFoundException("Tài khoản không tồn tại");
  }
  const isMatch = user.comparePassword(password);
  if (!isMatch) {
    throw new NotFoundException("Thông tin đăng nhập không hợp lệ");
  }
  return {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    status: user.status,
    profilePicture: user.profilePicture,
    customerInfo: user.customerInfo,
    employeeInfo: user.employeeInfo,
  } as UserDocument;
};

export const getMeService = async (userId: string) => {
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

export const findUserByIdService = async (userId: string) => {
  const user = await UserModel.findById(userId, {
    password: false,
  });
  return user || null;
};

export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await UserModel.findById(userId).select("+password");
  if (!user) {
    throw new NotFoundException("Không tìm thấy người dùng");
  }
  // check if user has password (not OAuth user)
  if (!user.password) {
    throw new BadRequestException(
      "Không thê thay đổi mật khẩu cho tài khoản OAuth"
    );
  }
  const isMatch = user?.comparePassword(currentPassword);
  if (!isMatch) {
    throw new UnauthorizedException("Mật khẩu không chính xác");
  }

  user.password = newPassword;
  await user.save();

  return { message: "Thay đổi mật khẩu thành công" };
};

export const forgotPasswordService = async (email: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return {
      message:
        "Nếu có địa chỉ email, một liên kết đặt lại mật khẩu sẽ được gửi ",
    };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = await hashValue(resetToken);

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  // Todo: Send email with reset link
  // const resetUrl = `${config.FRONTEND_ORIGIN}/auth/reset-password?token=${resetToken}`;
  //   await sendEmail(user.email, "Đặt lại mật khẩu", resetUrl)

  return {
    message: "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.",
    token: resetToken,
  };
};

export const resetPasswordService = async (
  token: string,
  newPassword: string
) => {
  const tokenHash = await hashValue(token);

  const user = await UserModel.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+password");

  if (!user) {
    throw new BadRequestException("Mã đặt lại không hợp lệ hoặc đã hết hạn");
  }

  // Update password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { message: "Đặt lại mật khẩu thành công" };
};

export const verifyEmailService = async (token: string) => {
  const tokenHash = await hashValue(token);

  const user = await UserModel.findOne({
    emailVerificationToken: tokenHash,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new BadRequestException("Mã đặt lại không hợp lệ hoặc đã hết hạn");
  }

  user.emailVerified = true;
  user.emailVerifiedAt = new Date();
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return { message: "Xác thực email thành công" };
};
