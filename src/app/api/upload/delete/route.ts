import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// Extract Cloudinary public_id from a URL
function getPublicIdFromUrl(url: string): string | null {
  try {
    // Cloudinary URLs look like: https://res.cloudinary.com/xxx/image/upload/v123/folder/filename.ext
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    
    // Remove version prefix (v1234567890/) if present
    let path = parts[1].replace(/^v\d+\//, "");
    
    // Remove file extension
    path = path.replace(/\.[^/.]+$/, "");
    
    return path;
  } catch {
    return null;
  }
}

// DELETE a single image from Cloudinary
export async function POST(req: Request) {
  try {
    const { url, urls } = await req.json();

    const urlsToDelete: string[] = urls || (url ? [url] : []);

    if (urlsToDelete.length === 0) {
      return NextResponse.json({ success: false, message: "No URL(s) provided." }, { status: 400 });
    }

    const results: { url: string; publicId: string | null; deleted: boolean; error?: string }[] = [];

    for (const imageUrl of urlsToDelete) {
      const publicId = getPublicIdFromUrl(imageUrl);
      
      if (!publicId) {
        results.push({ url: imageUrl, publicId: null, deleted: false, error: "Could not extract public_id" });
        continue;
      }

      try {
        const result = await cloudinary.uploader.destroy(publicId);
        results.push({
          url: imageUrl,
          publicId,
          deleted: result.result === "ok",
          error: result.result !== "ok" ? result.result : undefined,
        });
        console.log(`🗑️ Cloudinary delete: ${publicId} → ${result.result}`);
      } catch (err: any) {
        results.push({ url: imageUrl, publicId, deleted: false, error: err.message });
        console.error(`❌ Cloudinary delete failed for ${publicId}:`, err.message);
      }
    }

    const allDeleted = results.every(r => r.deleted);
    
    return NextResponse.json({
      success: true,
      message: allDeleted ? "All images deleted" : "Some images may not have been deleted",
      results,
    });
  } catch (error: any) {
    console.error("Cloudinary delete error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}
