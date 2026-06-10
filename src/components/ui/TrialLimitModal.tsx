'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface TrialLimitModalProps {
  isOpen: boolean;
  current: number;
  max: number;
  productSlug: string;
}

export default function TrialLimitModal({ isOpen, current, max, productSlug }: TrialLimitModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-2xl"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                borderRadius: "16px",
              }}
            />

            <div className="relative z-10">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-zinc-600 bg-zinc-800">
                  <span className="text-4xl">🔒</span>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-white">Free Trial Limit Reached</h2>
                <p className="text-zinc-400">
                  You have used {current} of {max} free trials
                </p>
              </div>

              <div className="mb-8 rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Trial Usage</span>
                  <span className="text-sm font-medium text-zinc-300">{current}/{max}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/checkout/${productSlug}`}
                  className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-center text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98]"
                >
                  Go to Checkout → Unlock Lifetime Access
                </Link>
                <p className="text-center text-xs text-zinc-500">
                  No login required · Instant access after payment
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}