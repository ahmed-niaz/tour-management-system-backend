import status from "http-status";
import { AppError } from "../../errors/app.errors";

import { User } from "../user/user.model";
import { refreshAccessToken } from "../../utils/user.token";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IAuthProvider, IsActive } from "../user/user.interface";
import { env } from "../../config";
import jwt from 'jsonwebtoken'
import { sendEmail } from "../../utils/send.email";


/*
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
*/

// todo: generate access token with the help of refresh token
const generateAccessToken = async (refreshToken: string) => {
  const createAccessToken = await refreshAccessToken(refreshToken);
  return {
    accessToken: createAccessToken,
  };
};

// todo: chnage password
const changePassword = async (
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

// todo: reset password
const resetPassword = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>,
  decodedToken: JwtPayload,
) => {

  if (payload.id != decodedToken.userId) {
    throw new AppError(status.UNAUTHORIZED, "user token not found");
  }

  const isUserExists = await User.findById(decodedToken.userId);

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "user not found");
  }

  isUserExists.password = payload.newPassword;
  await isUserExists.save();


};

// todo: set password
const setGooglePassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(status.NOT_ACCEPTABLE, 'user not found');
  }

  if (user.password && user.auths.some(providerObject => providerObject.provider === 'google')) {
    throw new AppError(status.BAD_REQUEST, 'You have already set the password')
  }

  const credentialProvider: IAuthProvider = {
    provider: "credential",
    providerId: user.email
  }
  // const rounds = Number(env.bcrypt_salt_rounds) || 10;
  // const hashedPassword = await bcrypt.hash(plainPassword, rounds);

  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  // user.password = hashedPassword;
  user.password = plainPassword;

  user.auths = auths
  await user.save()

}

const forgetPassowrd = async (email: string) => {

  const isUserExists = await User.findOne({ email });

  if (!isUserExists) {
    throw new AppError(status.BAD_REQUEST, 'user does not exsit')
  }

  if (isUserExists.isActive === IsActive.BLOCKED || isUserExists.isActive === IsActive.INACTIVE) {
    throw new AppError(status.BAD_REQUEST, `use is ${isUserExists.isActive}`)
  }

  if (isUserExists.isDeleted) {
    throw new AppError(status.BAD_REQUEST, 'user does not exsit')
  }

  const jwtPayload = {
    userId: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role
  }

  const resetToken = jwt.sign(jwtPayload, env.jwt_access_secret, {
    expiresIn: '15m'
  })

  // todo: create ui link
  const resetLink = `${env.frontend_url}/reset-password?id=${isUserExists._id}&token=${resetToken}`;

  await sendEmail({
    to: isUserExists.email,
    subject: 'password reset',
    templateName: 'forgetPassword',
    templateData: {
      name: isUserExists.name,
      resetLink
    }
  })

}
export const authService = {
  // credintialsLogin,
  generateAccessToken,
  resetPassword, changePassword, setGooglePassword, forgetPassowrd
};
