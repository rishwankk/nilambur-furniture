import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Product } from "@/models/Product";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const id = (await params).id;
    const { user, rating, comment } = await req.json();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Add review
    const newReview = { user, rating: Number(rating), comment };
    
    // Check if userReviews exists, else init
    if (!product.userReviews) {
      product.userReviews = [];
    }

    product.userReviews.push(newReview as any);
    
    // Recalculate average rating
    const totalReviews = product.userReviews.length;
    const sumRatings = product.userReviews.reduce((sum, r) => sum + r.rating, 0);
    product.ratings = sumRatings / totalReviews;
    product.reviews = totalReviews;

    await product.save();

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Review save error", error);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}
