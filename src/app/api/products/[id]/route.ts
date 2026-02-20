import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Product } from "@/models/Product";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // In Next.js App Router this is the correct typing for params usually
) {
  try {
    await connectToDatabase();
    const id = (await params).id;
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const id = (await params).id;
    const body = await req.json();
    
    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

import cloudinary from "@/lib/cloudinary";

// Helper to get public ID from Cloudinary URL
function getPublicIdFromUrl(url: string): string | null {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    let path = parts[1].replace(/^v\d+\//, "");
    path = path.replace(/\.[^/.]+$/, "");
    return path;
  } catch {
    return null;
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const id = (await params).id;
    
    // Find product first to get images
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Delete all images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const publicId = getPublicIdFromUrl(imageUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`🗑️ Deleted image from Cloudinary: ${publicId}`);
          } catch (err: any) {
             console.error(`❌ Failed to delete Cloudinary image ${publicId}:`, err.message);
          }
        }
      }
    }

    // Finally delete the product from DB
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Product and associated images deleted" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
