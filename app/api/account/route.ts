import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getUserById,
  getAddressesByUserId,
  getOrdersByUserId,
} from "@/lib/db-queries";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [user, addresses, orders] = await Promise.all([
      getUserById(userId),
      getAddressesByUserId(userId),
      getOrdersByUserId(userId),
    ]);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user, addresses, orders });
  } catch (e) {
    console.error("GET /api/account error:", e);
    return NextResponse.json(
      { error: "Failed to load account" },
      { status: 500 },
    );
  }
}
