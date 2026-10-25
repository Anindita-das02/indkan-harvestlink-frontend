import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Clock } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container navbar">
        <Link
          to="/"
          className="brand"
          aria-label="INDKAN HarvestLink home"
          onClick={closeMenu}
        >
          <img
            className="brand-logo-image"
            src="/images/indkan-logo-light.png"
            alt="INDKAN HarvestLink"
          />
        </Link>

        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav
          className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}
          aria-label="Main navigation"
        >
          <Link
            className={`nav-link ${isHomePage ? "active" : ""}`}
            to="/"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            className={`nav-link ${location.pathname.startsWith("/product") ? "active" : ""}`}
            to="/products"
            onClick={closeMenu}
          >
            Products
          </Link>
          <Link
            className={`nav-link ${location.pathname.startsWith("/track") ? "active" : ""}`}
            to="/track-enquiry"
            onClick={closeMenu}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Clock size={15} />
            Track Enquiry
          </Link>
        </nav>
      </div>
    </header>
  );
}
