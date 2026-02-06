import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// create slug as pre hook
tourSchema.pre("save", async function () {
  if (this.isModified("title")) {
    const baseSlug = this.title.toLowerCase().split(" ").join("-");
    const baseTourSlug = `${baseSlug}`;
    let slug = baseTourSlug;

    let counter = 1;
    while (await Tour.exists({ slug })) {
      slug = `${baseTourSlug}-${counter++}`;
    }

    this.slug = slug;
  }
  // No next() needed!
});

// update slug as pre hook [query] middleware
tourSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate() as Partial<ITour> & {
    $set?: Partial<ITour>;
  };
  
  if (!update) return;

  // Get the name from wherever it is
  const title = update.$set?.title || update.title;

  if (title) {
    const baseSlug = title.toLowerCase().split(" ").join("-");
    const baseTourSlug = `${baseSlug}`;
    let slug = baseTourSlug;

    let counter = 1;
    while (await Tour.exists({ slug })) {
      slug = `${baseTourSlug}-${counter++}`;
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


export const Tour = model<ITour>("Tour", tourSchema);
