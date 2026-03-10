import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Payment verification is not yet enabled. Coming soon!" },
    { status: 503 }
  );
}
