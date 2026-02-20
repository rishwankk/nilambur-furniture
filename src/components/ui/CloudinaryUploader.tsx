"use client";

import { useState, useRef, useCallback } from "react";
import { FiUploadCloud, FiX, FiImage, FiCheck, FiAlertCircle } from "react-icons/fi";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CloudinaryUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxFiles?: number;
}

export default function CloudinaryUploader({ images, onImagesChange, maxFiles = 8 }: CloudinaryUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => 
      f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024 // 10MB max
    );

    if (validFiles.length === 0) {
      setError("Please select valid image files (max 10MB each).");
      setTimeout(() => setError(""), 4000);
      return;
    }

    if (images.length + validFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed.`);
      setTimeout(() => setError(""), 4000);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      const formData = new FormData();
      validFiles.forEach(file => formData.append("files", file));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.urls) {
        onImagesChange([...images, ...data.urls]);
        setUploadProgress(100);
      } else {
        setError(data.message || "Upload failed. Check your Cloudinary credentials.");
      }
    } catch (err) {
      setError("Network error during upload. Please try again.");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  }, [images, onImagesChange, maxFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrlToDelete = images[index];
    
    // 1. Optimistically remove from UI immediately
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);

    // 2. Delete from Cloudinary in the background
    try {
      await fetch("/api/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrlToDelete }),
      });
    } catch (err) {
      console.error("Failed to delete image from Cloudinary:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-teal-500 bg-teal-50/50 scale-[1.02]"
            : uploading
            ? "border-teal-400 bg-teal-50/30"
            : "border-gray-200 hover:border-teal-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
            <p className="text-teal-700 font-bold text-sm">Uploading to Cloudinary...</p>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-teal-600 h-full rounded-full"
                animate={{ width: `${uploadProgress || 50}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
              <FiUploadCloud size={32} />
            </div>
            <div>
              <p className="font-bold text-navy text-sm">
                {isDragging ? "Drop images here!" : "Drag & drop images"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                or click to browse · PNG, JPG, WEBP · Max 10MB · Up to {maxFiles} images
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm font-medium"
          >
            <FiAlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">
            Uploaded Images ({images.length}/{maxFiles})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <motion.div
                key={img + i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-100 group bg-gray-50 shadow-sm"
              >
                <Image src={img} alt={`Upload ${i + 1}`} fill className="object-cover" />
                
                {/* First image badge */}
                {i === 0 && (
                  <div className="absolute top-2 left-2 bg-teal-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm z-10">
                    COVER
                  </div>
                )}

                {/* Delete overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(i);
                    }}
                    className="bg-white text-red-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:scale-110"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Cloudinary badge */}
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-[9px] font-bold text-gray-500 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <FiCheck size={10} className="text-green-500" />
                  Cloudinary
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
