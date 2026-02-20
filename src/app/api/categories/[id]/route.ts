import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Category } from "@/models/Category";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const id = (await params).id;
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
