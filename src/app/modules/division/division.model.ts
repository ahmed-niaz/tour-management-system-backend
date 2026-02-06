import { model, Schema } from "mongoose";

import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  },
);

// create slug as pre hook
divisionSchema.pre("save", async function () {
  if (this.isModified("name")) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    const baseDivisionSlug = `${baseSlug}-division`;
    let slug = baseDivisionSlug;

    let counter = 1;
    while (await Division.exists({ slug })) {
      slug = `${baseDivisionSlug}-${counter++}`;
    }

    this.slug = slug;
  }
  // No next() needed!
});

// update slug as pre hook [query] middleware
divisionSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate() as Partial<IDivision> & {
    $set?: Partial<IDivision>;
  };
  
  if (!update) return;

  // Get the name from wherever it is
  const name = update.$set?.name || update.name;

  if (name) {
    const baseSlug = name.toLowerCase().split(" ").join("-");
    const baseDivisionSlug = `${baseSlug}-division`;
    let slug = baseDivisionSlug;

    let counter = 1;
    while (await Division.exists({ slug })) {
      slug = `${baseDivisionSlug}-${counter++}`;
    }

    // Set slug in the same location as name
    if (update.$set) {
      update.$set.slug = slug;
    } else {
      update.slug = slug;
    }

    this.setUpdate(update);
  }
});


export const Division = model<IDivision>("Division", divisionSchema);
