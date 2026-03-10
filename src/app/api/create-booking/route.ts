import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const body = await req.json();
    const {
      roomId, roomName, roomImage, roomCategory,
      userId, userEmail, userName, userPhone,
      checkIn, checkOut, guests, nights,
      pricePerNight, totalAmount, specialRequests,
    } = body;

    // Validate required fields
    if (!roomId || !userId || !checkIn || !checkOut || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check room availability
    const bookingsSnap = await adminDb
      .collection("bookings")
      .where("roomId", "==", roomId)
      .where("status", "in", ["confirmed", "pending"])
      .get();

    const ci = new Date(checkIn);
    const co = new Date(checkOut);

    const hasConflict = bookingsSnap.docs.some((d) => {
      const bci = d.data().checkIn?.toDate?.() || new Date(d.data().checkIn);
      const bco = d.data().checkOut?.toDate?.() || new Date(d.data().checkOut);
      return ci < bco && co > bci;
    });

    if (hasConflict) {
      return NextResponse.json({ error: "Room not available for selected dates" }, { status: 409 });
    }

    const bookingId = uuidv4();
    const receipt = `GV-${Date.now()}`;
    const amountInPaise = Math.round(totalAmount * 100);

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        bookingId,
        roomId,
        userId,
      },
    });

    // Create booking doc in Firestore (status: pending)
    await adminDb.collection("bookings").doc(bookingId).set({
      id: bookingId,
      roomId, roomName, roomImage, roomCategory,
      userId, userEmail, userName, userPhone,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests, nights, pricePerNight, totalAmount,
      specialRequests: specialRequests || "",
      status: "pending",
      razorpayOrderId: order.id,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      bookingId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[create-booking]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
