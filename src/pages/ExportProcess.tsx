import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Ship, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function ExportProcess() {
  const steps = [
    {
      num: 1,
      title: "Explore Products",
      desc: "Browse our product catalogue and review the available specifications."
    },
    {
      num: 2,
      title: "Submit an Enquiry",
      desc: "Share your required quantity, packaging preferences, destination country, and other business requirements."
    },
    {
      num: 3,
      title: "Review and Quotation",
      desc: "Our team reviews your enquiry and, where feasible, prepares a quotation based on product availability and agreed trade requirements."
    },
    {
      num: 4,
      title: "Confirm the Order",
      desc: "Once the quotation and commercial terms are accepted, the order can proceed according to the agreed conditions."
    },
    {
      num: 5,
      title: "Shipment Coordination",
      desc: "Shipment arrangements and documentation are coordinated according to the agreed export terms."
    }
  ];

  return (
    <div className="site-wrapper">
      <Navbar />

      {/* Hero Header */}
      <section className="content-page-hero">
        <div className="container">
          <div className="hero-badge">
            <Ship size={14} /> International Trade Workflow
          </div>
          <h1>How Our Export Process Works</h1>
          <p className="hero-lead">
            Our export enquiry process is designed to make bulk sourcing straightforward for international buyers.
          </p>
        </div>
      </section>

      {/* Main Body */}
      <main className="content-page-body">
        <div className="container">
          <div className="content-page-card">
            <p style={{ fontSize: "16px", color: "#334155", lineHeight: 1.75, margin: "0 0 24px" }}>
              Our export enquiry process is designed to make bulk sourcing straightforward for international buyers. We ensure full clarity from initial product discovery to final vessel dispatch and documentation.
            </p>

            <div className="process-steps-list">
              {steps.map((s) => (
                <div key={s.num} className="process-step-card">
                  <div className="process-step-num">{s.num}</div>
                  <div className="process-step-content">
                    <h3>Step {s.num}: {s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "28px", padding: "18px 24px", background: "#FAF9F5", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
              <p style={{ margin: 0, fontSize: "14.5px", color: "#475569", lineHeight: 1.7, fontStyle: "italic" }}>
                Specific timelines, prices, and shipping arrangements are confirmed individually for each order.
              </p>
            </div>

            <div style={{ marginTop: "36px", textAlign: "center" }}>
              <Link to="/enquiry" className="btn btn-gold" style={{ padding: "12px 28px", fontSize: "15px" }}>
                Submit Your Requirements <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
