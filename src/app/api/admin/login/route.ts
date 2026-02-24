import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nilambur.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_key_12345";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    let admin = await User.findOne({ email, role: "admin" }).select("+password");

    if (!admin) {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Fallback matched. Create admin in DB if it doesn't exist
        const anyAdmin = await User.findOne({ role: "admin" });
        if(!anyAdmin) {
          admin = await User.create({ name: "Admin", email, password, role: "admin" });
        }
      } else {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
      }
    } else {
      if (admin.password !== password) {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
      }
    }

    const token = jwt.sign({ role: "admin", email }, JWT_SECRET, { expiresIn: "1d" });
    
    const response = NextResponse.json({ success: true, message: "Logged in successfully" });
    
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
