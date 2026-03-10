import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { getBaseUrl } from "../../../lib/url";
import type { DbProductDetail } from "../../../lib/db";
import { ProductDetailClient } from "./ProductDetailClient";

export const dynamic = "force-dynamic";

function formatPrice(priceCents: number, currency: string = "EUR") {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(priceCents / 100);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = await getBaseUrl();
  const cookieStore = await cookies();
  const res = await fetch(`${base}/api/products/${slug}`, {
    cache: "no-store",
    headers: { Cookie: cookieStore.toString() },
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Failed to load product");
  const product = (await res.json()) as DbProductDetail;
  if (!product) notFound();

  const mainImage = product.images[0]?.image_url ?? "";
  const priceFormatted = formatPrice(product.price_cents, product.currency);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            <Link href="/products" className="hover:text-zinc-900">
              Shop
            </Link>
            {product.category_slug && (
              <>
                <span className="mx-2">/</span>
                <Link
                  href={`/products?category=${product.category_slug}`}
                  className="hover:text-zinc-900"
                >
                  {product.category}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-zinc-900">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="space-y-3">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-100">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-400">
                    No image
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100"
                    >
                      <Image
                        src={img.image_url}
                        alt={img.alt_text ?? `${product.name} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                {product.category ?? "Product"}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                {product.name}
              </h1>
              <p className="mt-4 text-xl font-medium text-zinc-900">
                {priceFormatted}
              </p>

              {product.description && (
                <div className="mt-6 border-t border-zinc-200 pt-6">
                  <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                    Description
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {product.description}
                  </p>
                </div>
              )}

              {product.stock !== undefined && (
                <p className="mt-4 text-xs text-zinc-500">
                  {product.stock > 0
                    ? `In stock (${product.stock})`
                    : "Out of stock"}
                </p>
              )}

              <ProductDetailClient
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: mainImage,
                  priceCents: product.price_cents,
                  currency: product.currency,
                  stock: product.stock,
                }}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
