'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 bg-navy-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center p-12 rounded-3xl bg-gradient-to-br from-orange-500/10 to-navy-900 border border-orange-500/20"
        >
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Listings?
          </h2>
          <p className="text-navy-300 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of real estate professionals already using FloorPlan AI to create stunning marketing content.
          </p>
          <Link href="/floorplan-ai/upload">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25 text-lg"
            >
              Start Creating Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
