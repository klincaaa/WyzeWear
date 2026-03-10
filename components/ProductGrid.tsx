"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import type { Product } from "../data/products";

export type ProductGridItem = Product;

type Props = {
  products: ProductGridItem[];
};

export function ProductGrid({ products }: Props) {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              Drop · 07
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              NEW DROP
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-zinc-600">
            Latest pieces from the collection. Built for movement, cut with a studio
            eye, finished with quiet detailing.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.06 },
            },
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


