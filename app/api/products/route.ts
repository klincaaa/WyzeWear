import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/lib/db-queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const products = await getAllProducts(category);
    return NextResponse.json(products);
  } catch (e) {
    console.error("GET /api/products error:", e);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 },
    );
  }
}
