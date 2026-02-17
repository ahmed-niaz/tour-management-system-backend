import { Request, Response } from "express";
import catchAsync from "../../utils/catch.async";
import { divisionService } from "./division.service";
import { sendResponse } from "../../utils/send.response";
import status from "http-status";

const createDivision = catchAsync(async (req: Request, res: Response) => {
  const divisionData = req.body;

  const result = await divisionService.createDivision(divisionData);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "division data created successfully",
    data: result,
  });
});

const getAllDivisions = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await divisionService.getAllDivisions(
    query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "division data created successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleDivision = catchAsync(async (req, res) => {
  const slug = req.params.slug as string;
  const result = await divisionService.getSingleDivision(slug);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "division data created successfully",
    data: result,
  });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const divisionId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const payload = req.body;

  const result = await divisionService.updateDivision(divisionId, payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "division data updated successfully",
    data: result,
  });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const divisionId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!divisionId) {
    throw new Error("Division id is required");
  }

  const result = await divisionService.deleteDivision(divisionId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "division data deleted successfully",
    data: result,
  });
});

export const divisionController = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
