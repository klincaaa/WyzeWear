import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBaseUrl } from "@/lib/url";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { AdminStats } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("sr-Latn", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/admin");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  if (!adminEmail || session.user.email.toLowerCase() !== adminEmail) {
    return (
      <div className="min-h-screen bg-white text-zinc-900">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="mx-auto max-w-2xl px-4 py-12 text-center">
            <p className="text-zinc-600">Nemate pristup admin panelu.</p>
            <Link
              href="/account"
              className="mt-4 inline-block text-sm font-medium text-zinc-900 underline"
            >
              Nazad na nalog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const base = await getBaseUrl();
  const cookieStore = await cookies();
  const res = await fetch(`${base}/api/admin/stats`, {
    cache: "no-store",
    headers: { Cookie: cookieStore.toString() },
  });
  if (!res.ok) throw new Error("Failed to load admin stats");
  const stats = (await res.json()) as AdminStats;

  const cards = [
    {
      title: "Ukupno porudžbina",
      value: stats.totalOrders,
      href: "/admin/orders",
    },
    {
      title: "Porudžbine ovog meseca",
      value: stats.ordersThisMonth,
      href: "/admin/orders",
    },
    {
      title: "Ukupan prihod",
      value: formatPrice(stats.totalRevenueCents),
    },
    { title: "Aktivni proizvodi", value: stats.productsCount },
    { title: "Registrovani korisnici", value: stats.usersCount },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Admin
            </h1>
            <Link
              href="/account"
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900"
            >
              Nazad na nalog
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5"
              >
                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  {card.title}
                </p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900">
                  {card.value}
                </p>
                {card.href && (
                  <Link
                    href={card.href}
                    className="mt-3 inline-block text-xs font-medium text-zinc-600 hover:text-zinc-900"
                  >
                    Pogledaj →
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50/30 p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Brzi linkovi
            </h2>
            <ul className="mt-3 flex flex-wrap gap-3">
              <li>
                <Link
                  href="/admin/orders"
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  Sve porudžbine
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  Proizvodi (shop)
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
