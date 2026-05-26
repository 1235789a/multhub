'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-navy-800 aspect-video">
      {/* Placeholder video */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-800 to-navy-900">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
          <p className="text-navy-400">Your cinematic video will appear here</p>
        </div>
      </div>

      {/* Play button overlay */}
      {!isPlaying && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-orange-500/90 flex items-center justify-center shadow-xl shadow-orange-500/50">
            <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </motion.button>
      )}
    </div>
  );
}
