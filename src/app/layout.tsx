import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "GreenView — Luxury Hotel & Resorts",
  description:
    "Experience unparalleled luxury at GreenView. Discover our curated collection of extraordinary rooms, suites and villas in the world's most breathtaking destinations.",
  keywords: "luxury hotel, resort, rooms, suites, booking, GreenView",
  openGraph: {
    title: "GreenView — Luxury Hotel & Resorts",
    description:
      "Experience unparalleled luxury at GreenView.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-cream font-sans text-charcoal antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#313131",
                color: "#F3EEE7",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.875rem",
                letterSpacing: "0.025em",
                borderRadius: "0",
                padding: "12px 20px",
              },
              success: {
                iconTheme: { primary: "#C9A96E", secondary: "#313131" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#F3EEE7" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
