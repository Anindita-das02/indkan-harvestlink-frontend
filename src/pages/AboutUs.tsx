import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Globe, Award, Sparkles } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="site-wrapper">
      <Navbar />

      {/* Hero Header */}
      <section className="content-page-hero">
        <div className="container">
          <div className="hero-badge">
            <Sparkles size={14} /> Corporate Profile & Trade Desk
          </div>
          <h1>About INDKAN HarvestLink</h1>
          <p className="hero-lead">
            Connecting international buyers with certified Indian agricultural commodities through transparency, streamlined sourcing, and reliable global trade execution.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="content-page-body">
        <div className="container">
          <div className="content-page-card content-prose">
            <p>
              INDKAN HarvestLink is a business-focused platform designed to connect international buyers with agricultural products sourced from India. We aim to simplify product discovery, bulk purchase enquiries, and communication between buyers and our export team.
            </p>

            <p>
              Our focus is on providing clear product information, transparent communication, and a reliable enquiry process for businesses seeking agricultural products for international trade.
            </p>

            <p>
              Through HarvestLink, buyers can explore our product range, review available specifications, and submit quotation requests based on their business requirements.
            </p>

            <div style={{ margin: "40px 0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
              <div style={{ padding: "24px", background: "#FAF9F5", border: "1px solid #E2E8F0", borderRadius: "10px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(201, 164, 81, 0.15)", color: "#8F7226", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  <Globe size={20} />
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: "17px", color: "var(--forest-green)" }}>Direct Origin Sourcing</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748B", lineHeight: 1.6 }}>
                  Direct aggregation from accredited farming hubs across India, ensuring traceability, harvest freshness, and consistent bulk supplies.
                </p>
              </div>

              <div style={{ padding: "24px", background: "#FAF9F5", border: "1px solid #E2E8F0", borderRadius: "10px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(34, 197, 94, 0.15)", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  <ShieldCheck size={20} />
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: "17px", color: "var(--forest-green)" }}>Compliance & Certification</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748B", lineHeight: 1.6 }}>
                  Fully compliant with APEDA standards, phytosanitary requirements, batch lab testing, and standard export documentation.
                </p>
              </div>

              <div style={{ padding: "24px", background: "#FAF9F5", border: "1px solid #E2E8F0", borderRadius: "10px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(59, 130, 246, 0.15)", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  <Award size={20} />
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: "17px", color: "var(--forest-green)" }}>Transparent Trade Desks</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748B", lineHeight: 1.6 }}>
                  Dedicated B2B enquiry management with real-time tracking, transparent CIF/FOB pricing, and dedicated customer support.
                </p>
              </div>
            </div>

            <div style={{ marginTop: "32px", padding: "24px", background: "rgba(32, 59, 44, 0.05)", borderRadius: "10px", borderLeft: "4px solid var(--forest-green)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h4 style={{ margin: "0 0 4px", fontSize: "16px", color: "var(--forest-green)" }}>Ready to explore our export commodities?</h4>
                <p style={{ margin: 0, fontSize: "13.5px", color: "#475569" }}>Browse our pulses, spices, and specialty agricultural commodities.</p>
              </div>
              <Link to="/products" className="btn btn-gold" style={{ padding: "8px 20px", fontSize: "13.5px" }}>
                Explore Products <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
