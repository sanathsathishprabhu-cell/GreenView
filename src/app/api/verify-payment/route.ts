import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const {
      bookingId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = await req.json();

    if (!bookingId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    // HMAC-SHA256 verification
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const bookingRef = adminDb.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bookingSnap.data()!;

    // Update booking to confirmed
    await bookingRef.update({
      status: "confirmed",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Create payment record
    const paymentId = uuidv4();
    await adminDb.collection("payments").doc(paymentId).set({
      id: paymentId,
      bookingId,
      userId: booking.userId,
      amount: booking.totalAmount,
      currency: "INR",
      status: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, bookingId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    console.error("[verify-payment]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
