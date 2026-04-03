import { Request, Response } from "express";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import status from "http-status";
import { tourService } from "./tour.service";
import { ITour } from "./tour.interface";

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
  const query = req.query;
  const result = await tourService.getTourTypes(
    query as Record<string, unknown>,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "tour data retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleTourType = catchAsync(async (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug)
    ? req.params.slug[0]
    : req.params.slug;
  const result = await tourService.getSingleTourType(slug);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "tour data retrieved successfully",

    data: result,
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

//   console.log({
//    body: req.body,
// images: req.files

//   })
  const payload: ITour = {
    ...req.body,
    images: (req.files as (Express.Multer.File & { secure_url?: string })[]).map((file) => file?.secure_url || file?.path),
  };

  const result = await tourService.createTour(payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "tour data  created successfully",
    data: result,
  });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await tourService.getAllTours(query as Record<string, string>);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "get all tour data successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleTour = catchAsync(async (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug)
    ? req.params.slug[0]
    : req.params.slug;
  const result = await tourService.getSingleTour(slug);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "tour data retrieved successfully",

    data: result,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const tourId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  const payload: ITour = {
    ...req.body,
    images: (req.files as (Express.Multer.File & { secure_url?: string })[]).map((file) => file?.secure_url || file?.path),
  };

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
  getSingleTourType,
  updateTourType,
  deleteTourType,
  updateTour,
  getAllTours,
  getSingleTour,
  deleteTour,
};
