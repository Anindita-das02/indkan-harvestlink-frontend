import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle2, Building2, Clock, ShieldCheck } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    refId: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="site-wrapper">
      <Navbar />

      {/* Hero Header */}
      <section className="content-page-hero">
        <div className="container">
          <div className="hero-badge">
            <Mail size={14} /> International Trade Desk
          </div>
          <h1>Get in Touch With Our Team</h1>
          <p className="hero-lead">
            Have a question about our products, bulk sourcing requirements, or export enquiries? Our team is available to help you with product information and the next steps in the quotation process.
          </p>
        </div>
      </section>

      {/* Main Body */}
      <main className="content-page-body">
        <div className="container">
          <div className="content-page-card">
            <p style={{ fontSize: "15.5px", color: "#334155", lineHeight: 1.8, marginBottom: "14px" }}>
              Share your business requirements through the contact form, or use our verified business contact details to reach us. For faster assistance, please include your Enquiry Reference ID if you have already submitted a request.
            </p>
            <p style={{ fontSize: "15px", color: "#64748B", lineHeight: 1.7, marginBottom: "32px" }}>
              We aim to provide clear communication and helpful responses to business enquiries.
            </p>

            <div className="contact-grid">
              {/* Left Column: Contact Form */}
              <div>
                <h3 style={{ margin: "0 0 16px", color: "var(--forest-green)", fontSize: "18px", fontWeight: 700 }}>
                  Send a Message to Our Export Desk
                </h3>

                {submitted ? (
                  <div style={{ padding: "28px", background: "#DCFCE7", border: "1px solid #86EFAC", borderRadius: "10px", textAlign: "center" }}>
                    <CheckCircle2 size={40} color="#15803D" style={{ margin: "0 auto 12px" }} />
                    <h4 style={{ margin: "0 0 6px", color: "#166534", fontSize: "18px" }}>Message Dispatched Successfully</h4>
                    <p style={{ margin: 0, color: "#15803D", fontSize: "14px" }}>
                      Thank you for contacting INDKAN HarvestLink. Our export trade manager will review your note and respond within 24 business hours.
                    </p>
                    <button
                      type="button"
                      className="btn btn-gold"
                      onClick={() => setSubmitted(false)}
                      style={{ marginTop: "18px", padding: "8px 18px", fontSize: "13px" }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Marcus Vance"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          style={{ width: "100%", padding: "10px 12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "14px" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                          Corporate Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          style={{ width: "100%", padding: "10px 12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "14px" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 555 123 4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          style={{ width: "100%", padding: "10px 12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "14px" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                          Company / Entity
                        </label>
                        <input
                          type="text"
                          placeholder="Trading LLC / Corp"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          style={{ width: "100%", padding: "10px 12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "14px" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                        Enquiry Reference ID (Optional - If already submitted)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ENQ-2026-0009"
                        value={formData.refId}
                        onChange={(e) => setFormData({ ...formData, refId: e.target.value })}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "14px" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                        Your Message / Trade Requirement *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe your inquiry, commodity specifications, port destination, or questions..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "14px", resize: "vertical" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-gold"
                      disabled={isSubmitting}
                      style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 700 }}
                    >
                      {isSubmitting ? "Dispatching Message..." : (
                        <>
                          <Send size={16} /> Submit Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Verified Trade Credentials & Contact Info */}
              <div>
                <h3 style={{ margin: "0 0 16px", color: "var(--forest-green)", fontSize: "18px", fontWeight: 700 }}>
                  Verified Business Information
                </h3>

                <div className="contact-info-card">
                  <div className="contact-info-row">
                    <div className="contact-icon-bubble">
                      <Mail size={18} />
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: "12px", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Official Email</span>
                      <a href="mailto:info@indkan.com" style={{ fontSize: "14.5px", color: "var(--forest-green)", fontWeight: 700 }}>
                        info@indkan.com
                      </a>
                    </div>
                  </div>

                  <div className="contact-info-row">
                    <div className="contact-icon-bubble">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: "12px", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Export Desk Hotline</span>
                      <span style={{ fontSize: "14.5px", color: "#1E293B", fontWeight: 600 }}>
                        +91 98765 43210 (Mon – Fri, 9 AM – 6 PM IST)
                      </span>
                    </div>
                  </div>

                  <div className="contact-info-row">
                    <div className="contact-icon-bubble">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: "12px", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Primary Dispatch Ports</span>
                      <span style={{ fontSize: "14px", color: "#1E293B" }}>
                        JNPT Mumbai • Mundra Port • Chennai Port
                      </span>
                    </div>
                  </div>

                  <div className="contact-info-row">
                    <div className="contact-icon-bubble">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: "12px", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Registered Office</span>
                      <span style={{ fontSize: "13.5px", color: "#1E293B", lineHeight: 1.5 }}>
                        INDKAN HarvestLink Pvt. Ltd.<br />
                        Export Logistics Hub, Sector 11, Navi Mumbai, Maharashtra 400614, India
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "18px", padding: "16px", background: "rgba(34, 197, 94, 0.08)", border: "1px solid #86EFAC", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <ShieldCheck size={20} color="#15803D" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "12.5px", color: "#166534", fontWeight: 600 }}>
                    APEDA Registered & Certified Commercial Export Entity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
