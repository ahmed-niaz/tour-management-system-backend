import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { userService } from "./user.service";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { JwtPayload } from "jsonwebtoken";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.body;
    const result = await userService.registerUser(user);

    res.status(status.CREATED).json({
      success: true,
      message: "user register successfully",
      result,
    });
  } catch (e) {
    next(e);
  }
};

// todo: udpated user
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  // const token = req.headers.authorization;
  // const verifiedToken = verifyToken(
  //   token as string,
  //   env.jwt_access_secret,
  // ) as JwtPayload;
  const payload = req.body;

  const verifiedToken = req.user;

  const result = await userService.updateUser(userId, payload, verifiedToken as JwtPayload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "get all users successfully",
    data: result,
  });
});

// const getUser = async (req: Request, res: Response, next: NextFunction) => {
//   try{
//     const user =await userService.getUser();

//   res.status(status.OK).json({
//     success: true,
//     message: "user all user successfully",
//     user,
//   });
//   }catch(e) {
//     next(e)
//   }
// };

const getSingleUser = catchAsync(async(req: Request,res: Response) => {
  const userId = req.params.id as string;
  const result = await userService.getSingleUser(userId);
   sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "user  retrieved successfully",
    data: result.data,
  });
})

const getMe = catchAsync(async(req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;

  const userId = decodedToken.userId;

  const result = await userService.getMe(userId);

   sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "user profile retrieved successfully",
    data: result.data,
  });

})

const getUser = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await userService.getUser(query as Record<string, string>);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "get all users successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const userController = {
  registerUser,getSingleUser,
  updateUser,getMe,
  getUser,
};
