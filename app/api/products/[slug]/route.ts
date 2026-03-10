import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/db-queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (e) {
    console.error("GET /api/products/[slug] error:", e);
    return NextResponse.json(
      { error: "Failed to load product" },
      { status: 500 },
    );
  }
}
