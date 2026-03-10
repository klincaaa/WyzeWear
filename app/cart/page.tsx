import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartClient } from "./CartClient";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Cart
            </h1>
            <Link
              href="/products"
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900"
            >
              Continue shopping
            </Link>
          </div>
          <CartClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}

