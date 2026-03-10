import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Booking payments are not yet enabled. Coming soon!" },
    { status: 503 }
  );
}
