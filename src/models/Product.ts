import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: "Sofa" | "Bed" | "Table" | "Dining" | "Interior Works" | string;
  images: string[];
  stock: number;
  featured: boolean;
  ratings: number;
  reviews: number;
  userReviews?: Array<{
    user: string;
    rating: number;
    comment: string;
    date: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    ratings: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    userReviews: [
      {
        user: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
