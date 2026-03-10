import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { CategoryGrid } from "../components/CategoryGrid";
import { ProductGrid } from "../components/ProductGrid";
import { BrandStatement } from "../components/BrandStatement";
import { SocialProof } from "../components/SocialProof";
import { CommunitySection } from "../components/CommunitySection";
import { Newsletter } from "../components/Newsletter";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="pt-24">
        <Hero />
        <CategoryGrid />
        <ProductGrid />
        <BrandStatement />
        <SocialProof />
        <CommunitySection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

