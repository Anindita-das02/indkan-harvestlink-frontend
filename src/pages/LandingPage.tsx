import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Leaf,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  FileText,
  Ship,
  Sparkles,
  Scale,
  Award,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Featured commodities with realistic export specs and fallbacks
const featuredCommodities = [
  {
    id: 1,
    name: "Red Lentils (Masoor Dal)",
    category: "Pulses & Lentils",
    image: "/uploads/products/Red_lentils.jpg",
    fallback:
      "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=600&q=80",
    specs: [
      { label: "Origin", value: "India" },
      { label: "Purity", value: "99.5% Min" },
      { label: "MOQ", value: "100 kg / Bulk" },
    ],
    description:
      "Machine-cleaned, sortex-graded red lentils with uniform grain size, ideal for wholesale packaging and commercial food processing.",
  },
  {
    id: 2,
    name: "Green Gram (Moong)",
    category: "Pulses & Lentils",
    image: "/uploads/products/Green_grams.jpg",
    fallback:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
    specs: [
      { label: "Origin", value: "India" },
      { label: "Moisture", value: "11% Max" },
      { label: "MOQ", value: "100 kg / Bulk" },
    ],
    description:
      "High-protein green gram harvested under careful moisture control, ensuring high germination rate and superior culinary yield.",
  },
  {
    id: 3,
    name: "Alleppey Turmeric",
    category: "Premium Spices",
    image: "/uploads/products/Turmeric.jpg",
    fallback:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f5?auto=format&fit=crop&w=600&q=80",
    specs: [
      { label: "Curcumin", value: "3% – 5%" },
      { label: "Form", value: "Finger / Powder" },
      { label: "MOQ", value: "100 kg / Bulk" },
    ],
    description:
      "Authentic Indian turmeric renowned worldwide for deep golden color, high curcumin content, and natural aroma.",
  },
  {
    id: 4,
    name: "Tellicherry Black Pepper",
    category: "Premium Spices",
    image: "/uploads/products/Black_Pepper.jpg",
    fallback:
      "https://images.unsplash.com/photo-1599909533730-f9d3d9f2d6c6?auto=format&fit=crop&w=600&q=80",
    specs: [
      { label: "Grade", value: "Bold Garbled" },
      { label: "Density", value: "550 – 580 g/L" },
      { label: "MOQ", value: "100 kg / Bulk" },
    ],
    description:
      "Bold black peppercorns with sharp pungency and high essential oil content, sun-dried and calibrated to export standards.",
  },
];

// 4 Pillars of B2B Export Advantage
const exportAdvantages = [
  {
    icon: ShieldCheck,
    title: "Direct Source Traceability",
    description:
      "We procure directly from aggregated farming clusters across India, verifying agricultural practices, soil health, and chemical safety limits.",
  },
  {
    icon: Sparkles,
    title: "Sortex Cleaning & Calibrated Grading",
    description:
      "Commodities undergo multi-stage optical sortex cleaning, gravity separation, and strict moisture control prior to final packing.",
  },
  {
    icon: PackageCheck,
    title: "Custom Export Packaging",
    description:
      "Supplied in 25 kg / 50 kg PP woven bags, multi-wall kraft paper sacks, or food-grade vacuum pouches with customized buyer markings.",
  },
  {
    icon: FileText,
    title: "Comprehensive Port Documentation",
    description:
      "Full export compliance with Phytosanitary Certificates, Certificate of Origin, Non-GMO declarations, and SGS/third-party lab analysis.",
  },
];

// 4-Step Global Export Workflow
const tradeWorkflow = [
  {
    step: "01",
    title: "Requirement & RFQ",
    desc: "Share your target commodity, volume, preferred grade, packaging type, and destination port (FOB or CIF terms).",
  },
  {
    step: "02",
    title: "Sample & Specification Sign-off",
    desc: "We provide detailed certificate of analysis (COA) along with physical pre-shipment couriered samples for your approval.",
  },
  {
    step: "03",
    title: "Contract & Palletized Packing",
    desc: "Confirmation on commercial terms, followed by scheduled processing, bagging, moisture-safe palletization and container stuffing.",
  },
  {
    step: "04",
    title: "Vessel Loading & Express Dispatch",
    desc: "Customs clearance at major Indian ports (Mundra/JNPT) with real-time bill of lading tracking and express document courier.",
  },
];

