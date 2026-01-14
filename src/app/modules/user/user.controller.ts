import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { userService } from "./user.service";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
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

const getUser = catchAsync(async(req,res) => {
  const result = await userService.getUser();

  sendResponse(res,{
    statusCode: status.CREATED,
    success: true,
    message: 'get all users successfully',
    meta: result.meta,
    data : result.data,
  })
})

export const userController = {
  registerUser,getUser
};
