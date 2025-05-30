import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import { Roles } from "../enums/role.enum";
import { StatusUser } from "../enums/status-user.enum";
import { ProviderEnum } from "../enums/account-provider.enum";
import { BadRequestException, NotFoundException } from "../utils/app-error";

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
    console.log("Started session...");

    let user = await UserModel.findOne({ email }).session(session);

    // Create new Customer
    if (!user) {
      user = new UserModel({
        email,
        fullName: displayName,
        profilePicture: {
          url: picture,
          publicId: null
        },
        role: Roles.CUSTOMER,
        status: StatusUser.ACTIVE,
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
    console.log("End session...");
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
  fullName: string,
  email: string,
  password: string
}) => {
 const {fullName, email, password} = body
 const session = await mongoose.startSession()

 try {
  session.startTransaction()
  const existingUser = await UserModel.findOne({email}).session(session)
  if(existingUser) {
    throw new BadRequestException("Email already exists")
  }
  const user = new UserModel({
    email, 
    fullName,
    password,
    role: Roles.CUSTOMER
  })
  await user.save({session})
  const account = new AccountModel({
    userId: user._id,
    provider: ProviderEnum.EMAIL,
    providerId: email
  })
  await account.save({session})

  await session.commitTransaction()
  session.endSession()
  console.log("End session...")

  return {
    userId: user._id
  }
 } catch (error) {
   await session.abortTransaction()
   session.endSession() 

   throw error
 }
}

export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}) => {
  const account = await AccountModel.findOne({ provider, providerId: email });
  if (!account) {
    throw new NotFoundException("Invalid email or password");
  }
  const user = await UserModel.findById(account.userId).select("+password");
  if (!user) {
    throw new NotFoundException("User not found for the given account");
  }
  const isMatch = user.comparePassword(password);
  if (!isMatch) {
    throw new NotFoundException("Invalid email or password");
  }
  return user.omitPassword();
};

export const findUserByIdService = async (userId: string) => {
  const user = await UserModel.findById(userId, {
    password: false,
  });
  return user || null;
};
