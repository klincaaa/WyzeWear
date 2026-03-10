"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AdminOrder } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const statusLabel: Record<string, string> = {
  pending: "Na čekanju",
  paid: "Plaćeno",
  shipped: "Poslato",
  delivered: "Isporučeno",
  cancelled: "Otkazano",
};

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("sr-Latn", {
    style: "currency",
    currency: currency || "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(d: Date | string) {
  return new Intl.DateTimeFormat("sr-Latn", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
}

export function AdminOrdersClient() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  async function fetchOrders() {
    try {
      setError(null);
      const res = await fetch("/api/admin/orders");
      if (res.status === 401) {
        window.location.href = "/login?callbackUrl=/admin/orders";
        return;
      }
      if (res.status === 403) {
        setError("Nemate pristup ovoj stranici. Samo admin može videti porudžbine.");
        setOrders([]);
        return;
      }
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      setError("Greška pri učitavanju porudžbina.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchOrders, 60 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Porudžbine (admin)
            </h1>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-zinc-300"
                />
                Osvežavaj na 1 min
              </label>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  fetchOrders();
                }}
                disabled={loading}
                className="rounded-full border border-zinc-300 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                {loading ? "Učitavam…" : "Osveži"}
              </button>
              <Link
                href="/admin"
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900"
              >
                Admin
              </Link>
              <Link
                href="/account"
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900"
              >
                Nalog
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {error}
            </div>
          )}

          {loading && orders.length === 0 ? (
            <p className="text-sm text-zinc-500">Učitavanje porudžbina…</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-zinc-500">Nema porudžbina.</p>
          ) : (
            <ul className="space-y-6">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 pb-3">
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                        Porudžbina #{order.id}
                      </span>
                      <p className="mt-1 text-sm font-medium text-zinc-900">
                        {formatPrice(order.total_cents, order.currency)} —{" "}
                        {formatDate(order.created_at)}
                      </p>
                      {order.user_email && (
                        <p className="mt-0.5 text-xs text-zinc-500">
                          Kupac: {order.user_email}
                        </p>
                      )}
                    </div>
                    <span className="rounded-full bg-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700">
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                        Dostava
                      </p>
                      <p className="mt-0.5 text-zinc-700">
                        {order.full_name}
                        <br />
                        {order.street}, {order.postal_code} {order.city},{" "}
                        {order.country}
                        {order.phone && (
                          <>
                            <br />
                            Tel: {order.phone}
                          </>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                        Stavke
                      </p>
                      <ul className="mt-0.5 space-y-0.5 text-zinc-700">
                        {order.items.map((item, i) => (
                          <li key={i}>
                            {item.product_name ?? `#${item.product_id}`} ×{" "}
                            {item.quantity} —{" "}
                            {formatPrice(
                              item.unit_price_cents * item.quantity,
                              order.currency,
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
