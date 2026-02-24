import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { sendOrderConfirmation, sendAdminOrderNotification } from "@/lib/email";

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newOrder = await Order.create(body);

    if (body.items && Array.isArray(body.items)) {
      for (const item of body.items) {
        if (item.id) {
          await Product.findByIdAndUpdate(item.id, { $inc: { stock: -(item.quantity || 1) } });
        }
      }
    }

    const email = body.customerInfo?.email || body.guestEmail;
    const shippingStr = body.shippingAddress
      ? `${body.shippingAddress.address || ""}, ${body.shippingAddress.city || ""} - ${body.shippingAddress.postalCode || ""}`
      : "N/A";

    console.log("📧 Order created:", body.orderId, "| Customer email:", email);

    // 1. Send confirmation email to customer
    if (email && email !== "guest@nilambur.com") {
      try {
        await sendOrderConfirmation({
          to: email,
          orderId: body.orderId || newOrder._id.toString(),
          customerName: body.customerInfo?.name || "Customer",
          items: body.items?.map((i: any) => ({ name: i.name, quantity: i.quantity, price: i.price })) || [],
          subtotal: body.subtotal || body.total || 0,
          discount: body.discountAmount || 0,
          total: body.total || 0,
          couponCode: body.couponCode,
          paymentMethod: body.paymentMethod || "N/A",
          shippingAddress: shippingStr,
          status: "Confirmed",
        });
      } catch (emailErr) {
        console.error("📧 Customer email error:", emailErr);
      }
    }

    // 2. Send notification email to admin for packing
    try {
      await sendAdminOrderNotification({
        orderId: body.orderId || newOrder._id.toString(),
        customerName: body.customerInfo?.name || "Guest",
        customerEmail: email || "N/A",
        customerPhone: body.customerInfo?.phone || "N/A",
        items: body.items?.map((i: any) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
        })) || [],
        subtotal: body.subtotal || body.total || 0,
        discount: body.discountAmount || 0,
        total: body.total || 0,
        couponCode: body.couponCode,
        paymentMethod: body.paymentMethod || "N/A",
        shippingAddress: shippingStr,
      });
    } catch (adminEmailErr) {
      console.error("📧 Admin email error:", adminEmailErr);
    }

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}
