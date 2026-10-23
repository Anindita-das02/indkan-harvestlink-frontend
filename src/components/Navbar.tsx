import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Mail } from "lucide-react";

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
          <a
            className={`nav-link ${isHomePage ? "active" : ""}`}
            href={isHomePage ? "#home" : "/"}
            onClick={closeMenu}
          >
            Home
          </a>
          <Link
            className={`nav-link ${location.pathname.startsWith("/product") ? "active" : ""}`}
            to="/product"
            onClick={closeMenu}
          >
            Products
          </Link>
          <a
            className="nav-link"
            href={isHomePage ? "#why-indkan" : "/#why-indkan"}
            onClick={closeMenu}
          >
            Why Us
          </a>
          <a
            className="nav-link"
            href={isHomePage ? "#workflow" : "/#workflow"}
            onClick={closeMenu}
          >
            Process
          </a>
          <a
            className="nav-link"
            href={isHomePage ? "#about" : "/#about"}
            onClick={closeMenu}
          >
            About Us
          </a>
          <a
            className="btn btn-primary nav-cta"
            href={isHomePage ? "#contact" : "/#contact"}
            onClick={closeMenu}
          >
            <Mail size={17} />
            Send Enquiry
          </a>
        </nav>
      </div>
    </header>
  );
}
