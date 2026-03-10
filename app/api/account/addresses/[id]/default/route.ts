import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { setDefaultAddress } from "@/lib/db-queries";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);
  const addressId = Number((await params).id);
  if (Number.isNaN(userId) || Number.isNaN(addressId)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  try {
    await setDefaultAddress(userId, addressId);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Set default address error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
