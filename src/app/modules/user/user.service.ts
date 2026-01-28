import status from "http-status";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { AppError } from "../../errors/app.errors";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from "../../config";

const registerUser = async (payload: IUser) => {
  const { email, ...userData } = payload;

  // Check if the user already exists by email
  const existingUser = await User.isUserExists(email);

  if (existingUser) {
    throw new AppError(status.NOT_ACCEPTABLE, "Email is already registered");
  }

  // const hashedPassword = await bcrypt.hash(password as string, 10)

  // auth provider
  const authProvider: IAuthProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const result = await User.create({
    ...userData,
    email,
    auths: [authProvider],
  });
  return result;
};

// update user
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  const isUserExists = await User.findById(userId);

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "user not found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(status.FORBIDDEN, "You are not authorized");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(status.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(status.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(env.bcrypt_salt_rounds),
    );
  }

  const userUpdated = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return userUpdated;
};

const getUser = async () => {
  const result = await User.find();

  // todo: total users
  const totalUsers = await User.countDocuments();
  return {
    data: result,
    meta: {
      total: totalUsers,
    },
  };
};

export const userService = {
  registerUser,
  updateUser,
  getUser,
};
