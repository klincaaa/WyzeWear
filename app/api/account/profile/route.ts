import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { updateUser } from "@/lib/db";

export async function PATCH(request: Request) {
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
    const { firstName, lastName } = body;
    await updateUser(userId, {
      first_name: typeof firstName === "string" ? firstName : undefined,
      last_name: typeof lastName === "string" ? lastName : undefined,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Profile update error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
