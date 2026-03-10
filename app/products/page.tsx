import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { ProductCard } from "../../components/ProductCard";
import { getAllProducts } from "../../lib/db";

export const dynamic = "force-dynamic";

function formatPrice(priceCents: number, currency: string = "EUR") {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(priceCents / 100);
}

type SearchParams = { category?: string };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category } = await searchParams;
  const products = await getAllProducts(category ?? undefined);
  const categoryLabel =
    category === "hoodies"
      ? "Hoodies"
      : category === "bottoms"
        ? "Bottoms"
        : null;
  const title = categoryLabel ?? "All products";
  const subtitle = categoryLabel
    ? `${categoryLabel} from the collection.`
    : "Explore the full collection powered by your MySQL database.";

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="pt-24">
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                  {categoryLabel ? `Drop · ${categoryLabel}` : "Drop · All"}
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                  {title}
                </h1>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-zinc-600">
                {subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: String(product.id),
                    slug: product.slug,
                    name: product.name,
                    price: formatPrice(product.price_cents),
                    category: product.category ?? "",
                    image: product.image_url,
                    hoverImage: product.hover_image_url || product.image_url,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

