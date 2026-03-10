"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative flex h-[80vh] items-center overflow-hidden bg-black text-white sm:h-[90vh]">
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/6311662/pexels-photo-6311662.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Editorial streetwear campaign"
          fill
          priority
          className="object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl space-y-5"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-200">
            New Season · Studio Line
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-[3.6rem] md:leading-[1.02]">
            EVERYDAY
            <span className="block text-zinc-300">UNIFORM</span>
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-zinc-200 sm:text-base">
            Premium streetwear designed for everyday movement. Tailored silhouettes,
            engineered fabrics and a precise, understated attitude.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.18 }}
          className="flex flex-col gap-3 text-xs font-medium uppercase tracking-[0.18em] sm:flex-row"
        >
          <button className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-[11px] font-semibold tracking-[0.24em] text-black transition-transform duration-200 hover:-translate-y-0.5 hover:bg-zinc-100">
            SHOP NOW
          </button>
          <button className="inline-flex items-center justify-center rounded-full border border-white/50 px-8 py-3 text-[11px] tracking-[0.24em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white/5">
            EXPLORE COLLECTION
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
          className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-zinc-300"
        >
          <span>Studio-cut hoodies · Technical tracksuits · Everyday denim</span>
          <span className="hidden sm:inline-flex items-center gap-2">
            Scroll
            <span className="h-10 w-px bg-zinc-500" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

