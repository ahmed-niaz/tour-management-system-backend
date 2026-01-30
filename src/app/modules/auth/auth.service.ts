import status from "http-status";
import { AppError } from "../../errors/app.errors";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { refreshAccessToken, userTokens } from "../../utils/user.token";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

const credintialsLogin = async (payload: Partial<IUser>) => {
  // todo:  check the user is exist
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

  // const jwtPayload = {
  //   userId: existingUser?._id,
  //   email: existingUser.email,
  //   role: existingUser.role,
  // };

  // const accessToken = generateToken(
  //   jwtPayload,
  //   env.jwt_access_secret,
  //   env.jwt_access_expiresIn,
  // );

  // const refreshToken = generateToken(
  //   jwtPayload,
  //   env.jwt_refresh_secret,
  //   env.jwt_access_expiresIn,
  // );

  // todo: utils fn.
  const tokens = userTokens(existingUser);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: passKey, ...rest } = existingUser.toObject();
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: rest,
  };
};

// todo: generate access token with the help of refresh token
const generateAccessToken = async (refreshToken: string) => {
  const createAccessToken = await refreshAccessToken(refreshToken);
  return {
    accessToken: createAccessToken,
  };
};

// todo: reset password
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  // todo: check the old password is matched or !
  const userData = await User.findById(decodedToken.userId);

  if (!userData) {
    throw new AppError(status.NOT_FOUND, "user not found");
  }

  const isOldPasswordMatched = await bcrypt.compare(
    oldPassword,
    userData.password as string,
  );

  if (!isOldPasswordMatched) {
    throw new AppError(status.UNAUTHORIZED, "old password is not matched");
  }

  // validate new password
  if (!newPassword) {
    throw new AppError(status.BAD_REQUEST, "new password is required");
  }

  // prevent reusing the same password (compare plain values)
  if (oldPassword === newPassword) {
    throw new AppError(status.BAD_REQUEST, "new password must be different from old password");
  }

  // * set the new password as plain text and rely on pre-save hook to hash it
  userData.password = newPassword;
  await userData.save();
};

export const authService = {
  credintialsLogin,
  generateAccessToken,
  resetPassword,
};
