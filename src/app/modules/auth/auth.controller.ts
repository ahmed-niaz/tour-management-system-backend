import status from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { authService } from "./auth.service";
import { AppError } from "../../errors/app.errors";
import { Request, Response } from "express";
import { setAuthCookie } from "../../utils/set.cookie";

const credintialsLogin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.credintialsLogin(payload);

  // todo: SET cookie in the browser
  // res.cookie("refreshToken", result.refreshToken, {
  //   httpOnly: true,
  //   secure: false,
  // });

  setAuthCookie(res,result);

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
const logOut = catchAsync(async(req:Request,res: Response) => {

 res.clearCookie('accessToken', {
  httpOnly: true,
  secure: false,
  sameSite: 'lax'
 })

  res.clearCookie('refreshToken', {
  httpOnly: true,
  secure: false,
  sameSite: 'lax'
 })
 
  sendResponse(res,{
    success: true,
    statusCode: status.OK,
    message: "user logout successfully",
    data: null
  })
})

// todo: reset password
const resetPassword = catchAsync(async(req: Request,res: Response) => {

  const {oldPassword,newPassword} = req.body;
  const decodedToken = req.user;

 await authService.resetPassword(oldPassword,newPassword,decodedToken)

  sendResponse(res,{
    success: true,
    statusCode: status.OK,
    message: "user password reset successfully",
    data: null
  })
})

export const authController = {
  credintialsLogin,
  generateAccessToken,logOut,resetPassword
};
