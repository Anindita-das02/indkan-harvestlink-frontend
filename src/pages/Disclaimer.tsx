import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AlertCircle } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="site-wrapper">
      <Navbar />

      {/* Hero Header */}
      <section className="content-page-hero">
        <div className="container">
          <div className="hero-badge">
            <AlertCircle size={14} /> Legal Notice
          </div>
          <h1>Website Disclaimer</h1>
          <p className="hero-lead">
            Important regulatory disclosures, product specification notices, and commercial terms.
          </p>
        </div>
      </section>

      {/* Main Body */}
      <main className="content-page-body">
        <div className="container">
          <div className="content-page-card content-prose">
            <p>
              The information presented on this website is intended to help buyers explore products and submit business enquiries. Product specifications, images, packaging details, and availability should be verified with our team before a purchase decision is made.
            </p>

            <p>
              Actual product characteristics, prices, and delivery arrangements may vary depending on the product, supplier, season, and agreed commercial terms. Nothing on this website should be interpreted as a guarantee of availability or a binding quotation unless expressly confirmed by authorised representatives.
            </p>

            <h2>1. Product Representation & Technical Specifications</h2>
            <p>
              Commodity grades, moisture levels, purity percentages, and physical parameters shown in product listings or downloadable specifications represent indicative export benchmarks. Actual commodity lots are inspected and certified prior to loading per mutually agreed testing protocols (e.g., SGS, Geo-Chem).
            </p>

            <h2>2. Non-Binding Nature of Enquiries and Estimates</h2>
            <p>
              Inquiries, requests for quotations, indicative rate calculators, and catalogue reviews through this platform do not constitute a legally binding sales agreement. All binding international commercial terms are established exclusively through formal Proforma Invoices (PI), Sales Contracts, and agreed Letters of Credit (LC) / wire transfer terms.
            </p>

            <h2>3. Market Fluctuations & Shipping Timelines</h2>
            <p>
              Agricultural commodity market prices in India fluctuate based on harvest arrivals, government minimum support prices (MSP), currency exchange rates, and international demand. Published or quoted indicative rates are subject to re-confirmation until formalized. Freight rates and ocean transit times are subject to shipping line schedules and maritime conditions.
            </p>

            <div style={{ marginTop: "32px", padding: "16px 20px", background: "#FAF9F5", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "13.5px", color: "#64748B" }}>
              © 2026 INDKAN HarvestLink. For specific export inquiries and verified trade quotes, contact our export desk at <a href="mailto:info@indkan.com" style={{ color: "var(--forest-green)", fontWeight: 600 }}>info@indkan.com</a>.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