export default function LandingPage() {
  const resolveImg = (path: string, fallback: string) => {
    if (!path) return fallback;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5001";
    return `${baseUrl.replace(/\/$/, "")}${path}`;
  };

  return (
    <main className="landing-page-root">
      {/* ========================================================= */}
      {/* 1. NAVBAR (Shared Component)                              */}
      {/* ========================================================= */}
      <Navbar />

      {/* ========================================================= */}
      {/* 2. HERO SECTION (Intact & Preserved as requested)        */}
      {/* ========================================================= */}
      <section className="hero" id="home">
        <div className="hero-image" aria-hidden="true" />

        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow">PREMIUM PULSES, LENTILS & SPICES</span>

            <h1>
              From Quality <br />
              Harvests to <br />
              <span>Global Buyers.</span>
            </h1>

            <p className="hero-description">
              We source quality pulses, lentils and spices from trusted
              suppliers to serve wholesale buyers and businesses around the
              world.
            </p>

            <div className="hero-actions">
              <Link className="btn btn-gold" to="/product">
                Explore Products <ArrowRight size={19} />
              </Link>

              <a className="btn btn-outline" href="#commodities">
                View Portfolio <ArrowRight size={18} />
              </a>
            </div>

            <div className="trust-points">
              <div className="trust-item">
                <Leaf aria-hidden="true" />
                <div>
                  <strong>Quality Focused</strong>
                  <span>Carefully selected</span>
                </div>
              </div>

              <div className="trust-item">
                <Globe2 aria-hidden="true" />
                <div>
                  <strong>Global Ambitions</strong>
                  <span>Worldwide supply</span>
                </div>
              </div>

              <div className="trust-item">
                <ShieldCheck aria-hidden="true" />
                <div>
                  <strong>Trusted Partner</strong>
                  <span>Business relationships</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. COMMODITIES SHOWCASE SECTION (Meaningful & Visual)     */}
      {/* ========================================================= */}
      <section className="commodities-showcase" id="commodities">
        <div className="container">
          <div className="section-header-centered">
            <span className="eyebrow">OUR COMMODITY PORTFOLIO</span>
            <h2>Export-Grade Agricultural Commodities</h2>
            <p>
              Grown in India’s most fertile agro-climatic zones, sortex-cleaned,
              and packaged to meet international phytosanitary and buyer standards.
            </p>
          </div>

          <div className="commodities-grid">
            {featuredCommodities.map((item) => (
              <div className="commodity-card" key={item.id}>
                <div className="commodity-image-wrap">
                  <img
                    src={resolveImg(item.image, item.fallback)}
                    alt={item.name}
                    className="commodity-image"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = item.fallback;
                    }}
                  />
                  <span className="commodity-badge">{item.category}</span>
                </div>

                <div className="commodity-card-body">
                  <h3>{item.name}</h3>
                  <p className="commodity-desc">{item.description}</p>

                  <div className="commodity-specs-row">
                    {item.specs.map((spec, i) => (
                      <div className="commodity-spec-pill" key={i}>
                        <span className="spec-label">{spec.label}:</span>
                        <span className="spec-val">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="commodity-card-footer">
                    <Link
                      to={`/products/${item.id}`}
                      className="commodity-view-btn"
                    >
                      View Specifications <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full catalogue banner */}
          <div className="catalogue-cta-box">
            <div className="catalogue-cta-text">
              <h4>Looking for Chickpeas, Red Chilli, or Custom Grains?</h4>
              <p>Explore our complete inventory of wholesale bulk commodities with downloadable specs.</p>
            </div>
            <Link to="/product" className="btn btn-gold">
              View Full Product Catalogue <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. WHY INDKAN HARVESTLINK (Value Props & Trust Pillars)   */}
      {/* ========================================================= */}
      <section className="why-indkan-section" id="why-indkan">
        <div className="container">
          <div className="section-header-centered">
            <span className="eyebrow eyebrow-gold">THE EXPORT ADVANTAGE</span>
            <h2>Why Global Buyers Partner with INDKAN</h2>
            <p>
              We eliminate intermediaries and uncertainty from cross-border agricultural
              procurement through systematic aggregation and rigorous quality protocols.
            </p>
          </div>

          <div className="advantages-grid">
            {exportAdvantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div className="advantage-card" key={idx}>
                  <div className="advantage-icon-box">
                    <Icon size={24} />
                  </div>
                  <h3>{adv.title}</h3>
                  <p>{adv.description}</p>
                </div>
              );
            })}
          </div>

          {/* Compliance Stats Bar */}
          <div className="compliance-metrics-bar">
            <div className="metric-item">
              <span className="metric-number">100%</span>
              <span className="metric-label">Phytosanitary & APEDA Compliant</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">Sortex</span>
              <span className="metric-label">Cleaned & Optical Separation</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">25 / 50 kg</span>
              <span className="metric-label">PP, Jute & Paper Packaging</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">FOB / CIF</span>
              <span className="metric-label">Mundra & JNPT Port Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. HOW WE WORK (Step-by-Step Global Trade Workflow)       */}
      {/* ========================================================= */}
      <section className="workflow-section" id="workflow">
        <div className="container">
          <div className="section-header-centered">
            <span className="eyebrow">ORDER TO DISPATCH WORKFLOW</span>
            <h2>Transparent 4-Step Procurement Process</h2>
            <p>
              Designed to ensure peace of mind, consistent quality, and prompt
              vessel execution for international buyers.
            </p>
          </div>

          <div className="workflow-steps-grid">
            {tradeWorkflow.map((item, idx) => (
              <div className="workflow-step-card" key={idx}>
                <div className="workflow-step-header">
                  <span className="step-badge">{item.step}</span>
                  <div className="step-line" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. ABOUT US & CORPORATE INTEGRITY                         */}
      {/* ========================================================= */}
      <section className="about-company-section" id="about">
        <div className="container about-grid">
          <div className="about-content-left">
            <span className="eyebrow">ABOUT INDKAN HARVESTLINK</span>
            <h2>Bridging India’s Rich Fields with International Markets</h2>
            <p className="about-lead">
              Headquartered in India, INDKAN HarvestLink operates as a dedicated export
              aggregator and distributor of premium pulses, lentils, and unadulterated spices.
            </p>
            <p className="about-subtext">
              We work closely with agrarian networks, certified mills, and professional
              inspection agencies to guarantee that every shipping container meets the precise
              moisture, purity, and cosmetic parameters mandated by destination countries across
              the Middle East, Southeast Asia, Europe, and the Americas.
            </p>

            <div className="about-highlights-list">
              <div className="about-highlight-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>Certified testing for moisture, foreign matter, and microbiological counts</span>
              </div>
              <div className="about-highlight-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>Flexible containerized consolidations for mixed commodity orders</span>
              </div>
              <div className="about-highlight-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>Direct trade desk assistance with rapid quotes and COA documentation</span>
              </div>
            </div>


          </div>

          <div className="about-visual-right">
            <div className="about-card-box">
              <div className="about-stat-card">
                <Award size={32} className="about-stat-icon" />
                <h4>Quality First Policy</h4>
                <p>Every single batch undergoes rigorous lab grading before container stuffing.</p>
              </div>

              <div className="about-stat-card card-accent">
                <Ship size={32} className="about-stat-icon" />
                <h4>Port Direct Freight</h4>
                <p>Smooth logistical pipeline connected to India’s largest deep-water export terminals.</p>
              </div>

              <div className="about-stat-card">
                <Scale size={32} className="about-stat-icon" />
                <h4>Transparent Terms</h4>
                <p>Fair, benchmark-aligned wholesale pricing with complete contract clarity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. HIGH-IMPACT TRADE ENQUIRY BANNER                       */}
      {/* ========================================================= */}
      <section className="trade-enquiry-banner" id="contact">
        <div className="container">
          <div className="enquiry-card-inner">
            <div className="enquiry-card-content">
              <span className="eyebrow eyebrow-light">START A CONVERSATION</span>
              <h2>Ready to Source High-Quality Commodities?</h2>
              <p>
                Connect directly with our international export desk for current FOB/CIF rates,
                free physical sample dispatch, and customized bulk packaging quotations.
              </p>

              <div className="enquiry-btn-group">
                <Link
                  to="/enquiry"
                  className="btn btn-gold"
                >
                  Submit Trade Enquiry <ArrowRight size={18} />
                </Link>
                <a
                  href="mailto:info@indkan.com"
                  className="btn btn-outline-white"
                >
                  <Mail size={17} />
                  Email: info@indkan.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. COMPLETE & REFINED FOOTER COMPONENT                    */}
      {/* ========================================================= */}
      <Footer />
    </main>
  );
}
