import { Request, Response } from "express";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import status from "http-status";
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingData = req.body;
  const decodedToken = req.user as JwtPayload;
  const result = await bookingService.createBooking(
    bookingData,
    decodedToken.userId,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "booking data created successfully",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await bookingService.getAllBookings(
    query as Record<string, unknown>,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "all booking data featch successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getUserBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.getUserBooking();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "fetch  booking data by user successfully",

    data: booking,
  });
});

export const bookingController = {
  createBooking,
  getAllBookings,
  getUserBooking,
};
