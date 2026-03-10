import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { authOptions } from "@/lib/auth";
import { getBaseUrl } from "@/lib/url";
import { CheckoutClient } from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout");
  }
  const userId = Number(session.user.id);
  if (Number.isNaN(userId)) {
    redirect("/login?callbackUrl=/checkout");
  }

  const base = await getBaseUrl();
  const cookieStore = await cookies();
  const res = await fetch(`${base}/api/account`, {
    cache: "no-store",
    headers: { Cookie: cookieStore.toString() },
  });
  if (res.status === 401) redirect("/login?callbackUrl=/checkout");
  if (!res.ok) throw new Error("Failed to load account");
  const { addresses } = await res.json();
  const defaultAddress = addresses?.[0];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-2xl font-semibold tracking-tight text-zinc-900">
            Checkout
          </h1>

          {!defaultAddress ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-6 text-sm text-amber-900">
              <p>
                Nema sačuvanih adresa. Da biste nastavili, dodajte bar jednu adresu
                u stranici{" "}
                <Link
                  href="/account"
                  className="font-medium underline underline-offset-2"
                >
                  Moj nalog
                </Link>
                .
              </p>
            </div>
          ) : (
            <CheckoutClient address={defaultAddress} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

