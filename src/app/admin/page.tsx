"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign, FiBox, FiTag } from "react-icons/fi";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { name: "Total Revenue", value: "₹0", icon: FiDollarSign, change: "0%", color: "text-emerald-600", bg: "bg-emerald-100" },
    { name: "Total Orders", value: "0", icon: FiShoppingBag, change: "0%", color: "text-blue-600", bg: "bg-blue-100" },
    { name: "Active Users", value: "0", icon: FiUsers, change: "0%", color: "text-purple-600", bg: "bg-purple-100" },
    { name: "Total Products", value: "0", icon: FiTrendingUp, change: "0%", color: "text-orange-600", bg: "bg-orange-100" },
  ]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products")
        ]);
        
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        
        let revenue = 0;
        let ordersCount = 0;
        let validOrders = [];

        if (ordersData.success && ordersData.orders) {
          validOrders = ordersData.orders;
          ordersCount = validOrders.length;
          revenue = validOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        }

        let productsCount = 0;
        if (productsData.success && productsData.products) {
          productsCount = productsData.products.length;
        }

        setStats([
          { name: "Total Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, icon: FiDollarSign, change: "Live", color: "text-emerald-600", bg: "bg-emerald-100" },
          { name: "Total Orders", value: ordersCount.toString(), icon: FiShoppingBag, change: "Live", color: "text-blue-600", bg: "bg-blue-100" },
          { name: "Active Customers", value: new Set(validOrders.map((o: any) => o.customerInfo?.email)).size.toString(), icon: FiUsers, change: "Live", color: "text-purple-600", bg: "bg-purple-100" },
          { name: "Total Products", value: productsCount.toString(), icon: FiBox, change: "Live", color: "text-orange-600", bg: "bg-orange-100" },
        ]);

        setRecentOrders(validOrders.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between"
            >
              <div>
                <p className="text-gray-500 font-medium text-sm mb-1">{stat.name}</p>
                <h3 className="text-2xl font-bold text-navy mb-2">{loading ? "..." : stat.value}</h3>
                <span className={`text-xs font-semibold ${stat.color} px-2 py-1 bg-gray-50 rounded-full flex items-center w-max gap-1`}>
                  <FiTrendingUp /> {stat.change}
                </span>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-navy">Recent Orders</h2>
            <Link href="/admin/orders" className="text-teal-600 font-medium text-sm hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
             {loading ? (
                <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div></div>
             ) : recentOrders.length === 0 ? (
                <div className="py-12 text-center text-gray-500">No orders placed yet.</div>
             ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-sm text-gray-400 border-b border-gray-100">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Total</th>
                      <th className="pb-3 font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-b last:border-none border-gray-50">
                        <td className="py-4 text-navy font-semibold text-sm">#{order.orderId}</td>
                        <td className="py-4 text-gray-600 text-sm">{order.customerInfo?.name || "Guest"}</td>
                        <td className="py-4 text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 text-navy font-bold text-sm">₹{order.total?.toLocaleString("en-IN") || 0}</td>
                        <td className="py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-teal-100 text-teal-700'
                          }`}>
                            {order.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             )}
          </div>
        </motion.div>

        {/* Quick Actions / Notifications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full"
        >
          <h2 className="text-lg font-bold text-navy mb-6">Quick Actions</h2>
          <div className="flex flex-col gap-4 mb-8">
            <Link href="/admin/products" className="bg-teal-50 hover:bg-teal-100 text-teal-700 p-4 rounded-xl flex items-center justify-between transition-colors group">
              <span className="font-semibold">Manage Products</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <FiBox size={16} />
              </div>
            </Link>
            <Link href="/admin/categories" className="bg-orange-50 hover:bg-orange-100 text-orange-700 p-4 rounded-xl flex items-center justify-between transition-colors group">
              <span className="font-semibold">Manage Categories</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <FiTag size={16} />
              </div>
            </Link>
          </div>

          <h2 className="text-lg font-bold text-navy mb-4">Live Insights</h2>
          <div className="flex flex-col gap-4 flex-grow overflow-y-auto no-scrollbar">
            {recentOrders.length > 0 && typeof window !== "undefined" && (
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-teal-500 shrink-0"></div>
                <div>
                  <p className="text-sm font-semibold text-navy">Latest Order</p>
                  <p className="text-xs text-gray-500">#{recentOrders[0].orderId} received</p>
                </div>
              </div>
            )}
             <div className="flex gap-3 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 shrink-0"></div>
                <div>
                  <p className="text-sm font-semibold text-navy">System Status</p>
                  <p className="text-xs text-gray-500">Database connection secure.</p>
                </div>
              </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
