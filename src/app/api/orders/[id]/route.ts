import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Order } from "@/models/Order";
import { sendOrderStatusUpdate } from "@/lib/email";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connectToDatabase();
    const id = (await params).id;
    
    let order;
    if (id.startsWith('NIL-')) {
      order = await Order.findOne({ orderId: id });
    } else {
      order = await Order.findById(id);
    }
    
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
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
    
    const previousOrder = await Order.findById(id);
    const updatedOrder = await Order.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Send email on status change
    const statusChanged = previousOrder && body.orderStatus && previousOrder.orderStatus !== body.orderStatus;
    const order: any = updatedOrder.toObject();
    const email = order.customerInfo?.email || order.guestEmail;

    if (statusChanged && email && email !== "guest@nilambur.com") {
      sendOrderStatusUpdate({
        to: email,
        orderId: order.orderId || order._id.toString(),
        customerName: order.customerInfo?.name || "Customer",
        items: order.items?.map((i: any) => ({ name: i.name, quantity: i.quantity, price: i.price })) || [],
        subtotal: (order.totalAmount || order.total || 0) + (order.discountAmount || 0),
        discount: order.discountAmount || 0,
        total: order.totalAmount || order.total || 0,
        couponCode: order.couponCode,
        paymentMethod: order.paymentMethod || "N/A",
        shippingAddress: order.shippingAddress
          ? `${order.shippingAddress.address || order.shippingAddress.street || ""}, ${order.shippingAddress.city || ""}`
          : "N/A",
        status: body.orderStatus,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const id = (await params).id;
    const deletedOrder = await Order.findByIdAndDelete(id);
    
    if (!deletedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
