import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { CategoryGrid } from "../components/CategoryGrid";
import { ProductGrid } from "../components/ProductGrid";
import { BrandStatement } from "../components/BrandStatement";
import { SocialProof } from "../components/SocialProof";
import { CommunitySection } from "../components/CommunitySection";
import { Newsletter } from "../components/Newsletter";
import { Footer } from "../components/Footer";
import { getAllProducts } from "../lib/db";

export const dynamic = "force-dynamic";

function formatPrice(priceCents: number, currency: string = "EUR") {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(priceCents / 100);
}

export default async function Home() {
  const dbProducts = await getAllProducts();

  const products = dbProducts.slice(0, 8).map((p) => ({
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    price: formatPrice(p.price_cents),
    category: p.category ?? "",
    image: p.image_url,
    hoverImage: p.hover_image_url || p.image_url,
  }));

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="pt-24">
        <Hero />
        <CategoryGrid />
        <ProductGrid products={products} />
        <BrandStatement />
        <SocialProof />
        <CommunitySection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}


