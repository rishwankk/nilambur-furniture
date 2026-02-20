import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Category } from "@/models/Category";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newCategory = await Category.create(body);
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "Category already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}
