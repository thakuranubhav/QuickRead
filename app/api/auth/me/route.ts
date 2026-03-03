import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export const runtime = "nodejs";

export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const payload = await verifyAuthToken(token);
    await connectToDatabase();
    const user = (await User.findById(payload.sub).lean()) as
      | {
          role?: "user" | "admin";
          name?: string;
          email?: string;
        }
      | null;
    return NextResponse.json({
      authenticated: true,
      role: user?.role ?? "user",
      name: user?.name ?? payload.name,
      email: user?.email ?? payload.email,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
