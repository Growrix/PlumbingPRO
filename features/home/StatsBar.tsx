"use client";

import { motion } from "framer-motion";
import { stats } from "@/data/trust-badges";

export function StatsBar() {
  return (
    <div className="bg-brand-600 py-8">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="text-sm text-brand-200 mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
