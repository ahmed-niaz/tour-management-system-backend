import status from "http-status";
import { AppError } from "../../errors/app.errors";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { generateToken } from "../../utils/jwt";
import { env } from "../../config";

const credintialsLogin = async (payload: Partial<IUser>) => {
  //  check the user is exist
  const existingUser = await User.isUserExists(payload?.email as string);

  if (!existingUser) {
    throw new AppError(status.NOT_ACCEPTABLE, "email is not exist");
  }

  const plainTextPassword = payload?.password;
  const hashedPassword = existingUser?.password;

  const isPasswordMatched = await User.isPasswordMatched(
    String(plainTextPassword),
    String(hashedPassword),
  );

  if (!isPasswordMatched) {
    throw new AppError(status.FORBIDDEN, "password is not valid");
  }

  const jwtPayload = {
    userId: existingUser?._id,
    email: existingUser.email,
    role: existingUser.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    env.jwt_access_secret,
    env.jwt_access_expiresIn,
  );

  return {
    accessToken,
  };
};

export const authService = {
  credintialsLogin,
};
