"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DbAddress } from "@/lib/db";
import { useCart } from "@/components/CartProvider";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency || "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

type Props = {
  address: DbAddress;
};

export function CheckoutClient({ address }: Props) {
  const router = useRouter();
  const { items, totalCents, clear } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 p-8 text-sm text-zinc-600">
        Cart is empty.{" "}
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="font-medium underline underline-offset-2"
        >
          Go back to shop.
        </button>
      </div>
    );
  }

  const currency = items[0]?.currency || "EUR";

  async function placeOrder() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: address.id,
          paymentMethod,
          items: items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            size: it.size,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Order failed. Please try again.");
        setLoading(false);
        return;
      }
      clear();
      router.push("/account");
      router.refresh();
    } catch {
      setError("Order failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <section className="space-y-6">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
            Shipping address
          </h2>
          <div className="mt-3 text-sm text-zinc-700">
            <p className="font-medium text-zinc-900">{address.full_name}</p>
            <p>{address.street}</p>
            <p>
              {address.postal_code} {address.city}, {address.country}
            </p>
            {address.phone && <p>{address.phone}</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
            Payment
          </h2>
          <div className="mt-3 space-y-2 text-sm text-zinc-700">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 hover:border-zinc-900">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                className="h-4 w-4"
              />
              <span>Card (simulated)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 hover:border-zinc-900">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="h-4 w-4"
              />
              <span>Cash on delivery</span>
            </label>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
      </section>

      <aside className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
          Order summary
        </h2>
        <ul className="mt-2 space-y-2 text-sm text-zinc-700">
          {items.map((it) => (
            <li key={`${it.productId}-${it.size}`} className="flex justify-between">
              <span>
                {it.name} · {it.size} × {it.quantity}
              </span>
              <span className="font-medium">
                {formatPrice(it.priceCents * it.quantity, it.currency)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-zinc-600">Total</span>
          <span className="text-lg font-semibold text-zinc-900">
            {formatPrice(totalCents, currency)}
          </span>
        </div>
        <button
          type="button"
          onClick={placeOrder}
          disabled={loading}
          className="mt-4 w-full rounded-full bg-zinc-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "Placing order…" : "Place order"}
        </button>
      </aside>
    </div>
  );
}

