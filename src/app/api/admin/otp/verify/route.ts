import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const { otp, newEmail, newPassword } = await req.json();

    if (!(globalThis as any).adminOtp || (globalThis as any).adminOtp !== otp || Date.now() > (globalThis as any).adminOtpExpires) {
      return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 });
    }

    // Clear OTP
    (globalThis as any).adminOtp = null;
    (globalThis as any).adminOtpExpires = null;

    await connectToDatabase();
    
    // Update admin config
    let admin = await User.findOne({ role: "admin" });
    if (!admin) {
      await User.create({ name: "Admin", email: newEmail, password: newPassword, role: "admin" });
    } else {
      admin.email = newEmail;
      if (newPassword) admin.password = newPassword;
      await admin.save();
    }

    return NextResponse.json({ success: true, message: "Admin credentials updated successfully" });
  } catch (error: any) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ success: false, message: "Failed to update credentials" }, { status: 500 });
  }
}
