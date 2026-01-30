import { JwtPayload } from "jsonwebtoken";
import { env } from "../config";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import { AppError } from "../errors/app.errors";
import status from "http-status";


// todo: GENERATE TOKENS [access & refrsh as reusable fn.]
export const userTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    env.jwt_access_secret,
    env.jwt_access_expiresIn,
  );

  const refreshToken = generateToken(
    jwtPayload,
    env.jwt_refresh_secret,
    env.jwt_refresh_expiresIn,
  );

  return {
    accessToken,
    refreshToken,
  };
};


// todo: GENERATE accesstoken using refresh token [reusable fn]
export const  refreshAccessToken = async (refreshToken: string) => {
 const verifiedRefreshToken = verifyToken(
    refreshToken,
    env.jwt_refresh_secret,
  ) as JwtPayload;

  // todo:  check the user is exist
  const existingUser = await User.isUserExists(verifiedRefreshToken?.email);

  if (!existingUser) {
    throw new AppError(status.NOT_ACCEPTABLE, "email is not exist");
  }

  if (existingUser.isActive === IsActive.BLOCKED || existingUser.isActive === IsActive.INACTIVE) {
    throw new AppError(status.BAD_REQUEST, "user is blocked or inactive");
  }

  if (existingUser.isDeleted) {
    throw new AppError(status.BAD_REQUEST, "user is deleted");
  }

 const jwtPayload = {
  userId: existingUser._id,
  email: existingUser.email,
  role: existingUser.role
 }

 const accessToken = generateToken(jwtPayload,env.jwt_access_secret,env.jwt_access_expiresIn);
 return accessToken
}