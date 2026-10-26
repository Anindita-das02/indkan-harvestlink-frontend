import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Leaf,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Package,
  FileText,
  Scale,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Boxes,
  FileCheck2,
  Search,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// 1. Featured Categories Data
const featuredCategories = [
  {
    id: "pulses-lentils",
    name: "Pulses & Lentils",
    badge: "Core Commodity",
    image: "/uploads/products/Red_lentils.jpg",
    fallback:
      "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=600&q=80",
    description:
      "Sortex-cleaned, high-protein Indian pulses and lentils with uniform grain size, calibrated moisture, and export purity.",
    highlights: ["Red Lentils", "Green Gram", "Kabuli Chickpeas"],
    link: "/products",
  },
  {
    id: "premium-spices",
    name: "Premium Spices",
    badge: "Export Grade",
    image: "/uploads/products/Turmeric.jpg",
    fallback:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f5?auto=format&fit=crop&w=600&q=80",
    description:
      "Aromatic whole and calibrated Indian spices, including high-curcumin turmeric, bold black pepper, and vibrant sun-dried red chillies.",
    highlights: ["Tellicherry Pepper", "Alleppey Turmeric", "Guntur Chilli"],
    link: "/products",
  },
  {
    id: "oilseeds-grains",
    name: "Oilseeds & Agro Grains",
    badge: "Wholesale Supply",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    fallback:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    description:
      "Selected agro grains, sesame seeds, and edible oilseeds procured for commercial food manufacturing, milling, and international re-bagging.",
    highlights: ["Natural Sesame", "Mustard Seeds", "Food-Grade Grains"],
    link: "/products",
  },
];

// 2. Popular Products Data (Selected important products with realistic export specs)
const popularProducts = [
  {
    id: 8,
    name: "Kabuli Chickpeas",
    category: "Pulses & Lentils",
    origin: "India",
    moq: "100 kg / Bulk",
    grade: "Grade A (75-80 Counts)",
    status: "in_stock",
    statusLabel: "In Stock",
    image: "/uploads/products/Chickpea.jpg",
    fallback:
      "https://images.unsplash.com/photo-1585849834908-347113c23571?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 1,
    name: "Red Lentils (Masoor)",
    category: "Pulses & Lentils",
    origin: "India",
    moq: "100 kg / Bulk",
    grade: "Sortex Clean (99.5% Purity)",
    status: "in_stock",
    statusLabel: "In Stock",
    image: "/uploads/products/Red_lentils.jpg",
    fallback:
      "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Tellicherry Black Pepper",
    category: "Premium Spices",
    origin: "India",
    moq: "100 kg / Bulk",
    grade: "Bold Garbled (550+ g/L)",
    status: "low_stock",
    statusLabel: "Low Stock",
    image: "/uploads/products/Black_Pepper.jpg",
    fallback:
      "https://images.unsplash.com/photo-1599909533730-f9d3d9f2d6c6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 9,
    name: "Guntur Red Chilli",
    category: "Premium Spices",
    origin: "India",
    moq: "100 kg / Bulk",
    grade: "Grade A Sun-Dried",
    status: "in_stock",
    statusLabel: "In Stock",
    image: "/uploads/products/Red_Chilli.jpg",
    fallback:
      "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
  },
];

// 3. Why Choose INDKAN HarvestLink (Only 100% Real, Active Services)
const whyChoosePoints = [
  {
    icon: FileText,
    title: "Product Information & Specifications",
    desc: "Complete transparency with verified parameters: moisture levels, purity grades, crop origin, and realistic minimum order quantities.",
  },
  {
    icon: Boxes,
    title: "Multi-Item Bulk Enquiry",
    desc: "Specify exact volumes in kilograms or metric tons, combine multiple commodities, and choose preferred packaging in one submission.",
  },
  {
    icon: Scale,
    title: "Transparent Quotation Process",
    desc: "Itemized commercial quotes calculated on live commodity availability and standard Incoterms (FOB/CIF) without hidden intermediary markups.",
  },
  {
    icon: ShieldCheck,
    title: "Live Enquiry Status Tracking",
    desc: "Track review progress, quotation issuance, and dispatch milestones securely anytime using your unique Enquiry Reference ID and 6-digit PIN.",
  },
];

