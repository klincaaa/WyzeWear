"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || status === "submitting") return;

    setStatus("submitting");
    setMessage(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        success?: boolean;
      };

      if (!res.ok || !data.success) {
        setStatus("error");
        setMessage(
          data.error ??
            "We couldn’t save your subscription. Please try again in a moment.",
        );
        return;
      }

      setStatus("success");
      setMessage(
        "You’re in. Check your inbox for upcoming drops and updates.",
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(
        "Something went wrong while subscribing. Please try again in a moment.",
      );
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <section className="bg-black py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-[11px] font-medium uppercase tracking-[0.32em] text-zinc-400"
        >
          Stay ahead of the drop
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
        >
          Join the Community
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base"
        >
          Early access to drops, studio previews and members-only releases. No
          noise, just what matters.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.24 }}
          className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex-1">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-zinc-700 bg-zinc-900/60 px-5 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-400 focus:bg-zinc-900"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-black transition-transform duration-150 hover:-translate-y-0.5 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </motion.form>

        <p className="mt-3 text-[11px] text-zinc-500">
          No spam. Unsubscribe at any time.
        </p>

        {message && (
          <p
            className={`mt-3 text-xs ${
              status === "success" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

