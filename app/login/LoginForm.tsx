"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Pogrešan email ili lozinka.");
        setLoading(false);
        return;
      }
      router.push(callbackUrl);
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
          Lozinka
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-zinc-900 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? "Prijava…" : "Prijavi se"}
      </button>
    </form>
  );
}
