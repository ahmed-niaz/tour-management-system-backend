import status from "http-status";
import { AppError } from "../../errors/app.errors";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import QueryBuilder from "../../utils/queryBuilders";

const createDivision = async (payload: IDivision) => {
  const existingDivision = await Division.findOne({ name: payload.name });

  if (existingDivision) {
    throw new AppError(
      status.CONFLICT,
      "Division with this name already exists",
    );
  }

  // const baseSlug = payload.name.toLowerCase().split(" ").join("-");
  // let slug = `${baseSlug}-division`;

  // let counter = 0;
  // while (await Division.exists({ slug })) {
  //   slug = `${slug}-${counter++}`; // dhaka-division-2
  // }

  // payload.slug = slug;

  const createdDivision = await Division.create(payload);
  return createdDivision;
};

/*
const getAllDivisions = async () => {
  const result = await Division.find();
  // todo: total users
  const totalUsers = await Division.countDocuments();
  return {
    data: result,
    meta: {
      total: totalUsers,
    },
  };
};

*/

const getAllDivisions = async (query: Record<string, unknown>) => {
  const divisionSearchableFields = ["name"];

  const divisionQuery = new QueryBuilder(Division.find(), query)
    .search(divisionSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const data = await divisionQuery.modelQuery;
  const meta = await divisionQuery.countTotal();

  return { data, meta };
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  return {
    division,
  };
};

const updateDivision = async (
  divisionId: string,
  payload: Partial<IDivision>,
) => {
  const existingDivision = await Division.findById(divisionId);

  if (!existingDivision) {
    throw new Error("Division not found.");
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: divisionId },
  });

  if (duplicateDivision) {
    throw new Error("a division with this name is already exists");
  }

  const updateDivision = await Division.findByIdAndUpdate(divisionId, payload, {
    new: true,
    runValidators: true,
  });

  return updateDivision;
};

const deleteDivision = async (divisionId: string) => {
  await Division.findByIdAndDelete(divisionId);
  return null;
};

export const divisionService = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
