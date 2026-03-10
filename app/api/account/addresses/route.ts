import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createAddress } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { full_name, street, city, postal_code, country, phone, is_default } = body;
    if (
      !full_name ||
      !street ||
      !city ||
      !postal_code ||
      !country ||
      typeof full_name !== "string" ||
      typeof street !== "string" ||
      typeof city !== "string" ||
      typeof postal_code !== "string" ||
      typeof country !== "string"
    ) {
      return NextResponse.json(
        { error: "full_name, street, city, postal_code and country are required." },
        { status: 400 },
      );
    }
    const id = await createAddress(userId, {
      full_name: full_name.trim(),
      street: street.trim(),
      city: city.trim(),
      postal_code: String(postal_code).trim(),
      country: country.trim(),
      phone: typeof phone === "string" ? phone.trim() : undefined,
      is_default: Boolean(is_default),
    });
    return NextResponse.json({ success: true, id });
  } catch (e) {
    console.error("Address create error:", e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
