"use client";

import { useEffect, useState, type SVGProps } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";

type IconProps = SVGProps<SVGSVGElement>;

const Search = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      d="M11 5a6 6 0 1 1-4.243 10.243L4 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const User = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle
      cx="12"
      cy="9"
      r="3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M6 19c1.5-2 3.3-3 6-3s4.5 1 6 3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ShoppingBag = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      d="M7 9V7a5 5 0 0 1 10 0v2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M6 9h12l-1 9H7L6 9Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Menu = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      d="M4 7h16M4 12h16M4 17h16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const X = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      d="M5 5l14 14M19 5 5 19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const navLinks: { label: string; href: string }[] = [
  { label: "Home", href: "/"},
  { label: "Shop", href: "/products" },
  { label: "Hoodies", href: "/products?category=hoodies" },
  { label: "Bottoms", href: "/products?category=bottoms" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const { totalQuantity } = useCart();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
        animate={{
          paddingTop: scrolled ? 12 : 20,
          paddingBottom: scrolled ? 12 : 20,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <motion.nav
          className={`flex items-center justify-between rounded-full border border-zinc-900/10 bg-black/0 px-4 text-xs font-medium uppercase tracking-[0.16em] text-zinc-900 backdrop-blur-sm transition-colors duration-300 ${
            scrolled
              ? "bg-white/95 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
              : "bg-white/40"
          }`}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 py-3 text-[11px] font-semibold tracking-[0.22em]"
            aria-label="Wyze Wear logo"
          >
            <span className="h-5 w-5 rounded-full border border-zinc-900/40" />
            <span>Wyze Wear</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative py-4 text-[11px] tracking-[0.22em] text-zinc-700 transition-colors hover:text-black"
              >
                {item.label.toUpperCase()}
                <span className="absolute inset-x-0 -bottom-1 h-px origin-center scale-x-0 bg-zinc-900 transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <button aria-label="Search" className="hover:text-black">
              <Search className="h-4 w-4" />
            </button>
            {status !== "loading" && (
              session ? (
                <>
                  <Link
                    href="/account"
                    aria-label="My account"
                    className="hover:text-black"
                  >
                    <User className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-[10px] font-medium uppercase tracking-wider text-zinc-600 hover:text-black"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-[10px] font-medium uppercase tracking-wider text-zinc-600 hover:text-black"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="text-[10px] font-medium uppercase tracking-wider text-zinc-600 hover:text-black"
                  >
                    Sign up
                  </Link>
                </>
              )
            )}
            <button
              aria-label="Cart"
              className="relative hover:text-black"
              onClick={() => router.push("/cart")}
            >
              <ShoppingBag className="h-4 w-4" />
              {totalQuantity > 0 && (
                <span className="absolute -right-2 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-zinc-900 px-1 text-[10px] font-semibold text-white">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>

          <button
            className="flex items-center gap-2 py-3 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </motion.nav>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mt-3 border-t border-zinc-900/5 bg-white/95 backdrop-blur-sm md:hidden"
          >
            <div className="mx-auto max-w-6xl px-4 pb-6 pt-3">
              <div className="flex flex-col gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-700">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between py-2 text-left"
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.label}</span>
                    <span className="h-px w-8 bg-zinc-900/30" />
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-zinc-600">
                <span>Search</span>
                {status !== "loading" && (
                  session ? (
                    <>
                      <Link
                        href="/account"
                        onClick={() => setOpen(false)}
                      >
                        My account
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setOpen(false)}
                      >
                        Sign up
                      </Link>
                    </>
                  )
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push("/cart");
                  }}
                >
                  Cart ({totalQuantity})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

