import status from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { authService } from "./auth.service";
import { AppError } from "../../errors/app.errors";
import { NextFunction, Request, Response } from "express";
import { setAuthCookie } from "../../utils/set.cookie";
import { userTokens } from "../../utils/user.token";
import { env } from "../../config";

const credintialsLogin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.credintialsLogin(payload);

  // todo: SET cookie in the browser
  // res.cookie("refreshToken", result.refreshToken, {
  //   httpOnly: true,
  //   secure: false,
  // });

  setAuthCookie(res, result);

  // res.cookie("accessToken", result.accessToken, {
  //   httpOnly: true,
  //   secure: false,
  // });

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "user login successfull",
    data: result,
  });
});

// todo: GENERATE or CREATE new ACCESS TOKEN using refresh Token
const generateAccessToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) {
    throw new AppError(
      status.BAD_REQUEST,
      "No refresh token recieved from cookies or request body",
    );
  }
  const tokenInfo = await authService.generateAccessToken(refreshToken);

  setAuthCookie(res, tokenInfo);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "new access token generate successfully",
    data: tokenInfo,
  });
});

// todo: logOut
const logOut = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "user logout successfully",
    data: null,
  });
});

// todo: reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const decodedToken = req.user;

  if (!decodedToken) {
    throw new AppError(status.UNAUTHORIZED, "user token not found");
  }

  await authService.resetPassword(oldPassword, newPassword, decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "user password reset successfully",
    data: null,
  });
});

// todo: google callback controller
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;

    // console.log("Google user info:", user);

    if (!user) {
      throw new AppError(status.NOT_FOUND, "user not found");
    }

    const tokenInfo = userTokens(user);

    setAuthCookie(res, tokenInfo);

    if (!env.frontend_url) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        "frontend url is not configured",
      );
    }

    res.redirect(`${env.frontend_url}/${redirectTo}`);
  },
);

export const authController = {
  credintialsLogin,
  generateAccessToken,
  logOut,
  resetPassword,
  googleCallbackController,
};
