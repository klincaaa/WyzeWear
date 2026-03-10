import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { authOptions } from "@/lib/auth";
import { getBaseUrl } from "@/lib/url";
import { AccountProfile } from "./AccountProfile";
import { AccountAddresses } from "./AccountAddresses";
import { AccountOrders } from "./AccountOrders";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account");
  }
  const userId = Number(session.user.id);
  if (Number.isNaN(userId)) {
    redirect("/login?callbackUrl=/account");
  }

  const base = await getBaseUrl();
  const cookieStore = await cookies();
  const res = await fetch(`${base}/api/account`, {
    cache: "no-store",
    headers: { Cookie: cookieStore.toString() },
  });
  if (res.status === 401) redirect("/login?callbackUrl=/account");
  if (!res.ok) throw new Error("Failed to load account");
  const { user, addresses, orders } = await res.json();
  if (!user) redirect("/login?callbackUrl=/account");

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Moj nalog
            </h1>
            <Link
              href="/products"
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900"
            >
              Nastavi kupovinu
            </Link>
          </div>

          <section className="border-b border-zinc-200 pb-10">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              Lični podaci
            </h2>
            <AccountProfile
              userId={userId}
              email={user.email}
              firstName={user.first_name ?? ""}
              lastName={user.last_name ?? ""}
            />
          </section>

          <section className="border-b border-zinc-200 py-10">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              Adrese
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Dodajte adrese za brže završavanje kupovine. Jedna može biti podrazumevana.
            </p>
            <AccountAddresses addresses={addresses} />
          </section>

          <section className="pt-10">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              Istorija porudžbina
            </h2>
            <AccountOrders orders={orders} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
