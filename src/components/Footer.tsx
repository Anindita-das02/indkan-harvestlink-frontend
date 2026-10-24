import { Sprout, Mail, MapPin, ArrowUpRight, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-root">
      <div className="container footer-main">
        {/* Brand & Intro Column */}
        <div className="footer-brand-col">
          <Link to="/" className="footer-brand" onClick={scrollToTop}>
            <div className="footer-brand-icon">
              <Sprout size={20} color="#FFFFFF" />
            </div>
            <div className="footer-brand-text">
              <span className="footer-brand-name">INDKAN</span>
              <span className="footer-brand-sub">HARVESTLINK • EXPORTS</span>
            </div>
          </Link>

          <p className="footer-tagline">
            Connecting quality Indian harvests with international wholesale buyers,
            distributors, and food processing enterprises worldwide.
          </p>

          <div className="footer-badge">
            <ShieldCheck size={16} />
            <span>APEDA & Export Compliant Supply Chain</span>
          </div>
        </div>

        {/* Column 2: Export Commodities */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Export Commodities</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/product">Red Lentils (Masoor)</Link>
            </li>
            <li>
              <Link to="/product">Green Gram (Moong)</Link>
            </li>
            <li>
              <Link to="/product">Chickpeas (Kabuli Chana)</Link>
            </li>
            <li>
              <Link to="/product">Premium Turmeric</Link>
            </li>
            <li className="footer-special-link">
              <Link to="/product">
                View All Products <ArrowRight size={14} />
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Navigation */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links-list">
            <li>
              <a href="#about">About HarvestLink</a>
            </li>
            <li>
              <a href="#process">Export Process</a>
            </li>
            <li>
              <a href="#advantages">Quality Standards</a>
            </li>
            <li>
              <Link to="/enquiry">Trade Enquiry Desk</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Export Trade Desk & Contact */}
        <div className="footer-links-col footer-contact-col">
          <h4 className="footer-col-title">Export Trade Desk</h4>
          <div className="footer-contact-items">
            <div className="footer-contact-item">
              <Mail size={16} className="footer-contact-icon" />
              <div>
                <span className="footer-contact-label">Inquiries & Quotations</span>
                <a href="mailto:info@indkan.com" className="footer-contact-val">
                  info@indkan.com
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <MapPin size={16} className="footer-contact-icon" />
              <div>
                <span className="footer-contact-label">Dispatch Ports</span>
                <span className="footer-contact-val">
                  JNPT Mumbai • Mundra • Chennai
                </span>
              </div>
            </div>

            <div className="footer-trade-action">
              <Link
                to="/enquiry"
                className="btn btn-gold footer-cta-btn"
              >
                Request Trade Quote <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">
            © {new Date().getFullYear()} INDKAN HarvestLink. All rights reserved. Registered Export Aggregator.
          </p>

          <div className="footer-legal">
            <span>FOB / CIF Incoterms</span>
            <span className="footer-dot">•</span>
            <span>Custom Bulk Packaging</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
