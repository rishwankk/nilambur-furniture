import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_key_12345";

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Token missing." }, { status: 400 });
    }

    // Verify token with Google's UserInfo API for implicit auth
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!userInfoRes.ok) {
       return NextResponse.json({ success: false, message: "Invalid Google token." }, { status: 401 });
    }

    const payload = await userInfoRes.json();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required from Google." }, { status: 400 });
    }

    await connectToDatabase();

    // Find or create user securely
    let user = await User.findOne({ email });
    if (!user) {
      const generatedSecurePass = crypto.randomBytes(32).toString("hex");
      user = await User.create({
        name: name || "Google User",
        email,
        password: generatedSecurePass, 
        role: "user",
      });
    }

    // Sign a JWT token
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Google Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture,
      },
    });

  } catch (error: any) {
    console.error("Google login error:", error);
    return NextResponse.json({ success: false, message: "Google Authentication Error" }, { status: 500 });
  }
}
