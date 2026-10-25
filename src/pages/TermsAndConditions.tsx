import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FileText } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="site-wrapper">
      <Navbar />

      {/* Hero Header */}
      <section className="content-page-hero">
        <div className="container">
          <div className="hero-badge">
            <FileText size={14} /> Commercial Agreements
          </div>
          <h1>Terms & Conditions</h1>
          <p className="hero-lead">
            Guidelines and commercial terms governing the use of INDKAN HarvestLink and bulk agricultural sourcing enquiries.
          </p>
        </div>
      </section>

      {/* Main Body */}
      <main className="content-page-body">
        <div className="container">
          <div className="content-page-card content-prose">
            <p>
              By accessing INDKAN HarvestLink, visitors agree to use the website for lawful purposes and provide accurate information when submitting business enquiries.
            </p>

            <p>
              Product descriptions, specifications, availability, and indicative information are provided for business reference and may require confirmation before an order is accepted. Quotations, pricing, minimum order quantities, delivery timelines, and export conditions are subject to the final terms agreed between the parties.
            </p>

            <p>
              Submitting an enquiry does not guarantee product availability or create a confirmed purchase order. Final terms should be documented in the applicable quotation or sales agreement.
            </p>

            <h2>1. Accuracy of Trade Enquiries</h2>
            <p>
              Prospective wholesale buyers are responsible for providing authentic business credentials, valid corporate tax identification numbers, and accurate destination delivery specifications to enable our compliance team to perform due diligence.
            </p>

            <h2>2. Quotations and Commercial Proformas</h2>
            <p>
              Any formal quotation sheet, proforma invoice, or export rate estimation issued by our trade desk remains valid for the duration specified on the document, after which market commodity price shifts may necessitate a revised rate calculation.
            </p>

            <h2>3. Order Confirmation and Export Contracts</h2>
            <p>
              An export contract becomes legally binding only upon bilateral execution of a sales contract, mutual agreement on Incoterms (FOB/CIF), and confirmation of agreed payment instruments (e.g. Letter of Credit or wire transfer terms).
            </p>

            <div style={{ marginTop: "32px", padding: "16px 20px", background: "#FAF9F5", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "13.5px", color: "#64748B" }}>
              Last revised: October 2026. Official commercial contracts prevail over indicative website terms.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
