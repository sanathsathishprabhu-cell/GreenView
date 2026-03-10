export interface Room {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number; // per night in INR
  capacity: number;
  size: number; // sqm
  beds: string;
  category: RoomCategory;
  amenities: string[];
  images: string[];
  available: boolean;
  featured: boolean;
  view: string;
  floor?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RoomCategory = "Deluxe" | "Suite" | "Villa" | "Penthouse";

export interface Booking {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  roomCategory: RoomCategory;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  nights: number;
  pricePerNight: number;
  totalAmount: number;
  specialRequests?: string;
  status: BookingStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface User {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt?: Date;
}

export type UserRole = "user" | "admin";

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  method?: string;
  createdAt?: Date;
}

export type PaymentStatus = "created" | "paid" | "failed" | "refunded";

export interface AvailabilityResult {
  available: boolean;
  blockedDates: string[];
}

export interface BookingFormData {
  checkIn: Date;
  checkOut: Date;
  guests: number;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}