// 4. Quality & Packaging Standards
const qualityPackagingData = [
  {
    icon: Sparkles,
    title: "Quality Grade & Sortex Cleaned",
    desc: "Machine-cleaned and optical sortex processed to eliminate foreign particles, immature seeds, and color defects.",
    chips: ["99.5% Purity", "Controlled Moisture", "Uniform Kernel Size"],
  },
  {
    icon: Package,
    title: "Export-Standard Packaging",
    desc: "Packed in multi-layer PP woven bags, jute sacks, or food-grade vacuum pouches designed to withstand long ocean transits.",
    chips: ["25 kg / 50 kg PP Bags", "Jute Sacks", "Vacuum Pouches"],
  },
  {
    icon: Leaf,
    title: "Safe Storage & Moisture Control",
    desc: "Commodities are kept in dry, aerated warehouses with routine pest monitoring, desiccant liners, and palletized stuffing.",
    chips: ["Humidity Monitored", "Palletized Packing", "Dry Storage"],
  },
  {
    icon: FileCheck2,
    title: "Verified Quality Documents",
    desc: "Every container shipment is accompanied by authorized Phytosanitary Certificates, Certificate of Origin, and SGS/lab testing COA.",
    chips: ["Phytosanitary", "Certificate of Origin", "COA / Non-GMO"],
  },
];

// 5. How It Works (4 Simple Steps Timeline)
const howItWorksSteps = [
  {
    step: "01",
    title: "Explore Products",
    desc: "Browse our agricultural commodities and examine detailed technical specifications, origins, and standard MOQs.",
  },
  {
    step: "02",
    title: "Submit Enquiry",
    desc: "Enter your target volume in kg or MT, select preferred packaging type, and provide your destination country.",
  },
  {
    step: "03",
    title: "Receive Quotation",
    desc: "Our trade desk checks real-time availability and issues an itemized FOB or CIF quotation with payment terms.",
  },
  {
    step: "04",
    title: "Confirm Order",
    desc: "Review commercial terms, sign off on sample specifications, and proceed to container stuffing and port dispatch.",
  },
];

// 6. Buyer Support & FAQ Preview
const faqPreviewList = [
  {
    q: "What is the minimum order quantity (MOQ)?",
    a: "Standard MOQ is typically 100 kg to 1 Metric Ton depending on the commodity. For specialty spices, flexible bulk quantities can be accommodated upon request.",
  },
  {
    q: "How can I check product availability?",
    a: "Live indicators (In Stock, Low Stock, or On Request) are shown on each product card. Official allocation and delivery schedules are confirmed upon enquiry review.",
  },
  {
    q: "Which export packaging options are available?",
    a: "We provide 25 kg and 50 kg PP woven bags, multi-ply kraft paper sacks, traditional jute bags, and moisture-proof vacuum pouches for spices with customized buyer labeling.",
  },
  {
    q: "How does the export quotation process work?",
    a: "After you submit your required volume and destination port, our export desk prepares a transparent commercial quote based on current mandi rates and shipping freight.",
  },
  {
    q: "How can I track my submitted enquiry?",
    a: "You receive an Enquiry Reference ID (e.g. ENQ-2026-0009) and a 6-digit Secret PIN. Enter them on our 'Track Your Enquiry' page to view real-time status updates.",
  },
];

