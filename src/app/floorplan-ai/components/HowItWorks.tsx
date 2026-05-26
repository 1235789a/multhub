'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Upload Floor Plan',
    description: 'Upload your 2D floor plan in PDF, JPG, or PNG format.',
  },
  {
    number: '02',
    title: 'AI Processing',
    description: 'Our AI analyzes the layout and generates 3D structures.',
  },
  {
    number: '03',
    title: 'Cinematic Render',
    description: 'Watch as your floor plan comes to life in stunning 3D.',
  },
  {
    number: '04',
    title: 'Download & Share',
    description: 'Download your video and use it anywhere.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-navy-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-navy-400 text-lg max-w-2xl mx-auto">
            Four simple steps to transform your floor plans
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-navy-800 -translate-y-1/2" />

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Circle */}
                <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-full bg-navy-800 border-4 border-navy-900 flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-orange-500">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-navy-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
