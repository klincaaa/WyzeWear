"use client";

import type { DbOrder, DbOrderItem } from "@/lib/db";

type OrderWithItems = DbOrder & { items: DbOrderItem[] };

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("sr-Latn", {
    style: "currency",
    currency: currency || "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("sr-Latn", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(d));
}

const statusLabel: Record<string, string> = {
  pending: "Na čekanju",
  paid: "Plaćeno",
  shipped: "Poslato",
  delivered: "Isporučeno",
  cancelled: "Otkazano",
};

type Props = { orders: OrderWithItems[] };

export function AccountOrders({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <p className="mt-4 text-sm text-zinc-500">
        Nemate još nijednu porudžbinu. Kada završite kupovinu, ovde će se pojaviti istorija.
      </p>
    );
  }

  return (
    <ul className="mt-4 space-y-6">
      {orders.map((order) => (
        <li
          key={order.id}
          className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Porudžbina #{order.id}
            </span>
            <span className="text-sm font-medium text-zinc-900">
              {formatPrice(order.total_cents, order.currency)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
            <span>{formatDate(order.created_at)}</span>
            <span className="rounded-full bg-zinc-200 px-2 py-0.5 font-medium text-zinc-700">
              {statusLabel[order.status] ?? order.status}
            </span>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-zinc-700">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.product_name ?? `Proizvod #${item.product_id}`} × {item.quantity}{" "}
                — {formatPrice(item.unit_price_cents * item.quantity, order.currency)}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
