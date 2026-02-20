"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiFilter, FiPackage, FiMail, FiPhone, FiMapPin, FiChevronDown, FiChevronUp, FiCreditCard, FiTag, FiCalendar, FiUser } from "react-icons/fi";
import Image from "next/image";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatus = (order: any) => order.orderStatus || order.status || "Pending";
  const getTotal = (order: any) => order.totalAmount || order.total || 0;
  const getOrderId = (order: any) => order.orderId || order._id;
  const getCustomerName = (order: any) => order.customerInfo?.name || "Guest";
  const getCustomerPhone = (order: any) => order.customerInfo?.phone || "";
  const getCustomerEmail = (order: any) => order.customerInfo?.email || order.guestEmail || "";
  const getShippingAddress = (order: any) => {
    if (!order.shippingAddress) return "N/A";
    const a = order.shippingAddress;
    return `${a.address || a.street || ""}, ${a.city || ""} ${a.postalCode || a.zipCode || ""}`.trim();
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const payload: any = { orderStatus: newStatus };
      if (newStatus === "Confirmed") payload.paymentStatus = "Paid";

      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const filtered = orders.filter((o) => {
    const id = getOrderId(o).toLowerCase();
    const name = getCustomerName(o).toLowerCase();
    const q = search.toLowerCase();
    return id.includes(q) || name.includes(q);
  }).filter(o => filter === "All" || getStatus(o) === filter);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700 border-green-200";
      case "Shipped": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Confirmed": return "bg-teal-100 text-teal-700 border-teal-200";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all customer orders. Click any order to expand details.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg font-bold text-sm">{orders.length}</span>
          <span className="text-sm text-gray-500 font-medium">Total Orders</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 w-full max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FiFilter className="text-gray-400" />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-sm rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Loading orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
              <FiPackage size={28} />
            </div>
            <p className="text-gray-500 font-medium">No orders found.</p>
            <p className="text-gray-400 text-sm mt-1">Orders will appear here when customers place them.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((order) => {
              const isExpanded = expandedOrder === order._id;
              const status = getStatus(order);

              return (
                <div key={order._id}>
                  {/* Order Row — Clickable */}
                  <div
                    onClick={() => toggleExpand(order._id)}
                    className={`p-4 sm:p-5 cursor-pointer hover:bg-gray-50/50 transition-colors ${isExpanded ? "bg-teal-50/30" : ""}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                          status === "Delivered" ? "bg-green-100 text-green-700" :
                          status === "Shipped" ? "bg-blue-100 text-blue-700" :
                          status === "Confirmed" ? "bg-teal-100 text-teal-700" :
                          status === "Cancelled" ? "bg-red-100 text-red-700" :
                          "bg-orange-100 text-orange-700"
                        }`}>
                          {status === "Delivered" ? "✓" : status === "Shipped" ? "🚚" : status === "Cancelled" ? "✕" : "●"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-navy text-sm">#{getOrderId(order)}</span>
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(status)}`}>
                              {status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1"><FiUser size={10} /> {getCustomerName(order)}</span>
                            <span>•</span>
                            <span>{order.items?.length || 0} item{(order.items?.length || 0) > 1 ? "s" : ""}</span>
                            <span>•</span>
                            <span>{order.paymentMethod || "N/A"}</span>
                            {order.createdAt && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span className="hidden sm:inline text-gray-400">{formatDate(order.createdAt)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4">
                        <span className="font-bold text-teal-700 text-base">₹{getTotal(order).toLocaleString("en-IN")}</span>
                        <select
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          value={status}
                          className="text-xs font-semibold bg-white border border-gray-200 rounded-lg py-1.5 px-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
                        >
                          <option disabled value={status}>Update</option>
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirm</option>
                          <option value="Shipped">Ship</option>
                          <option value="Delivered">Deliver</option>
                          <option value="Cancelled">Cancel</option>
                        </select>
                        <div className="text-gray-400">
                          {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-5 pb-5 pt-0">
                          <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 space-y-5 border border-gray-100">

                            {/* Grid: Customer + Shipping + Payment */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {/* Customer Info */}
                              <div className="bg-white rounded-xl p-4 border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                  <FiUser size={12} /> Customer
                                </h4>
                                <p className="font-semibold text-navy text-sm mb-1">{getCustomerName(order)}</p>
                                {getCustomerPhone(order) && (
                                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                                    <FiPhone size={11} /> <a href={`tel:${getCustomerPhone(order)}`} className="hover:text-teal-600 transition-colors">{getCustomerPhone(order)}</a>
                                  </p>
                                )}
                                {getCustomerEmail(order) && (
                                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <FiMail size={11} /> <a href={`mailto:${getCustomerEmail(order)}`} className="hover:text-teal-600 transition-colors truncate">{getCustomerEmail(order)}</a>
                                  </p>
                                )}
                              </div>

                              {/* Shipping Address */}
                              <div className="bg-white rounded-xl p-4 border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                  <FiMapPin size={12} /> Shipping Address
                                </h4>
                                <p className="text-sm text-navy font-medium leading-relaxed">{getShippingAddress(order)}</p>
                              </div>

                              {/* Payment Info */}
                              <div className="bg-white rounded-xl p-4 border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                  <FiCreditCard size={12} /> Payment
                                </h4>
                                <p className="text-sm text-navy font-semibold mb-1">{order.paymentMethod || "N/A"}</p>
                                <p className="text-xs text-gray-500">
                                  Status: <span className={`font-semibold ${order.paymentStatus === "Paid" ? "text-green-600" : "text-orange-600"}`}>
                                    {order.paymentStatus || "Pending"}
                                  </span>
                                </p>
                                {order.couponCode && (
                                  <p className="text-xs text-teal-600 mt-1 flex items-center gap-1">
                                    <FiTag size={10} /> Coupon: <span className="font-bold">{order.couponCode}</span>
                                    {order.discountAmount > 0 && <span className="text-red-500 ml-1">(-₹{order.discountAmount.toLocaleString("en-IN")})</span>}
                                  </p>
                                )}
                                {order.createdAt && (
                                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                    <FiCalendar size={10} /> {formatDate(order.createdAt)}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Ordered Items */}
                            <div>
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <FiPackage size={12} /> Ordered Items ({order.items?.length || 0})
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {order.items?.map((item: any, idx: number) => (
                                  <div key={idx} className="bg-white rounded-xl p-3 border border-gray-100 flex gap-3 items-center">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                      {item.image ? (
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                          <FiPackage size={20} />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-semibold text-navy text-sm truncate">{item.name}</h5>
                                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                                      <p className="font-bold text-teal-700 text-sm mt-0.5">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Price Summary */}
                            <div className="bg-white rounded-xl p-4 border border-gray-100 max-w-xs ml-auto">
                              <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between text-gray-500">
                                  <span>Subtotal</span>
                                  <span className="font-medium text-navy">₹{(order.subtotal || getTotal(order)).toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                  <span>Shipping</span>
                                  <span className="font-semibold text-green-600">Free</span>
                                </div>
                                {order.discountAmount > 0 && (
                                  <div className="flex justify-between text-gray-500">
                                    <span>Discount</span>
                                    <span className="font-semibold text-red-500">-₹{order.discountAmount.toLocaleString("en-IN")}</span>
                                  </div>
                                )}
                                <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                                  <span className="font-bold text-navy">Total</span>
                                  <span className="font-bold text-lg text-navy">₹{getTotal(order).toLocaleString("en-IN")}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
