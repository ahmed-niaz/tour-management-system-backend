import status from "http-status";
import { AppError } from "../../errors/app.errors";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import QueryBuilder from "../../utils/queryBuilders";
import { tourSearableFields, tourTypeSearchableFields } from "./tour.constant";

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

const getTourTypes = async (query: Record<string, unknown>) => {
  const tourTypeQuery = new QueryBuilder(TourType.find(), query)
    .search(tourTypeSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const data = await tourTypeQuery.modelQuery;
  const meta = await tourTypeQuery.countTotal();

  return { data, meta };
};

const getSingleTourType = async (slug: string) => {
  const result = await TourType.findOne({ slug });
  return {
    result,
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

// const getAllTours = async (query: Record<string, string>) => {
//   // filter - exact match
//   // search - partial match
//   const searchTerm = query.searchTerm || "";
//   const filter = query;

//   delete filter["searchTerm"];

//   const tourSearableFields = ["title", "description", "location"];

//   const searchQuery = {
//     $or: tourSearableFields.map((field) => ({
//       [field]: {
//         $regex: searchTerm,
//         $options: "i",
//       },
//     })),
//   };
//   const result = await Tour.find(searchQuery).find(filter);

//   // todo: total users
//   const overallTours = await Tour.countDocuments();
//   return {
//     data: result,
//     meta: {
//       total: overallTours,
//     },
//   };
// };

/*
const getAllTours = async (query: Record<string, string>) => {
  // filter - exact match
  // search - partial match
  const searchTerm = query.searchTerm || "";
  const sort = query.sort || "-createdAt";
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 2;
  const skip = (page - 1) * limit;

  // Create a copy of query to avoid mutating the original
  const filterQuery = { ...query };

  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  excludeFields.forEach((field) => delete filterQuery[field]);

  // Field filtering - handle undefined/empty fields
  const fields = query.fields ? query.fields.split(",").join(" ") : "";

  const tourSearchableFields = ["title", "description", "location"];

  // Build search query
  const searchQuery = searchTerm
    ? {
        $or: tourSearchableFields.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      }
    : {};

  // Combine search and filter queries
  const finalQuery = {
    ...searchQuery,
    ...filterQuery,
  };

  // Execute the query
  const result = await Tour.find(finalQuery)
    .sort(sort)
    .select(fields)
    .limit(limit)
    .skip(skip);

  // Count documents matching the same query
  const totalTours = await Tour.countDocuments(finalQuery);
  const totalPage = Math.ceil(totalTours / limit);

  const metaData = {
    page: page,
    limit: limit,
    total: totalTours,
    totalPage: totalPage,
  };

  return {
    data: result,
    meta: metaData,
  };
};
*/

const getAllTours = async (query: Record<string, unknown>) => {
  const tourQuery = new QueryBuilder(Tour.find(), query)
    .search(tourSearableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const data = await tourQuery.modelQuery;
  const meta = await tourQuery.countTotal();

  return { data, meta };
};

const getSingleTour = async (slug: string) => {
  const result = await Tour.findOne({ slug });
  return {
    result,
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
  getSingleTourType,
  updateTourType,
  deleteTourType,
  createTour,
  updateTour,
  getAllTours,getSingleTour,
  deleteTour,
};
