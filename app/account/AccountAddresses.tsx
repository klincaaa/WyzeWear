"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DbAddress } from "@/lib/db";

type Props = { addresses: DbAddress[] };

export function AccountAddresses({ addresses }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    street: "",
    city: "",
    postal_code: "",
    country: "",
    phone: "",
    is_default: false,
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: form.phone || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Greška pri dodavanju.");
        setSaving(false);
        return;
      }
      setShowForm(false);
      setForm({
        full_name: "",
        street: "",
        city: "",
        postal_code: "",
        country: "",
        phone: "",
        is_default: false,
      });
      router.refresh();
    } catch {
      setError("Greška pri dodavanju.");
    }
    setSaving(false);
  }

  async function setDefault(id: number) {
    try {
      const res = await fetch(`/api/account/addresses/${id}/default`, {
        method: "PATCH",
      });
      if (!res.ok) return;
      router.refresh();
    } catch {
      // ignore
    }
  }

  return (
    <div className="mt-4 space-y-4">
      {addresses.length === 0 && !showForm && (
        <p className="text-sm text-zinc-500">Nemate sačuvanih adresa.</p>
      )}
      <ul className="space-y-3">
        {addresses.map((a) => (
          <li
            key={a.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4"
          >
            <div className="text-sm text-zinc-700">
              <p className="font-medium text-zinc-900">{a.full_name}</p>
              <p>{a.street}</p>
              <p>
                {a.postal_code} {a.city}, {a.country}
              </p>
              {a.phone && <p>{a.phone}</p>}
              {a.is_default ? (
                <span className="mt-1 inline-block text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  Podrazumevana
                </span>
              ) : null}
            </div>
            {!a.is_default && (
              <button
                type="button"
                onClick={() => setDefault(a.id)}
                className="text-[11px] font-medium uppercase tracking-wider text-zinc-600 hover:text-zinc-900"
              >
                Postavi podrazumevanu
              </button>
            )}
          </li>
        ))}
      </ul>

      {showForm ? (
        <form onSubmit={handleAdd} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <input
            required
            placeholder="Ime i prezime"
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Ulica i broj"
            value={form.street}
            onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="Grad"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="Poštanski broj"
              value={form.postal_code}
              onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
            />
          </div>
          <input
            required
            placeholder="Država"
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
          />
          <input
            placeholder="Telefon"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
              className="rounded border-zinc-300"
            />
            Podrazumevana adresa
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-zinc-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {saving ? "Dodavanje…" : "Dodaj"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-zinc-300 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-700 hover:bg-zinc-100"
            >
              Otkaži
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-full border border-zinc-300 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-700 hover:bg-zinc-100"
        >
          + Dodaj adresu
        </button>
      )}
    </div>
  );
}
