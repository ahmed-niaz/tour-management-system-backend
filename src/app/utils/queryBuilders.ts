import { Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  private readonly excludeFields = ["searchTerm", "sort", "fields", "page", "limit"];

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = (this.query.searchTerm as string) || "";

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      } as Record<string, unknown>);
    }

    return this;
  }

  filter() {
    const filterQuery = { ...this.query };
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    this.excludeFields.forEach((field) => delete filterQuery[field]);

    this.modelQuery = this.modelQuery.find(
      filterQuery as Record<string, unknown>
    );

    return this;
  }

  sort() {
    const sort = (this.query.sort as string) || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  fields() {
    const fields = this.query.fields
      ? (this.query.fields as string).split(",").join(" ")
      : "";

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.limit(limit).skip(skip);

    return this;
  }

  async countTotal() {
    const totalQuery = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQuery);
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    return {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    };
  }
}

export default QueryBuilder;