export default function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const resolveImg = (path: string, fallback: string) => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5001";
    return `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <main className="landing-page-root">
      {/* ========================================================= */}
      {/* 1. NAVBAR (Shared Component)                              */}
      {/* ========================================================= */}
      <Navbar />

      {/* ========================================================= */}
      {/* 2. HERO SECTION (Existing & Preserved)                    */}
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
              <Link className="btn btn-gold" to="/products">
                Explore Products <ArrowRight size={19} />
              </Link>

              <a className="btn btn-outline" href="#categories">
                View Categories <ArrowRight size={18} />
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
      {/* SECTION 1: FEATURED PRODUCT CATEGORIES                    */}
      {/* ========================================================= */}
      <section className="featured-categories-section" id="categories">
        <div className="container">
          <div className="landing-section-header">
            <span className="eyebrow">
              <Boxes size={14} /> Product Range
            </span>
            <h2>Featured Product Categories</h2>
            <p>
              Explore our core agricultural commodity categories sourced
              directly from India’s leading crop-growing regions and processed
              for international export.
            </p>
          </div>

          <div className="categories-grid">
            {featuredCategories.map((cat) => (
              <div className="category-card" key={cat.id}>
                <div className="category-img-wrap">
                  <img
                    src={resolveImg(cat.image, cat.fallback)}
                    alt={cat.name}
                    className="category-img"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = cat.fallback;
                    }}
                  />
                  <span className="category-tag-badge">{cat.badge}</span>
                </div>

                <div className="category-content">
                  <h3>{cat.name}</h3>
                  <p className="category-desc">{cat.description}</p>

                  <div className="category-sub-list">
                    {cat.highlights.map((h, i) => (
                      <span className="category-sub-pill" key={i}>
                        {h}
                      </span>
                    ))}
                  </div>

                  <Link to={cat.link} className="category-btn">
                    Explore Products <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: POPULAR PRODUCTS                               */}
      {/* ========================================================= */}
      <section className="popular-products-section" id="popular-products">
        <div className="container">
          <div className="landing-section-header">
            <span className="eyebrow">
              <Sparkles size={14} /> Export Commodities
            </span>
            <h2>Popular Products</h2>
            <p>
              Key agricultural staples available for bulk international
              procurement, complete with verifiable grades, origin details, and
              flexible packaging.
            </p>
          </div>

          <div className="popular-products-grid">
            {popularProducts.map((prod) => (
              <div className="popular-product-card" key={prod.id}>
                <div className="popular-img-wrap">
                  <img
                    src={resolveImg(prod.image, prod.fallback)}
                    alt={prod.name}
                    className="popular-img"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = prod.fallback;
                    }}
                  />
                  <span
                    className={`popular-stock-badge ${prod.status}`}
                  >
                    {prod.statusLabel}
                  </span>
                </div>

                <div className="popular-card-body">
                  <span className="popular-cat-label">{prod.category}</span>
                  <h3>{prod.name}</h3>

                  <div className="popular-specs-list">
                    <div className="popular-spec-row">
                      <span className="popular-spec-label">Origin:</span>
                      <span className="popular-spec-val">{prod.origin}</span>
                    </div>
                    <div className="popular-spec-row">
                      <span className="popular-spec-label">Grade:</span>
                      <span className="popular-spec-val">{prod.grade}</span>
                    </div>
                    <div className="popular-spec-row">
                      <span className="popular-spec-label">MOQ:</span>
                      <span className="popular-spec-val">{prod.moq}</span>
                    </div>
                  </div>

                  <div className="popular-card-actions">
                    <Link
                      to={`/products/${prod.id}`}
                      className="btn-details-link"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/enquiry?id=${prod.id}&product=${encodeURIComponent(
                        prod.name
                      )}`}
                      className="btn-quote-link"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Catalogue Explorer Bar */}
          <div className="catalogue-banner-bar">
            <div>
              <h4>Looking for Additional Commodities?</h4>
              <p>
                Browse our full product catalogue including green gram, dried
                spices, and seasonal agricultural batches.
              </p>
            </div>
            <Link to="/products" className="btn btn-gold">
              View Full Product Catalogue <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: WHY CHOOSE INDKAN HARVESTLINK                  */}
      {/* ========================================================= */}
      <section className="why-choose-section" id="why-choose-us">
        <div className="container">
          <div className="landing-section-header">
            <span className="eyebrow">
              <ShieldCheck size={14} /> Platform Advantages
            </span>
            <h2>Why Choose INDKAN HarvestLink?</h2>
            <p>
              We provide global buyers with an honest, structured export trade
              desk backed by transparent product data, flexible enquiry tools,
              and live status tracking.
            </p>
          </div>

          <div className="why-choose-grid">
            {whyChoosePoints.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div className="why-feature-card" key={idx}>
                  <div className="why-icon-bubble">
                    <Icon size={22} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: QUALITY & PACKAGING                            */}
      {/* ========================================================= */}
      <section className="quality-packaging-section" id="quality-packaging">
        <div className="container">
          <div className="landing-section-header">
            <span className="eyebrow">
              <CheckCircle2 size={14} /> Export Standards
            </span>
            <h2>Quality & Packaging</h2>
            <p>
              Agricultural commodities prepared to meet destination port
              regulations, international moisture thresholds, and hygienic food
              handling standards.
            </p>
          </div>

          <div className="quality-packaging-grid">
            {qualityPackagingData.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div className="quality-card" key={idx}>
                  <div className="quality-icon-bubble">
                    <Icon size={20} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <div className="quality-card-chips">
                    {item.chips.map((chip, cIdx) => (
                      <span className="quality-chip" key={cIdx}>
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: HOW IT WORKS                                   */}
      {/* ========================================================= */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <div className="landing-section-header">
            <span className="eyebrow">
              <Scale size={14} /> Visual Trade Workflow
            </span>
            <h2>How It Works</h2>
            <p>
              A straightforward 4-step workflow designed to take international
              buyers from initial commodity discovery to confirmed export order.
            </p>
          </div>

          <div className="how-timeline-grid">
            {howItWorksSteps.map((item, idx) => (
              <div className="how-step-card" key={idx}>
                <div className="how-step-top">
                  <div className="how-step-number">{item.step}</div>
                  <div className="how-step-connector" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: BULK ENQUIRY CTA                               */}
      {/* ========================================================= */}
      <section className="bulk-cta-section" id="bulk-enquiry">
        <div className="container">
          <div className="bulk-cta-box">
            <div className="bulk-cta-text-wrap">
              <span className="eyebrow">DIRECT EXPORT INQUIRY</span>
              <h2>Looking for Agricultural Products in Bulk?</h2>
              <p>
                Share your product requirements, quantity and destination country
                with our team. We will review your enquiry and get back to you
                regarding availability and quotation.
              </p>
            </div>

            <div className="bulk-cta-action">
              <Link to="/enquiry" className="bulk-cta-btn">
                Request a Quotation <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 7: BUYER SUPPORT & FAQ PREVIEW                    */}
      {/* ========================================================= */}
      <section className="faq-preview-section" id="faqs">
        <div className="container faq-preview-container">
          <div className="landing-section-header">
            <span className="eyebrow">
              <HelpCircle size={14} /> Quick Answers
            </span>
            <h2>Buyer Support & FAQs</h2>
            <p>
              Common questions about minimum order volumes, product
              availability, packaging configurations, quotation turnaround, and
              PIN tracking.
            </p>
          </div>

          <div className="faq-preview-accordion">
            {faqPreviewList.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`faq-preview-item ${isOpen ? "open" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-preview-btn"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp size={18} color="#C9A451" />
                    ) : (
                      <ChevronDown size={18} color="#64748B" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="faq-preview-answer">
                      <p style={{ margin: 0 }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* FAQ Navigation and Support Links */}
          <div className="faq-preview-actions-bar">
            <div>
              <strong
                style={{
                  color: "var(--forest-green)",
                  fontSize: "14.5px",
                  display: "block",
                  marginBottom: "2px",
                }}
              >
                Still have sourcing or export questions?
              </strong>
              <span style={{ color: "#64748B", fontSize: "13px" }}>
                Our team is ready to assist with custom Incoterms, container
                logistics, or lab analysis.
              </span>
            </div>

            <div className="faq-preview-actions-links">
              <Link to="/faqs" className="faq-link-btn faq-link-primary">
                <Search size={14} />
                View All FAQs
              </Link>
              <Link to="/contact-us" className="faq-link-btn faq-link-secondary">
                Contact Us <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. FOOTER (Shared Component)                              */}
      {/* ========================================================= */}
      <Footer />
    </main>
  );
}
