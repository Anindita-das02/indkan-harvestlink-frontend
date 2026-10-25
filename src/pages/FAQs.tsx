import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { HelpCircle, ChevronDown, ChevronUp, ArrowRight, MessageSquare } from "lucide-react";

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is the minimum order quantity?",
      a: "Minimum Order Quantities (MOQ) vary by commodity. For most pulses and grains, our standard MOQ is typically 100 kg to 1 Metric Ton (FCL/LCL). For specialty spices, MOQs may be smaller. Specific MOQs for each product are listed on their respective catalogue specification pages or confirmed during quotation review."
    },
    {
      q: "How can I check product availability?",
      a: "Current stock availability indicators (In Stock, Low Stock, or On Request) are displayed directly on our Products catalogue. Since agricultural harvests fluctuate with seasonal cycles, formal availability and reservation timelines are confirmed directly by our export desk upon receiving your quotation request."
    },
    {
      q: "Can I request quotations for multiple products?",
      a: "Yes. You can select multiple commodities and specify different quantities and packaging requirements within a single B2B enquiry form. Our trade desk will prepare a consolidated quotation breakdown tailored to your combined shipment."
    },
    {
      q: "Which packaging options are available?",
      a: "We offer diverse export-grade packaging configurations, including 25 kg PP bags, 50 kg jute/gunny sacks, vacuum-sealed bags for spices, and bulk container liner solutions. Custom branding and labeling compliant with your destination port regulations are available upon request."
    },
    {
      q: "How can I track my enquiry?",
      a: "Upon submitting an enquiry, you receive a unique Enquiry Reference ID (e.g. ENQ-2026-0009) and a 6-digit Secret PIN. Simply visit our 'Track Your Enquiry' page, enter both credentials, and view your live order stage (Submitted, Under Review, Quotation Sent, Accepted, Order Confirmed, Processing, Packed, Shipped, Delivered)."
    },
    {
      q: "How are shipping terms and delivery timelines confirmed?",
      a: "We operate under standard international Incoterms, primarily FOB (Free On Board) and CIF (Cost, Insurance & Freight) from major Indian ports like JNPT Mumbai, Mundra, and Chennai. Exact shipping schedules, vessel transit times, and delivery documentation (Bill of Lading, Certificate of Origin, Phytosanitary Certificate) are confirmed in the formal commercial agreement."
    }
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="site-wrapper">
      <Navbar />

      {/* Hero Header */}
      <section className="content-page-hero">
        <div className="container">
          <div className="hero-badge">
            <HelpCircle size={14} /> Knowledge Base & Trade Guide
          </div>
          <h1>Frequently Asked Questions</h1>
          <p className="hero-lead">
            Find answers to common questions about our products, minimum order quantities, packaging options, availability, quotation requests, and export procedures.
          </p>
        </div>
      </section>

      {/* Main Body */}
      <main className="content-page-body">
        <div className="container">
          <div className="content-page-card">
            <p style={{ fontSize: "15.5px", color: "#334155", lineHeight: 1.8, marginBottom: "20px" }}>
              Our FAQ section is designed to help buyers understand how to browse products, submit enquiries, track their requests, and communicate their sourcing requirements. If you cannot find the information you need, please contact our team for further assistance.
            </p>

            <div className="faq-accordion">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className={`faq-item ${isOpen ? "open" : ""}`}>
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggleFAQ(idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={18} color="#C9A451" /> : <ChevronDown size={18} color="#64748B" />}
                    </button>
                    {isOpen && (
                      <div className="faq-answer">
                        <p style={{ margin: 0 }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: "36px", padding: "24px", background: "#FAF9F5", borderRadius: "10px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h4 style={{ margin: "0 0 4px", fontSize: "16px", color: "var(--forest-green)" }}>Have a specific commercial question?</h4>
                <p style={{ margin: 0, fontSize: "13.5px", color: "#64748B" }}>Reach out directly to our export managers for customized inquiries.</p>
              </div>
              <Link to="/contact-us" className="btn btn-gold" style={{ padding: "8px 20px", fontSize: "13.5px" }}>
                Contact Support Desk <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
