"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency || "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function CartClient() {
  const router = useRouter();
  const { items, totalCents, clear, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 p-8 text-center">
        <p className="text-sm text-zinc-600">
          Your cart is empty. Start by adding something from the collection.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-flex rounded-full bg-zinc-900 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white hover:bg-zinc-800"
        >
          Shop now
        </Link>
      </div>
    );
  }

  const currency = items[0]?.currency || "EUR";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4"
          >
            <div className="hidden h-24 w-20 overflow-hidden rounded-lg bg-zinc-100 sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-2 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Size: {item.size}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.size)}
                  className="text-xs text-zinc-500 hover:text-zinc-900"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.size,
                        Math.max(1, item.quantity - 1),
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-xs text-zinc-700 hover:bg-zinc-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-xs font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.size,
                        item.quantity + 1,
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-xs text-zinc-700 hover:bg-zinc-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-medium text-zinc-900">
                  {formatPrice(item.priceCents * item.quantity, item.currency)}
                </span>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={clear}
          className="text-xs text-zinc-500 underline hover:text-zinc-900"
        >
          Clear cart
        </button>
      </div>

      <aside className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-600">Subtotal</span>
          <span className="font-medium text-zinc-900">
            {formatPrice(totalCents, currency)}
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          Shipping and taxes calculated at checkout.
        </p>
        <button
          type="button"
          onClick={() => router.push("/checkout")}
          className="mt-2 w-full rounded-full bg-zinc-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white hover:bg-zinc-800"
        >
          Checkout
        </button>
      </aside>
    </div>
  );
}

