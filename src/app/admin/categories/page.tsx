"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiImage, FiUploadCloud, FiX } from "react-icons/fi";
import Image from "next/image";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  image: string;
  description: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", image: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Cloudinary upload states
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleUploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      toast.error("Please select a valid image file (max 10MB).");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success && data.urls?.[0]) {
        setFormData(prev => ({ ...prev, image: data.urls[0] }));
      } else {
        toast.error(data.message || "Upload failed. Check Cloudinary credentials.");
      }
    } catch {
      toast.error("Network error during upload.");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ name: "", image: "", description: "" });
        setIsModalOpen(false);
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error adding category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCategories(prev => prev.filter(c => c._id !== id));
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch {
      toast.error("Network error while deleting category.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Manage Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your store collections dynamically.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-navy text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-navy/20"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center text-teal-600">
            <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 font-medium">No custom categories found. Default ones are currently active.</p>
          </div>
        ) : (
          categories.map((cat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.1 }}
              key={cat._id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group relative ${deleting === cat._id ? 'opacity-50 pointer-events-none scale-95' : ''}`}
            >
              <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <FiImage className="text-4xl text-gray-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 right-4 text-white font-serif font-bold text-xl drop-shadow-md">
                  {cat.name}
                </h3>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteCategory(cat._id, cat.name)}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-red-500 w-9 h-9 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white hover:scale-110 z-10"
                  title="Delete category"
                >
                  {deleting === cat._id ? (
                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                  ) : (
                    <FiTrash2 size={16} />
                  )}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => { setIsModalOpen(false); setFormData({ name: "", image: "", description: "" }); }}
                className="absolute top-6 right-6 text-gray-400 hover:text-navy transition-colors"
              >
                ✕
              </button>
              
              <h2 className="text-2xl font-bold text-navy mb-6">New Category</h2>
              
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Category Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="E.g., Outdoor Furniture"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm"
                  />
                </div>

                {/* Cloudinary Image Upload */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Category Image</label>
                  
                  {formData.image ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-teal-100 bg-gray-50 group">
                      <Image src={formData.image} alt="Category preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: "" })}
                          className="bg-white text-red-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:scale-110"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-teal-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                        CLOUDINARY
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                        isDragging
                          ? "border-teal-500 bg-teal-50/50 scale-[1.02]"
                          : uploading
                          ? "border-teal-400 bg-teal-50/30"
                          : "border-gray-200 hover:border-teal-400 hover:bg-gray-50"
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files?.[0]) handleUploadFile(e.dataTransfer.files[0]);
                      }}
                      onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleUploadFile(e.target.files[0])}
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                          <p className="text-teal-700 font-bold text-xs">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                            <FiUploadCloud size={24} />
                          </div>
                          <p className="font-bold text-navy text-xs">
                            {isDragging ? "Drop image here!" : "Drag & drop or click to upload"}
                          </p>
                          <p className="text-[10px] text-gray-400">PNG, JPG, WEBP · Max 10MB</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Optional description"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm resize-none"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-navy text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-navy/10 mt-4 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Add Category"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
