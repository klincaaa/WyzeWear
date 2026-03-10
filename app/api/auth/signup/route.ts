import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }
    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }
    const existing = await getUserByEmail(trimmedEmail);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await createUser({
      email: trimmedEmail,
      passwordHash,
      firstName: typeof firstName === "string" ? firstName : undefined,
      lastName: typeof lastName === "string" ? lastName : undefined,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
