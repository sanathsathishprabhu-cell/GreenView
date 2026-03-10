"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Twitter,
  Facebook,
  Send,
  CheckCircle2,
} from "lucide-react";

const enquiryTypes = [
  "Room Reservation",
  "Special Occasion",
  "Corporate / Group Booking",
  "Spa & Wellness",
  "Dining Enquiry",
  "Press & Media",
  "Careers",
  "General Enquiry",
];

const contactDetails = [
  {
    Icon: Phone,
    label: "Reservations",
    value: "+91 12345 67890",
    href: "tel:+911234567890",
  },
  {
    Icon: Mail,
    label: "Email",
    value: "reservations@greenview.com",
    href: "mailto:reservations@greenview.com",
  },
  {
    Icon: MapPin,
    label: "Address",
    value: "1 Greenview Drive, Mussoorie,\nUttarakhand 248179, India",
    href: "https://maps.google.com",
  },
  {
    Icon: Clock,
    label: "Response Time",
    value: "Within 4 hours\n(9 AM – 9 PM IST, all days)",
    href: null,
  },
];

export default function ContactContent() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    enquiryType: "",
    checkIn: "",
    checkOut: "",
    guests: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    // Simulate API call — wire to your own email service or Firebase function
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
    toast.success("Message sent. We will be in touch shortly.");
  };

  return (
    <>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[380px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=85"
          alt="Contact GreenView"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/85 via-charcoal-dark/25 to-transparent" />
        <div className="relative z-10 section-padding pb-16">
          <p className="eyebrow text-gold/80 mb-3">We Are Here</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white">
            Get in Touch
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding py-20 lg:py-28 bg-cream">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-16">

          {/* Left — Contact Info */}
          <div className="lg:col-span-2">
            <p className="eyebrow mb-4">Reach Us</p>
            <h2 className="heading-md mb-6">
              A Conversation Begins Here
            </h2>
            <div className="w-12 h-px bg-gold mb-8" />
            <p className="body-base leading-loose mb-10">
              Whether you are planning your first visit or returning like an old
              friend, our team is ready to help. Tell us what you have in mind
              and we will make it happen.
            </p>

            {/* Contact detail cards */}
            <div className="space-y-6">
              {contactDetails.map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light/50 mb-1">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="font-sans text-sm text-charcoal hover:text-gold transition-colors whitespace-pre-line"
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-sans text-sm text-charcoal whitespace-pre-line">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="mt-10 pt-10 border-t border-charcoal-light/10">
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal-light/40 mb-4">
                Follow Us
              </p>
              <div className="flex gap-4">
                {[
                  { Icon: Instagram, href: "#", label: "Instagram" },
                  { Icon: Twitter, href: "#", label: "Twitter" },
                  { Icon: Facebook, href: "#", label: "Facebook" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 border border-charcoal-light/15 flex items-center justify-center text-charcoal-light/40 hover:border-gold hover:text-gold transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick-reserve CTA */}
            <div className="mt-10 bg-charcoal-dark p-6">
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-gold mb-2">
                Ready to Book?
              </p>
              <p className="font-serif text-lg text-cream mb-4">
                Reserve directly through our website for the best available rate.
              </p>
              <Link href="/rooms" className="btn-gold text-xs">
                View Rooms
              </Link>
            </div>
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center py-16 border border-charcoal-light/10">
                <div className="w-16 h-16 border border-gold flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-gold" />
                </div>
                <p className="eyebrow mb-3">Message Received</p>
                <h2 className="heading-md mb-4">Thank You</h2>
                <p className="body-base max-w-sm mb-8">
                  A member of our team will respond to your enquiry within 4
                  hours. We look forward to welcoming you.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: "", email: "", phone: "", enquiryType: "",
                      checkIn: "", checkOut: "", guests: "", message: "",
                    });
                  }}
                  className="btn-primary text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h2 className="heading-md mb-2">Send Us a Message</h2>
                  <p className="body-base text-sm">
                    Share your vision and we will do the rest.
                  </p>
                </div>

                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      id="contact-name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      id="contact-email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Phone + Enquiry Type */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      id="contact-phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Enquiry Type</label>
                    <select
                      name="enquiryType"
                      id="contact-enquiry-type"
                      value={form.enquiryType}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="">Select a topic…</option>
                      {enquiryTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stay Dates (conditional) */}
                {(form.enquiryType === "Room Reservation" ||
                  form.enquiryType === "Special Occasion" ||
                  form.enquiryType === "Corporate / Group Booking" ||
                  form.enquiryType === "") && (
                  <div className="grid sm:grid-cols-3 gap-6 p-6 border border-charcoal-light/10 bg-cream-100">
                    <div>
                      <label className="form-label">Check-In Date</label>
                      <input
                        type="date"
                        name="checkIn"
                        id="contact-checkin"
                        value={form.checkIn}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Check-Out Date</label>
                      <input
                        type="date"
                        name="checkOut"
                        id="contact-checkout"
                        value={form.checkOut}
                        min={form.checkIn}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Guests</label>
                      <select
                        name="guests"
                        id="contact-guests"
                        value={form.guests}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="">Select…</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "Guest" : "Guests"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    id="contact-message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your ideal stay, any special requirements, questions, or just say hello…"
                    className="form-input resize-none"
                  />
                </div>

                {/* Privacy note */}
                <p className="font-sans text-xs text-charcoal-light/40 leading-loose">
                  Your personal information is used solely to respond to your
                  enquiry and to personalise your experience at GreenView. We
                  never share or sell your data. See our{" "}
                  <Link href="/" className="text-gold hover:underline">
                    privacy policy
                  </Link>
                  .
                </p>

                <button
                  type="submit"
                  id="contact-submit-btn"
                  disabled={loading}
                  className="btn-solid gap-3 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map section */}
      <section className="bg-cream-100">
        <div className="grid lg:grid-cols-2">
          {/* Map embed placeholder — replace src with real Google Maps embed */}
          <div className="relative h-[400px] lg:h-auto bg-charcoal-light/5 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55284.07993374489!2d78.00628967910158!3d30.45865350000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929c356e68a6b%3A0x3a68d2a0428e41cf!2sMussoorie%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(80%) contrast(1.1)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GreenView location map"
            />
          </div>

          {/* Directions */}
          <div className="section-padding py-16 flex items-center">
            <div className="max-w-md">
              <p className="eyebrow mb-4">Find Us</p>
              <h2 className="heading-md mb-6">Getting to GreenView</h2>
              <div className="w-12 h-px bg-gold mb-8" />

              <div className="space-y-6">
                {[
                  {
                    mode: "✈ By Air",
                    detail:
                      "The nearest airport is Jolly Grant (Dehradun), approximately 65 km and 2 hours by road. We arrange private transfers on request.",
                  },
                  {
                    mode: "🚂 By Rail",
                    detail:
                      "Dehradun Railway Station is the closest railhead — about 30 km from Mussoorie. Our team will collect you in a private vehicle.",
                  },
                  {
                    mode: "🚗 By Road",
                    detail:
                      "GreenView is accessible by private vehicle. We send detailed GPS coordinates and a driver on the day of arrival. The last 3 km is an unpaved, forest track.",
                  },
                  {
                    mode: "🚁 By Helicopter",
                    detail:
                      "Charter helicopter transfers from Delhi or Dehradun can be arranged for Penthouse guests and villa exclusive bookings upon request.",
                  },
                ].map((item) => (
                  <div key={item.mode}>
                    <p className="font-sans text-xs font-medium tracking-wider text-charcoal mb-1">
                      {item.mode}
                    </p>
                    <p className="font-sans text-sm text-charcoal-light/70 leading-loose">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-8 inline-flex gap-2 text-xs"
              >
                <MapPin className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
