'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface FileUploaderProps {
  onFileSelect: (file: File, previewUrl: string) => void;
}

export default function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or PDF file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      onFileSelect(file, previewUrl);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
        isDragging 
          ? 'border-orange-500 bg-orange-500/10' 
          : 'border-navy-700 bg-navy-800/50 hover:border-navy-500'
      }`}
    >
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <motion.div
        animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-orange-500/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          Drop your floor plan here
        </h3>
        <p className="text-navy-400 mb-6">
          or click to browse
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-navy-500">
          <span className="px-3 py-1 rounded-lg bg-navy-800 border border-navy-700">JPG</span>
          <span className="px-3 py-1 rounded-lg bg-navy-800 border border-navy-700">PNG</span>
          <span className="px-3 py-1 rounded-lg bg-navy-800 border border-navy-700">PDF</span>
        </div>
      </motion.div>
    </div>
  );
}
