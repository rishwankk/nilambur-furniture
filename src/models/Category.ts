import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
