import nodemailer from "nodemailer";

function getTransporter() {
  const email = process.env.SMTP_EMAIL;
  const password = process.env.SMTP_PASSWORD;

  if (!email || !password) {
    console.warn("⚠️ SMTP credentials missing — SMTP_EMAIL:", email ? "SET" : "MISSING", "SMTP_PASSWORD:", password ? "SET" : "MISSING");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });
}

interface OrderEmailData {
  to: string;
  orderId: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: string;
  shippingAddress: string;
  status: string;
}

function getStatusEmoji(status: string) {
  switch (status) {
    case "Pending": return "🕐";
    case "Confirmed": return "✅";
    case "Shipped": return "🚚";
    case "Delivered": return "📦";
    case "Cancelled": return "❌";
    default: return "📋";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Pending": return "#f59e0b";
    case "Confirmed": return "#10b981";
    case "Shipped": return "#3b82f6";
    case "Delivered": return "#059669";
    case "Cancelled": return "#ef4444";
    default: return "#6b7280";
  }
}

function buildEmailTemplate(data: OrderEmailData, type: "confirmation" | "status_update") {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
        <span style="font-weight: 600; color: #1e293b;">${item.name}</span>
        <br/><span style="color: #9ca3af; font-size: 13px;">Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: 600; color: #1e293b;">
        ₹${(item.price * item.quantity).toLocaleString("en-IN")}
      </td>
    </tr>
  `).join("");

  const subject = type === "confirmation"
    ? `Order Confirmed! #${data.orderId} — Nilambur Interiors & Furniture`
    : `${getStatusEmoji(data.status)} Order #${data.orderId} — ${data.status}`;

  const heading = type === "confirmation"
    ? "Thank You for Your Order!"
    : `Order Status: ${data.status}`;

  const message = type === "confirmation"
    ? "We've received your order and it's being processed. Here's a summary of your purchase:"
    : `Your order <strong>#${data.orderId}</strong> has been updated to <strong>${data.status}</strong>.`;

  const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="margin:0; padding:0; background-color:#f8fafc; font-family: 'Segoe UI', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #0d4f4f 100%); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Nilambur Interiors & Furniture</h1>
        <p style="color: #94a3b8; margin: 8px 0 0; font-size: 13px;">Premium Handcrafted Furniture</p>
      </div>

      <!-- Status Badge -->
      <div style="text-align: center; padding: 28px 24px 0;">
        <div style="display: inline-block; background: ${getStatusColor(data.status)}15; border: 2px solid ${getStatusColor(data.status)}30; color: ${getStatusColor(data.status)}; font-weight: 700; font-size: 14px; padding: 8px 20px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px;">
          ${getStatusEmoji(data.status)} ${data.status}
        </div>
      </div>

      <div style="padding: 24px 32px;">
        <h2 style="color: #0f172a; font-size: 24px; margin: 0 0 8px; font-weight: 700;">${heading}</h2>
        <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">Hi ${data.customerName}, ${message}</p>

        <!-- Order Info -->
        <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <table width="100%" style="font-size: 14px;">
            <tr>
              <td style="color: #9ca3af; padding: 4px 0;">Order ID</td>
              <td style="text-align: right; font-weight: 700; color: #0f172a;">#${data.orderId}</td>
            </tr>
            <tr>
              <td style="color: #9ca3af; padding: 4px 0;">Payment</td>
              <td style="text-align: right; font-weight: 600; color: #0f172a;">${data.paymentMethod}</td>
            </tr>
            <tr>
              <td style="color: #9ca3af; padding: 4px 0;">Shipping to</td>
              <td style="text-align: right; font-weight: 600; color: #0f172a;">${data.shippingAddress}</td>
            </tr>
          </table>
        </div>

        <!-- Items -->
        <h3 style="color: #0f172a; font-size: 16px; margin: 0 0 12px; font-weight: 700;">Order Items</h3>
        <table width="100%" style="font-size: 14px;">
          ${itemsHtml}
        </table>

        <!-- Totals -->
        <div style="margin-top: 20px; background: #f8fafc; border-radius: 12px; padding: 16px;">
          <table width="100%" style="font-size: 14px;">
            <tr>
              <td style="color: #9ca3af; padding: 4px 0;">Subtotal</td>
              <td style="text-align: right; color: #0f172a;">₹${data.subtotal.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="color: #9ca3af; padding: 4px 0;">Shipping</td>
              <td style="text-align: right; color: #059669; font-weight: 600;">Free</td>
            </tr>
            ${data.discount > 0 ? `
            <tr>
              <td style="color: #9ca3af; padding: 4px 0;">Discount${data.couponCode ? ` (${data.couponCode})` : ""}</td>
              <td style="text-align: right; color: #ef4444; font-weight: 600;">-₹${data.discount.toLocaleString("en-IN")}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 12px 0 4px; border-top: 2px solid #e2e8f0; font-weight: 700; color: #0f172a; font-size: 16px;">Total</td>
              <td style="padding: 12px 0 4px; border-top: 2px solid #e2e8f0; text-align: right; font-weight: 700; color: #0f172a; font-size: 18px;">₹${data.total.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">Need help? Reply to this email or call us.</p>
        <p style="color: #cbd5e1; font-size: 11px; margin: 8px 0 0;">© Nilambur Interiors & Furniture, Trivandrum</p>
      </div>
    </div>
  </body>
  </html>`;

  return { subject, html };
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  console.log("📧 Attempting to send order confirmation email to:", data.to);
  
  const transporter = getTransporter();
  if (!transporter) {
    console.error("❌ Cannot send email — transporter not available (SMTP credentials missing)");
    return;
  }

  try {
    const { subject, html } = buildEmailTemplate(data, "confirmation");
    const info = await transporter.sendMail({
      from: `"Nilambur Furniture" <${process.env.SMTP_EMAIL}>`,
      to: data.to,
      subject,
      html,
    });
    console.log("✅ Order confirmation email sent successfully to:", data.to, "| MessageId:", info.messageId);
  } catch (error: any) {
    console.error("❌ Failed to send order confirmation email:", error?.message || error);
    console.error("   Full error:", JSON.stringify(error, null, 2));
  }
}

export async function sendOrderStatusUpdate(data: OrderEmailData) {
  console.log("📧 Attempting to send status update email to:", data.to, "| Status:", data.status);
  
  const transporter = getTransporter();
  if (!transporter) {
    console.error("❌ Cannot send email — transporter not available (SMTP credentials missing)");
    return;
  }

  try {
    const { subject, html } = buildEmailTemplate(data, "status_update");
    const info = await transporter.sendMail({
      from: `"Nilambur Furniture" <${process.env.SMTP_EMAIL}>`,
      to: data.to,
      subject,
      html,
    });
    console.log("✅ Order status update email sent to:", data.to, "| Status:", data.status, "| MessageId:", info.messageId);
  } catch (error: any) {
    console.error("❌ Failed to send status update email:", error?.message || error);
    console.error("   Full error:", JSON.stringify(error, null, 2));
  }
}

interface AdminNotificationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{ name: string; quantity: number; price: number; image?: string }>;
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: string;
  shippingAddress: string;
}

export async function sendAdminOrderNotification(data: AdminNotificationData) {
  const adminEmail = process.env.ADMIN_ORDER_EMAIL;
  if (!adminEmail) {
    console.warn("⚠️ ADMIN_ORDER_EMAIL not set, skipping admin notification.");
    return;
  }
  console.log("📧 Sending admin order notification to:", adminEmail);

  const transporter = getTransporter();
  if (!transporter) {
    console.error("❌ Cannot send admin email — transporter not available");
    return;
  }

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
        ${item.image ? `<img src="${item.image}" width="50" height="50" style="border-radius: 8px; object-fit: cover; margin-right: 10px; vertical-align: middle;" />` : ""}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
        <strong style="color: #0f172a;">${item.name}</strong><br/>
        <span style="color: #64748b; font-size: 12px;">Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #0f172a; vertical-align: middle;">
        ₹${(item.price * item.quantity).toLocaleString("en-IN")}
      </td>
    </tr>
  `).join("");

  const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="margin:0; padding:0; background-color:#fff3e0; font-family: 'Segoe UI', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
      
      <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 24px 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 700;">🔔 New Order Received!</h1>
        <p style="color: #fecaca; margin: 6px 0 0; font-size: 14px;">Order <strong>#${data.orderId}</strong> needs packing</p>
      </div>

      <div style="padding: 24px 32px;">
        
        <!-- Customer Details -->
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <h3 style="color: #166534; font-size: 14px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">👤 Customer Details</h3>
          <table width="100%" style="font-size: 14px;">
            <tr>
              <td style="color: #6b7280; padding: 3px 0; width: 100px;">Name</td>
              <td style="font-weight: 600; color: #0f172a;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 3px 0;">Phone</td>
              <td style="font-weight: 600; color: #0f172a;"><a href="tel:${data.customerPhone}" style="color: #0f172a; text-decoration: none;">${data.customerPhone}</a></td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 3px 0;">Email</td>
              <td style="font-weight: 600; color: #0f172a;"><a href="mailto:${data.customerEmail}" style="color: #0f172a; text-decoration: none;">${data.customerEmail}</a></td>
            </tr>
          </table>
        </div>

        <!-- Shipping Address -->
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <h3 style="color: #1e40af; font-size: 14px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">📍 Shipping Address</h3>
          <p style="margin: 0; font-size: 14px; color: #0f172a; font-weight: 600; line-height: 1.5;">${data.shippingAddress}</p>
        </div>

        <!-- Payment & Coupon -->
        <div style="background: #fefce8; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <h3 style="color: #854d0e; font-size: 14px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">💳 Payment</h3>
          <p style="margin: 0; font-size: 14px; color: #0f172a; font-weight: 600;">${data.paymentMethod}</p>
          ${data.couponCode ? `<p style="margin: 6px 0 0; font-size: 13px; color: #b45309;">🎫 Coupon Used: <strong>${data.couponCode}</strong> (-₹${data.discount.toLocaleString("en-IN")})</p>` : ""}
        </div>

        <!-- Order Items -->
        <h3 style="color: #0f172a; font-size: 16px; margin: 0 0 12px; font-weight: 700;">📦 Items to Pack</h3>
        <table width="100%" style="font-size: 14px; border-collapse: collapse;">
          ${itemsHtml}
        </table>

        <!-- Totals -->
        <div style="margin-top: 20px; background: #f8fafc; border-radius: 12px; padding: 16px;">
          <table width="100%" style="font-size: 14px;">
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Subtotal</td>
              <td style="text-align: right; color: #0f172a;">₹${data.subtotal.toLocaleString("en-IN")}</td>
            </tr>
            ${data.discount > 0 ? `<tr>
              <td style="color: #6b7280; padding: 4px 0;">Discount</td>
              <td style="text-align: right; color: #ef4444; font-weight: 600;">-₹${data.discount.toLocaleString("en-IN")}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 12px 0 4px; border-top: 2px solid #e2e8f0; font-weight: 700; color: #0f172a; font-size: 18px;">TOTAL</td>
              <td style="padding: 12px 0 4px; border-top: 2px solid #e2e8f0; text-align: right; font-weight: 700; color: #dc2626; font-size: 22px;">₹${data.total.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </div>
      </div>

      <div style="background: #fef2f2; padding: 16px 32px; text-align: center; border-top: 1px solid #fecaca;">
        <p style="color: #b91c1c; font-size: 13px; margin: 0; font-weight: 600;">⚡ Please process this order as soon as possible</p>
      </div>
    </div>
  </body>
  </html>`;

  try {
    const info = await transporter.sendMail({
      from: `"Nilambur Orders" <${process.env.SMTP_EMAIL}>`,
      to: adminEmail,
      subject: `🔔 New Order #${data.orderId} — ${data.customerName} — ₹${data.total.toLocaleString("en-IN")}`,
      html,
    });
    console.log("✅ Admin notification sent to:", adminEmail, "| MessageId:", info.messageId);
  } catch (error: any) {
    console.error("❌ Failed to send admin notification:", error?.message || error);
  }
}
