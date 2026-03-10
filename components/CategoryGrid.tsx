"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Tracksuits",
    image:
      "https://images.pexels.com/photos/6311673/pexels-photo-6311673.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Hoodies",
    image:
      "https://images.pexels.com/photos/7671163/pexels-photo-7671163.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Denim",
    image:
      "https://images.pexels.com/photos/6311665/pexels-photo-6311665.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Sweatpants",
    image:
      "https://images.pexels.com/photos/6311579/pexels-photo-6311579.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Accessories",
    image:
      "https://images.pexels.com/photos/6311676/pexels-photo-6311676.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export function CategoryGrid() {
  return (
    <section className="bg-[#f5f5f4] py-12 sm:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              Edit · 01
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Featured categories
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-zinc-600">
            Curated staples for everyday rotation. Studio-developed fits, precise
            proportions and fabrics that hold their shape.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              className="group relative flex aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                loading="lazy"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/0 opacity-80 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10 flex h-full flex-col justify-between p-3 sm:p-4">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/50 text-[10px] font-medium text-white/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-200">
                    {category.name}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-zinc-200/80">
                    <span>Explore</span>
                    <span className="h-px w-6 bg-zinc-100" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

