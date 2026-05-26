'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FileUploader from '../components/FileUploader';
import ProgressBar from '../components/ProgressBar';

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<'upload' | 'processing' | 'complete'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Analyzing floor plan...');

  const handleFileSelect = (file: File, url: string) => {
    setSelectedFile(file);
    setPreviewUrl(url);
  };

  const handleGenerate = () => {
    setStep('processing');
    
    // Simulate processing
    const steps = [
      { progress: 20, status: 'Analyzing floor plan...' },
      { progress: 40, status: 'Generating 3D structure...' },
      { progress: 60, status: 'Creating interior design...' },
      { progress: 80, status: 'Rendering cinematic video...' },
      { progress: 100, status: 'Finalizing...' },
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setProgress(step.progress);
        setStatus(step.status);
        
        if (index === steps.length - 1) {
          setTimeout(() => {
            router.push('/floorplan-ai/result');
          }, 500);
        }
      }, index * 1500);
    });
  };

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <header className="border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/floorplan-ai" className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold">
                FloorPlan<span className="text-orange-500">AI</span>
              </span>
            </Link>
            <div className="flex items-center gap-2 text-navy-400 text-sm">
              <span className={`w-2 h-2 rounded-full ${step === 'upload' ? 'bg-orange-500' : step === 'processing' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
              <span className={step === 'upload' ? 'text-orange-500 font-medium' : ''}>Upload</span>
              <span className="text-navy-600">→</span>
              <span className={step === 'processing' ? 'text-orange-500 font-medium' : ''}>Process</span>
              <span className="text-navy-600">→</span>
              <span className={step === 'complete' ? 'text-orange-500 font-medium' : ''}>Result</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        {step === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl font-bold mb-4">
                Upload Your Floor Plan
              </h1>
              <p className="text-navy-400 text-lg">
                Drop your floor plan below and let AI do the magic
              </p>
            </div>

            {!selectedFile ? (
              <FileUploader onFileSelect={handleFileSelect} />
            ) : (
              <div className="space-y-8">
                {/* Preview */}
                <div className="rounded-3xl overflow-hidden bg-navy-800/50 border border-navy-700">
                  <div className="aspect-video bg-navy-900 flex items-center justify-center relative">
                    {previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-navy-500">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>Preview</p>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-navy-400 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="text-navy-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Generate button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  className="w-full px-8 py-5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25 text-lg"
                >
                  Generate Cinematic Video
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-4">
              Creating Your Video
            </h2>
            <p className="text-navy-400 text-lg mb-12">
              This usually takes 30-60 seconds
            </p>
            <ProgressBar progress={progress} status={status} />
          </motion.div>
        )}
      </main>
    </div>
  );
}
