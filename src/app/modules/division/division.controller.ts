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
  const result = await divisionService.getAllDivisions();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "division data created successfully",
    meta: result.meta,
    data: result.data,
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
  updateDivision,
  deleteDivision,
};
