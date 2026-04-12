import status from "http-status";
import catchAsync from "../../utils/catch.async"
import { sendResponse } from "../../utils/send.response";
import { statsService } from "./stats.service";
import { Request, Response } from "express";

const getBookingStats = catchAsync(async(req: Request, res: Response) => {

    const result = await statsService.getBookingStats();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "booking stats recieve successfully",
    data: result
  })
});


const getPaymentStats = catchAsync(async(req: Request, res: Response) => {

    const result = await statsService.getPaymentStats();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "booking stats recieve successfully",
    data: result
  })
});

const getUserStats = catchAsync(async(req: Request, res: Response) => {

    const result = await statsService.getUserStats();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "booking stats recieve successfully",
    data: result
  })
});

const getTourStats = catchAsync(async(req: Request, res: Response) => {

    const result = await statsService.getTourStats();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "booking stats recieve successfully",
    data: result
  })
});


export const statsController = {
    getBookingStats, getPaymentStats,getUserStats,getTourStats
}