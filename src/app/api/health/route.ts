import { NextResponse } from "next/server";
import { getEnvStatus } from "@/lib/env";

export const runtime = "nodejs";

/** Check which secrets are visible to the server (values never returned). */
export async function GET() {
  const env = getEnvStatus();
  const ready = Object.values(env).every(Boolean);
  return NextResponse.json({
    ready,
    env,
    hint: ready
      ? null
      : "Set missing variables in Vercel → Environment Variables, then Redeploy.",
  });
}
