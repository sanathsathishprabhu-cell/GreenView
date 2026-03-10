"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Payment } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { TrendingUp, CreditCard, CheckCircle2, XCircle } from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const q = query(collection(db, "payments"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment)));
      } finally { setLoading(false); }
    };
    fetchPayments();
  }, []);

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPaid = payments.filter((p) => p.status === "paid").length;
  const totalFailed = payments.filter((p) => p.status === "failed").length;

  return (
    <div className="pt-16 lg:pt-0 p-6 lg:p-10 min-h-screen">
      <div className="mb-8 pt-4">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal-light/50 mb-1">Finance</p>
        <h1 className="font-serif text-3xl text-charcoal-dark">Payments</h1>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), Icon: TrendingUp, color: "text-gold" },
          { label: "Paid Transactions", value: totalPaid, Icon: CheckCircle2, color: "text-green-500" },
          { label: "Failed Payments", value: totalFailed, Icon: XCircle, color: "text-red-500" },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="border border-charcoal-light/10 bg-cream p-6">
            <div className={`${color} mb-3`}><Icon className="w-5 h-5" /></div>
            {loading ? <div className="skeleton h-8 w-1/2 mb-2" /> : <p className="font-serif text-2xl text-charcoal-dark mb-1">{value}</p>}
            <p className="font-sans text-xs tracking-wider text-charcoal-light/50 uppercase">{label}</p>
          </div>
        ))}
      </div>

      {/* Payments table */}
      <div className="border border-charcoal-light/10 overflow-auto">
        {loading ? (
          <div className="p-8 space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-12" />)}</div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center"><p className="font-sans text-sm text-charcoal-light/50">No payments yet</p></div>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead className="bg-charcoal-light/5 border-b border-charcoal-light/10">
              <tr>
                {["Razorpay ID", "Booking ID", "Amount", "Currency", "Status", "Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-light/5">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-charcoal-light/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-charcoal-light/70">
                    {p.razorpayPaymentId ? p.razorpayPaymentId.slice(0, 18) + "…" : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-charcoal-light/70">
                    {p.bookingId.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-charcoal">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3 font-sans text-xs text-charcoal-light/70">{p.currency}</td>
                  <td className="px-4 py-3">
                    {p.status === "paid"
                      ? <span className="badge-confirmed">{p.status}</span>
                      : p.status === "failed"
                      ? <span className="badge-cancelled">{p.status}</span>
                      : <span className="badge-pending">{p.status}</span>
                    }
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-charcoal-light/50">
                    {p.createdAt ? format(p.createdAt instanceof Date ? p.createdAt : (p.createdAt as { toDate(): Date }).toDate(), "dd MMM yyyy") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
