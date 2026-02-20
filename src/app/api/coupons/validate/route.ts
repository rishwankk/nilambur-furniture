import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Coupon } from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true, 
      expiryDate: { $gte: new Date() } 
    });

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Invalid or expired coupon code" }, { status: 404 });
    }

    if (cartTotal < coupon.minCartValue) {
      return NextResponse.json({ 
        success: false, 
        message: `Minimum cart value of ₹${coupon.minCartValue.toLocaleString("en-IN")} required for this coupon` 
      }, { status: 400 });
    }

    const discount = Math.floor((cartTotal * coupon.discountPercentage) / 100);

    return NextResponse.json({ 
      success: true, 
      discount, 
      discountPercentage: coupon.discountPercentage,
      code: coupon.code 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
