import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="site-wrapper">
      <Navbar />

      {/* Hero Header */}
      <section className="content-page-hero">
        <div className="container">
          <div className="hero-badge">
            <ShieldCheck size={14} /> Legal & Compliance
          </div>
          <h1>Privacy Policy</h1>
          <p className="hero-lead">
            Transparent policies on how we handle commercial buyer enquiries, contact details, and trade information.
          </p>
        </div>
      </section>

      {/* Main Body */}
      <main className="content-page-body">
        <div className="container">
          <div className="content-page-card content-prose">
            <p>
              INDKAN HarvestLink respects the privacy of buyers and visitors who use our website. Information submitted through product enquiries and contact forms may be used to review requests, communicate quotations, respond to questions, and coordinate relevant business activities.
            </p>

            <p>
              Access to enquiry information should be limited to authorised personnel. Personal information should be handled securely and retained only as required for legitimate business, operational, and applicable legal purposes.
            </p>

            <p>
              This policy should be finalised to reflect the actual data collected, storage practices, third-party services, retention periods, and applicable privacy laws.
            </p>

            <h2>1. Collection of Business & Enquiry Information</h2>
            <p>
              When international buyers submit requests through our quotation forms or contact desk, we collect business-related details including entity legal name, tax registration/identification number, country of destination, contact person, corporate email address, and specific commodity sourcing requirements.
            </p>

            <h2>2. Use of Information</h2>
            <p>
              Collected information is strictly utilized to evaluate commercial feasibility, prepare custom FOB/CIF export quotations, establish trade communication, comply with APEDA regulatory export requirements, and coordinate shipping logistics.
            </p>

            <h2>3. Confidentiality and Security</h2>
            <p>
              We implement industry-standard encryption, role-based administrative controls, and secure database protocols to protect commercial correspondence, buyer tax numbers, and enquiry status verification PINs from unauthorized access.
            </p>

            <div style={{ marginTop: "32px", padding: "16px 20px", background: "#FAF9F5", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "13.5px", color: "#64748B" }}>
              Last updated: October 2026. For questions regarding our privacy practices, please contact <a href="mailto:privacy@indkan.com" style={{ color: "var(--forest-green)", fontWeight: 600 }}>privacy@indkan.com</a>.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
