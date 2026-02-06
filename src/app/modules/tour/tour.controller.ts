import { Request, Response } from "express";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import status from "http-status";
import { tourService } from "./tour.service";

const createTourType = catchAsync(async (req: Request, res: Response) => {
  const tourTypeData = req.body;
  const result = await tourService.createTourType(tourTypeData);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "tour type data  created successfully",
    data: result,
  });
});

const getTourTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await tourService.getTourTypes();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "division data created successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const tourTypeId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  const payload = req.body;

  const result = await tourService.updateTourType(tourTypeId, payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "tour type data updated successfully",
    data: result,
  });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const tourTypeId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  const result = await tourService.deleteTourType(tourTypeId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "tour type data updated successfully",
    data: result,
  });
});

/************* TOUR ********************/

const createTour = catchAsync(async (req: Request, res: Response) => {
  const tourData = req.body;

  const result = await tourService.createTour(tourData);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "tour data  created successfully",
    data: result,
  });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const result = await tourService.getAllTours();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "get all tour data successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const tourId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  const payload = req.body;

  const result = await tourService.updateTour(tourId, payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "tour type data updated successfully",
    data: result,
  });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const tourId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await tourService.deleteTour(tourId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "tour data deleted successfully",
    data: result,
  });
});

export const tourController = {
  createTour,
  createTourType,
  getTourTypes,
  updateTourType,
  deleteTourType,
  updateTour,
  getAllTours,
  deleteTour,
};
