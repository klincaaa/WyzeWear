"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
};

export function AccountProfile({ email, firstName, lastName }: Props) {
  const router = useRouter();
  const [first, setFirst] = useState(firstName);
  const [last, setLast] = useState(lastName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<"success" | "error" | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: first.trim(), lastName: last.trim() }),
      });
      if (!res.ok) {
        setMessage("error");
        setSaving(false);
        return;
      }
      setMessage("success");
      router.refresh();
    } catch {
      setMessage("error");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label className="block text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          Email
        </label>
        <p className="mt-1 text-sm text-zinc-900">{email}</p>
        <p className="mt-0.5 text-xs text-zinc-500">Email se ne može menjati.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="account-first" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Ime
          </label>
          <input
            id="account-first"
            type="text"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>
        <div>
          <label htmlFor="account-last" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Prezime
          </label>
          <input
            id="account-last"
            type="text"
            value={last}
            onChange={(e) => setLast(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </div>
      {message === "success" && (
        <p className="text-sm text-green-600">Podaci su sačuvani.</p>
      )}
      {message === "error" && (
        <p className="text-sm text-red-600">Greška pri čuvanju. Pokušajte ponovo.</p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-zinc-900 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {saving ? "Čuvanje…" : "Sačuvaj"}
      </button>
    </form>
  );
}
