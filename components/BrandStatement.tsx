"use client";

import { motion } from "framer-motion";

export function BrandStatement() {
  return (
    <section className="bg-[#f7f7f7] py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-[11px] font-medium uppercase tracking-[0.32em] text-zinc-500"
        >
          Studio line · Statement
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl md:text-[2.6rem]"
        >
          Always Dreaming.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}
          className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base"
        >
          Born from late nights in the city and quiet mornings in the studio,
          WyzeWear pieces move with you through every chapter. Rooted in street
          culture, refined through thoughtful tailoring and elevated materials.
        </motion.p>
      </div>
    </section>
  );
}

