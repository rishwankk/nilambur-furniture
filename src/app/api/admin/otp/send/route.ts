import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";

const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const admin = await User.findOne({ role: "admin" });
    const currentEmail = admin ? admin.email : (process.env.ADMIN_EMAIL || "admin@nilambur.com");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    (globalThis as any).adminOtp = otp;
    (globalThis as any).adminOtpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Nilambur Security" <${process.env.SMTP_EMAIL}>`,
      to: currentEmail,
      subject: "Your Admin Update OTP",
      text: `Your OTP for updating admin credentials is: ${otp}. It expires in 10 minutes.`,
    });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("OTP send error:", error);
    return NextResponse.json({ success: false, message: "Failed to send OTP" }, { status: 500 });
  }
}
