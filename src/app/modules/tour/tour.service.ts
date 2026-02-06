import status from "http-status";
import { AppError } from "../../errors/app.errors";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTourType = async (payload: ITourType) => {
  const exisitingTourType = await TourType.findOne({ name: payload.name });
  if (exisitingTourType) {
    throw new AppError(
      status.CONFLICT,
      "a tour type with this name is aleady exists",
    );
  }
  const tourType = await TourType.create(payload);
  return tourType;
};

const getTourTypes = async () => {
  const result = await TourType.find();

  // todo: total users
  const overallTourTypes = await TourType.countDocuments();
  return {
    data: result,
    meta: {
      total: overallTourTypes,
    },
  };
};

const updateTourType = async (
  tourTypeId: string,
  payload: Partial<ITourType>,
) => {
  const exisitingTourType = await TourType.findById(tourTypeId);

  if (!exisitingTourType) {
    throw new Error("Tour Type is not found.");
  }
  const result = await TourType.findByIdAndUpdate(tourTypeId, payload, {
    new: true,
  });

  return result;
};

const deleteTourType = async (id: string) => {
  await TourType.findByIdAndDelete(id);
  return null;
};

/************* TOUR ********************/

const createTour = async (payload: ITour) => {
  const exisitingTour = await Tour.findOne({ title: payload.title });

  if (exisitingTour) {
    throw new AppError(
      status.CONFLICT,
      "a tour with this title is aleady exists",
    );
  }

  const tour = await Tour.create(payload);
  return tour;
};

const getAllTours = async () => {
  const result = await Tour.find();

  // todo: total users
  const overallTours = await Tour.countDocuments();
  return {
    data: result,
    meta: {
      total: overallTours,
    },
  };
};

const updateTour = async (tourId: string, payload: Partial<ITour>) => {
  const exisitingTour = await Tour.findById(tourId);

  if (!exisitingTour) {
    throw new Error("Tour Type is not found.");
  }
  const result = await Tour.findByIdAndUpdate(tourId, payload, {
    new: true,
  });

  return result;
};

const deleteTour = async (tourId: string) => {
  const exisitingTour = await Tour.findById(tourId);
  if (!exisitingTour) {
    throw new AppError(status.CONFLICT, "Tour ID is not found.");
  }
  const result = await Tour.findByIdAndDelete(tourId);
  return result;
};

export const tourService = {
  createTourType,
  getTourTypes,
  updateTourType,
  deleteTourType,
  createTour,
  updateTour,
  getAllTours,
  deleteTour,
};
