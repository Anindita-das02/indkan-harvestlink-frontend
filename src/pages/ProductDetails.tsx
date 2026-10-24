import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Ship,
  PackageCheck,
  Mail,
  MapPin,
  Award,
  FileText,
} from "lucide-react";
import apiService from "../services/apiService";
import { API_ENDPOINTS } from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type ProductDetailsData = {
  id: number;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  product_code?: string;
  name: string;
  slug?: string;
  short_description?: string;
  description?: string;
  origin_country?: string;
  quality_grade?: string;
  colour?: string;
  storage_instructions?: string;
  minimum_order_quantity?: string | number;
  moq_unit?: string;
  availability_status?: string;
  export_information?: string;
  packaging_options?: string;
  image_url?: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=700&q=80";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"specs" | "logistics" | "quality">("specs");

  useEffect(() => {
    let isMounted = true;

    const fetchProductDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.get(API_ENDPOINTS.PRODUCT_DETAILS(id));
        if (isMounted) {
          const data = response.data?.data || response.data;
          if (data) {
            setProduct(data);
          } else {
            setError("Product not found");
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to load product details from database.";
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const getProductImage = (imagePath?: string) => {
    if (!imagePath) return FALLBACK_IMAGE;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5001";
    const cleanBase = baseUrl.replace(/\/$/, "");
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${cleanBase}${cleanPath}`;
  };

  const formatPackaging = (val?: string | null) => {
    if (!val) return "25 kg / 50 kg PP & Jute Bags";
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.join(", ");
      return String(parsed);
    } catch {
      return String(val);
    }
  };

  const formatAvailability = (status?: string) => {
    if (!status || status === "on_request") return "Available for Export Quotations";
    if (status === "available") return "In Stock • Ready for Loading";
    if (status === "unavailable") return "Seasonal • Inquire for Next Harvest";
    return status;
  };

  const formatMoq = (moq?: string | number | null, unit?: string | null) => {
    if (!moq) return "100 kg / Bulk Container";
    const num = parseFloat(String(moq));
    const formatted = isNaN(num) ? moq : Number.isInteger(num) ? num : num.toFixed(0);
    return `${formatted} ${unit || "kg"}`;
  };

  return (
    <div className="product-details-page">
      <Navbar />

      <main className="details-main-content">
        <div className="container details-container">

          {loading ? (
            <div className="details-loading-state">
              <Loader2
                size={40}
                style={{
                  color: "var(--forest-green)",
                  animation: "spin 1s linear infinite",
                  marginBottom: "16px",
                }}
              />
              <h3>Loading Commodity Specifications...</h3>
              <p>Fetching laboratory and export parameters from database.</p>
            </div>
          ) : error || !product ? (
            <div className="details-error-state">
              <AlertCircle size={40} style={{ color: "#d9534f", marginBottom: "16px" }} />
              <h3>Unable to Load Product</h3>
              <p>{error || "The requested product was not found in our export registry."}</p>
              <Link to="/product" className="btn btn-primary" style={{ marginTop: "16px" }}>
                Back to Catalogue
              </Link>
            </div>
          ) : (
            <>
              {/* Product Hero: Left Image Card, Right Commercial Card */}
              <div className="details-hero-grid">
                {/* Left: Product Image Showcase */}
                <div className="details-image-showcase">
                  <div className="details-image-frame">
                    <img
                      src={getProductImage(product.image_url)}
                      alt={product.name}
                      className="details-product-image"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="details-image-badges">
                      <span className="details-badge-gold">
                        <Award size={13} />
                        Export Sortex Grade
                      </span>
                      {product.category_name && (
                        <span className="details-badge-dark">
                          {product.category_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Key Specs & Commercial Action Hub */}
                <div className="details-info-card">
                  <div className="details-eyebrow-row">
                    <span className="details-category-eyebrow">
                      {product.category_name || "AGRICULTURAL COMMODITY"}
                    </span>
                    <span className="details-live-status">
                      <span className="status-dot" />
                      {formatAvailability(product.availability_status)}
                    </span>
                  </div>

                  <h1 className="details-title">{product.name}</h1>

                  <p className="details-short-desc">
                    {product.short_description ||
                      `${product.name} sourced directly from verified Indian agricultural zones, sortex-graded, and prepared for commercial wholesale packaging and international distribution.`}
                  </p>

                  {/* 4 Metric Cards in 2x2 grid */}
                  <div className="details-metrics-grid">
                    <div className="details-metric-card">
                      <span className="metric-card-label">Product Code</span>
                      <strong className="metric-card-value">
                        {product.product_code || "IK-AGRI-00"}
                      </strong>
                    </div>

                    <div className="details-metric-card">
                      <span className="metric-card-label">Country of Origin</span>
                      <strong className="metric-card-value">
                        {product.origin_country || "India"}
                      </strong>
                    </div>

                    <div className="details-metric-card">
                      <span className="metric-card-label">Minimum Order Quantity</span>
                      <strong className="metric-card-value highlight-gold">
                        {formatMoq(product.minimum_order_quantity, product.moq_unit)}
                      </strong>
                    </div>

                    <div className="details-metric-card">
                      <span className="metric-card-label">Export Packaging</span>
                      <strong className="metric-card-value">
                        {formatPackaging(product.packaging_options)}
                      </strong>
                    </div>
                  </div>

                  {/* Commercial Quote Box */}
                  <div className="details-quotation-box">
                    <div className="quotation-box-header">
                      <div>
                        <h4>Need Containerized Bulk Pricing?</h4>
                        <p>Receive firm FOB/CIF rate sheet and specification COA within 24 hours.</p>
                      </div>
                    </div>

                    <Link
                      to={`/enquiry?id=${product.id}&product=${encodeURIComponent(product.name)}`}
                      className="btn btn-gold details-primary-quote-btn"
                    >
                      <Mail size={18} />
                      Get Price Quote →
                    </Link>

                    <div className="quotation-guarantee-note">
                      <span>✓ Official Batch COA provided</span>
                      <span>✓ Physical sample dispatch</span>
                      <span>✓ Custom bag branding</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Specs & Commercial Tabs */}
              <div className="details-tabs-section">
                <div className="details-tabs-nav" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    className={`details-tab-btn ${activeTab === "specs" ? "active" : ""}`}
                    onClick={() => setActiveTab("specs")}
                    aria-selected={activeTab === "specs"}
                  >
                    <FileText size={16} />
                    Technical Specifications
                  </button>

                  <button
                    type="button"
                    role="tab"
                    className={`details-tab-btn ${activeTab === "logistics" ? "active" : ""}`}
                    onClick={() => setActiveTab("logistics")}
                    aria-selected={activeTab === "logistics"}
                  >
                    <Ship size={16} />
                    Packaging & Shipping
                  </button>

                  <button
                    type="button"
                    role="tab"
                    className={`details-tab-btn ${activeTab === "quality" ? "active" : ""}`}
                    onClick={() => setActiveTab("quality")}
                    aria-selected={activeTab === "quality"}
                  >
                    <ShieldCheck size={16} />
                    Quality & Compliance
                  </button>
                </div>

                <div className="details-tab-panel">
                  {activeTab === "specs" && (
                    <div className="tab-pane">
                      <div className="details-description-block">
                        <h3>About {product.name}</h3>
                        <p>
                          {product.description ||
                            `${product.name} is meticulously cleaned, Sortex-graded, and moisture-controlled to ensure international compliance for commercial wholesale packaging, canning, and retail distribution.`}
                        </p>
                      </div>

                      <div className="details-specs-grid-table">
                        <div className="spec-table-row">
                          <span className="spec-table-label">Quality Grade</span>
                          <span className="spec-table-val">{product.quality_grade || "Sortex Cleaned / Bold Export Grade"}</span>
                        </div>
                        <div className="spec-table-row">
                          <span className="spec-table-label">Colour & Appearance</span>
                          <span className="spec-table-val">{product.colour || "Natural, uniform cosmetic grading"}</span>
                        </div>
                        <div className="spec-table-row">
                          <span className="spec-table-label">Country of Origin</span>
                          <span className="spec-table-val">{product.origin_country || "India (Selected Agro-Climatic Belts)"}</span>
                        </div>
                        <div className="spec-table-row">
                          <span className="spec-table-label">Moisture Content</span>
                          <span className="spec-table-val">10% – 12% Max (Supplier standard; exact batch COA confirmed per contract)</span>
                        </div>
                        <div className="spec-table-row">
                          <span className="spec-table-label">Foreign Matter / Purity</span>
                          <span className="spec-table-val">99.0% – 99.5% Min Optical Sortex Purity (As per buyer contractual specification)</span>
                        </div>
                        <div className="spec-table-row">
                          <span className="spec-table-label">Storage Conditions</span>
                          <span className="spec-table-val">
                            {product.storage_instructions || "Store in cool, dry ventilated warehouse below 25°C"}
                          </span>
                        </div>
                      </div>

                      <div className="spec-disclosure-box">
                        <div className="spec-disclosure-title">
                          <ShieldCheck size={16} />
                          <span>Supplier Quality & Specification Verification Notice</span>
                        </div>
                        <p style={{ margin: 0 }}>
                          Physical parameters (moisture %, optical sortex purity, foreign matter tolerance) are confirmed based on verified supplier test certificates and official pre-dispatch Certificate of Analysis (COA) issued by accredited inspection agencies (e.g. SGS / Bureau Veritas) per shipment contract. Baseline demo figures represent standard export grade targets.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "logistics" && (
                    <div className="tab-pane">
                      <div className="details-description-block">
                        <h3>Export Logistics & Packing Options</h3>
                        <p>
                          We provide flexible, food-grade export bagging aligned with destination country phytosanitary and handling standards.
                        </p>
                      </div>

                      <div className="logistics-cards-row">
                        <div className="logistics-card">
                          <PackageCheck size={26} className="logistics-card-icon" />
                          <h4>Bagging Types</h4>
                          <p>25 kg / 50 kg multi-layer PP bags, high-density non-woven bags, or traditional jute sacks with buyer branding.</p>
                        </div>

                        <div className="logistics-card">
                          <Ship size={26} className="logistics-card-icon" />
                          <h4>Container Loading</h4>
                          <p>20ft FCL (up to 24-26 MT) and 40ft FCL container stuffing with optional silica gel desiccant packs.</p>
                        </div>

                        <div className="logistics-card">
                          <MapPin size={26} className="logistics-card-icon" />
                          <h4>Departure Terminals</h4>
                          <p>Mundra Port (Gujarat), JNPT (Navi Mumbai), and Chennai Port with complete export documentation.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "quality" && (
                    <div className="tab-pane">
                      <div className="details-description-block">
                        <h3>Phytosanitary & Lab Inspection</h3>
                        <p>
                          Every shipment undergoes standard pre-dispatch sampling to ensure full compliance with international import regulations.
                        </p>
                      </div>

                      <div className="quality-checklist-grid">
                        <div className="quality-check-card">
                          <CheckCircle2 size={20} className="quality-icon" />
                          <div>
                            <strong>Phytosanitary Certification</strong>
                            <p>Issued by Government of India Plant Quarantine authority prior to vessel loading.</p>
                          </div>
                        </div>

                        <div className="quality-check-card">
                          <CheckCircle2 size={20} className="quality-icon" />
                          <div>
                            <strong>APEDA Export Registration</strong>
                            <p>Registered merchant aggregator under Agricultural & Processed Food Products Export Authority.</p>
                          </div>
                        </div>

                        <div className="quality-check-card">
                          <CheckCircle2 size={20} className="quality-icon" />
                          <div>
                            <strong>Certificate of Analysis (COA)</strong>
                            <p>Comprehensive batch testing report detailing moisture, count, and purity parameters.</p>
                          </div>
                        </div>

                        <div className="quality-check-card">
                          <CheckCircle2 size={20} className="quality-icon" />
                          <div>
                            <strong>Third-Party Inspection</strong>
                            <p>SGS or Bureau Veritas independent pre-shipment inspection available upon buyer request.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Trade Desk Assistance */}
              <div className="details-assistance-card">
                <div className="details-assistance-left">
                  <span className="eyebrow eyebrow-gold">CUSTOM EXPORT INQUIRIES</span>
                  <h3>Have specific destination requirements for {product.name}?</h3>
                  <p>Our trade desk assists with mixed container consolidations, custom packaging artwork, and CIF freight quotations.</p>
                </div>
                <div className="details-assistance-right">
                  <Link
                    to={`/enquiry?id=${product.id}&product=${encodeURIComponent(product.name)}`}
                    className="btn btn-gold"
                  >
                    Contact Trade Desk <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
