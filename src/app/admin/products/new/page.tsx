"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSave, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CloudinaryUploader from "@/components/ui/CloudinaryUploader";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dbCategories, setDbCategories] = useState<{_id: string; name: string}[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "10",
    images: [] as string[],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && data.categories.length > 0) {
          setDbCategories(data.categories);
          setFormData(prev => ({ ...prev, category: data.categories[0].name }));
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert("Please upload at least one product image.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          stock: Number(formData.stock),
          images: formData.images,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/admin/products");
        }, 2000);
      } else {
        alert("Error adding product: " + data.message);
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative">
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-3xl"
          >
            <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm border border-gray-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-inner">
                <FiCheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold font-serif text-navy mb-2">Product Live!</h2>
              <p className="text-gray-500 text-sm">Your new furniture piece has been successfully added to the database. Redirecting to inventory...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex justify-between items-center mb-8 transition-opacity ${isSuccess ? 'opacity-20 pointer-events-none' : ''}`}>
        <div>
          <h1 className="text-2xl font-bold text-navy">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to list a new item</p>
        </div>
        <Link href="/admin/products" className="text-teal-600 font-semibold hover:underline bg-white px-4 py-2 rounded-lg border border-gray-200">
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-opacity ${isSuccess ? 'opacity-20 pointer-events-none' : ''}`}>
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-navy mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Product Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm" 
                  placeholder="E.g., Royal Velvet Sofa"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Description <span className="text-red-500">*</span></label>
                <textarea 
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm resize-none" 
                  placeholder="Detailed description of the product..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Price (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm" 
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Stock Quantity <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm" 
                    placeholder="10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Media & Categories */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-navy mb-4">Organization</h2>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Category <span className="text-red-500">*</span></label>
              {categoriesLoading ? (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400 animate-pulse">Loading categories...</div>
              ) : dbCategories.length === 0 ? (
                <div className="w-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-600">
                  No categories found. <a href="/admin/categories" className="font-bold underline">Add categories first →</a>
                </div>
              ) : (
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm appearance-none"
                  required
                >
                  {dbCategories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-navy mb-4">Product Images</h2>
            <CloudinaryUploader 
              images={formData.images}
              onImagesChange={(newImages) => setFormData({ ...formData, images: newImages })}
              maxFiles={8}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-navy text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors shadow-xl shadow-navy/20 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiSave size={20} />}
            {loading ? "Saving..." : "Publish Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
