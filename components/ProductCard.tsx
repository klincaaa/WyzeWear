"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "../data/products";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const href = `/products/${product.slug ?? product.id}`;
  return (
    <motion.div
      className="group flex flex-col gap-3"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Link href={href} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-zinc-100">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              loading="lazy"
              className="object-cover transition-opacity duration-300 group-hover:opacity-0"
            />
            <Image
              src={product.hoverImage}
              alt={product.name}
              fill
              loading="lazy"
              className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <span className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-center rounded-full bg-white/90 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-900 opacity-0 shadow-sm transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
            View details
          </span>
        </div>

        <div className="flex items-start justify-between gap-2 text-xs">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
              {product.category}
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-900">{product.name}</p>
          </div>
          <p className="text-xs font-medium text-zinc-900">{product.price}</p>
        </div>
      </Link>
    </motion.div>
  );
}

