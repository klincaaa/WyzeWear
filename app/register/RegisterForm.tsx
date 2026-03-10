"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Došlo je do greške. Pokušajte ponovo.");
        setLoading(false);
        return;
      }
      router.push("/login?registered=1");
      router.refresh();
    } catch {
      setError("Došlo je do greške. Pokušajte ponovo.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Ime
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            placeholder="Ime"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Prezime
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            placeholder="Prezime"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="vas@email.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          Lozinka (min. 8 karaktera)
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-zinc-900 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? "Registracija…" : "Registruj se"}
      </button>
    </form>
  );
}
