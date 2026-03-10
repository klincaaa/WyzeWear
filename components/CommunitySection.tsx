"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const communityImages = [
  "https://images.pexels.com/photos/6311641/pexels-photo-6311641.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6311578/pexels-photo-6311578.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6311683/pexels-photo-6311683.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6311688/pexels-photo-6311688.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6311628/pexels-photo-6311628.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6311661/pexels-photo-6311661.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6311684/pexels-photo-6311684.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6311678/pexels-photo-6311678.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export function CommunitySection() {
  return (
    <section className="bg-[#f5f5f4] py-14 sm:py-18">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              Social · Edit
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Community
            </h2>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-zinc-600">
            Tag{" "}
            <span className="font-medium text-zinc-900">@wyzewear</span> to be
            featured in our community edit.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {communityImages.map((src, index) => (
            <motion.div
              key={src}
              className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
            >
              <Image
                src={src}
                alt="Community wearing WyzeWear"
                fill
                loading="lazy"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
          Tag <span className="font-medium text-zinc-900">@wyzewear</span> to be
          featured.
        </p>
      </div>
    </section>
  );
}

