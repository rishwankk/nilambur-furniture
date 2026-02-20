import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Coupon } from "@/models/Coupon";

export async function GET() {
  try {
    await connectToDatabase();
    const coupons = await Coupon.find({ isActive: true, expiryDate: { $gte: new Date() } }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const coupon = await Coupon.create(body);
    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "Coupon code already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}
