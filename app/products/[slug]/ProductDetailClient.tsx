"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

const SIZES = ["XS", "S", "M", "L", "XL"];

type Props = {
  product: {
    id: number;
    slug: string;
    name: string;
    image: string;
    priceCents: number;
    currency: string;
    stock: number;
  };
};

export function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState("");

  const disabled = product.stock <= 0;

  function handleAdd() {
    if (disabled) return;
    if (!size) {
      setError("Izaberite veličinu.");
      return;
    }
    setError("");
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        priceCents: product.priceCents,
        currency: product.currency,
        size,
      },
      quantity,
    );
    router.push("/cart");
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Size
          </span>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                  size === s
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 text-zinc-700 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Quantity
          </span>
          <div className="flex items-center rounded-full border border-zinc-300">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center text-zinc-600 hover:bg-zinc-100"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuantity((q) =>
                  product.stock > 0 ? Math.min(product.stock, q + 1) : q,
                )
              }
              className="flex h-10 w-10 items-center justify-center text-zinc-600 hover:bg-zinc-100"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-zinc-900 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial"
        >
          {disabled ? "Out of stock" : "Add to cart"}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

