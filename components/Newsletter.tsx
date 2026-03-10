"use client";

import { motion } from "framer-motion";

export function Newsletter() {
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
          Early access to drops, studio previews and members-only releases. No noise,
          just what matters.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.24 }}
          className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex-1">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Email address"
              className="w-full rounded-full border border-zinc-700 bg-zinc-900/60 px-5 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-400 focus:bg-zinc-900"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-black transition-transform duration-150 hover:-translate-y-0.5 hover:bg-zinc-100"
          >
            Subscribe
          </button>
        </motion.form>

        <p className="mt-3 text-[11px] text-zinc-500">
          No spam. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}

