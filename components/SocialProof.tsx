"use client";

import { motion } from "framer-motion";

const reviews = [
  {
    name: "Elias",
    text: "Best quality hoodie I've owned. Heavy but drapes perfectly.",
    tag: "Verified customer",
  },
  {
    name: "Maya",
    text: "The tracksuit feels tailored, not sloppy. Elevated but still relaxed.",
    tag: "Repeat customer",
  },
  {
    name: "Jonas",
    text: "Details are crazy. Stitching, hardware, wash – everything feels considered.",
    tag: "First drop",
  },
];

export function SocialProof() {
  return (
    <section className="bg-white py-14 sm:py-18">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              Social · Proof
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Trusted by Thousands
            </h2>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm text-zinc-700 sm:items-end">
            <div className="flex items-center gap-1 text-xs font-medium">
              <span className="text-base leading-none text-amber-500">★★★★★</span>
              <span className="ml-2 text-[11px] uppercase tracking-[0.22em] text-zinc-600">
                4.9 / 5 · 2,300+ reviews
              </span>
            </div>
            <div className="flex -space-x-2">
              {["E", "M", "J", "S"].map((initial) => (
                <span
                  key={initial}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white bg-zinc-900 text-[11px] font-medium text-white"
                >
                  {initial}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 text-sm shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1 hover:bg-white"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
            >
              <p className="text-zinc-800">&ldquo;{review.text}&rdquo;</p>
              <div className="mt-5 flex items-center justify-between text-xs text-zinc-600">
                <div>
                  <p className="font-medium text-zinc-900">{review.name}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.22em]">
                    {review.tag}
                  </p>
                </div>
                <span className="text-base leading-none text-amber-500">★★★★★</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

