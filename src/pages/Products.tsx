import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Search,
  SlidersHorizontal,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Ship,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import apiService from "../services/apiService";
import { API_ENDPOINTS } from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Product = {
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
  minimum_order_quantity?: string | number;
  moq_unit?: string;
  availability_status?: string;
  packaging_options?: string;
  image_url?: string;
};

// Fallback image for graceful error handling
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=700&q=80";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>("All Products");
  const [searchTerm, setSearchTerm] = useState("");

  // Helper to build full image URL from backend static upload path
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get(API_ENDPOINTS.PRODUCTS);
      const resultData = response.data?.data || response.data || [];
      setProducts(Array.isArray(resultData) ? resultData : []);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Database connection failed. Please ensure backend is running.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Dynamically extract categories from fetched products
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((product) => {
      if (product.category_name) {
        set.add(product.category_name);
      }
    });
    return ["All Products", ...Array.from(set)];
  }, [products]);

  // Filter products by active category and search input
  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All Products" ||
        product.category_name === activeCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        (product.category_name &&
          product.category_name.toLowerCase().includes(search)) ||
        (product.short_description &&
          product.short_description.toLowerCase().includes(search)) ||
        (product.description &&
          product.description.toLowerCase().includes(search));

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  return (
    <div className="products-page-container">
      <Navbar />
      <main className="products-page">
        {/* Sleek, centered & balanced Hero header */}
        <section className="products-hero">
          <div className="container products-hero-content">
            <h1>
              Quality Commodities for <span>Global Buyers.</span>
            </h1>

            <p>
              Sortex-cleaned pulses, export-grade lentils, and premium Indian spices
              aggregated directly from verified agrarian networks for international wholesale supply.
            </p>

            <div className="products-hero-badges">
              <div className="products-hero-badge">
                <CheckCircle2 size={15} className="badge-icon" />
                <span>Sortex Optical Cleaned</span>
              </div>
              <div className="products-hero-badge">
                <PackageCheck size={15} className="badge-icon" />
                <span>25 / 50 kg Export Bags</span>
              </div>
              <div className="products-hero-badge">
                <Ship size={15} className="badge-icon" />
                <span>Mundra & JNPT Dispatch</span>
              </div>
              <div className="products-hero-badge">
                <ShieldCheck size={15} className="badge-icon" />
                <span>Phytosanitary & APEDA</span>
              </div>
            </div>
          </div>
        </section>

        {/* Catalogue */}
        <section className="catalogue-section">
          <div className="container">
            {/* Unified toolbar with filters, count, and search */}
            <div className="catalogue-toolbar">
              <div className="category-filters" aria-label="Filter products">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`category-filter ${
                      activeCategory === category ? "selected" : ""
                    }`}
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={activeCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="catalogue-toolbar-right">
                <label className="product-search">
                  <Search size={18} aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Search commodities..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    aria-label="Search commodities"
                  />
                  <SlidersHorizontal
                    className="search-filter-icon"
                    size={17}
                    aria-hidden="true"
                  />
                </label>
              </div>
            </div>

          {/* Loading State */}
          {loading ? (
            <div className="products-empty" style={{ minHeight: "320px" }}>
              <Loader2
                size={38}
                style={{
                  color: "var(--forest-green)",
                  animation: "spin 1s linear infinite",
                  marginBottom: "16px",
                }}
              />
              <h3>Loading Products...</h3>
              <p>Fetching dynamic catalogue and images from the database.</p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="products-empty" style={{ minHeight: "320px" }}>
              <AlertCircle size={38} style={{ color: "#d9534f", marginBottom: "16px" }} />
              <h3>Failed to Load Products</h3>
              <p>{error}</p>
              <button
                className="btn btn-primary"
                type="button"
                onClick={fetchProducts}
                style={{ marginTop: "14px" }}
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            /* Product cards */
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <Link
                    className="product-image-link"
                    to={`/products/${product.id}`}
                    aria-label={`View ${product.name} details`}
                  >
                    <div className="product-image-wrap">
                      <img
                        src={getProductImage(product.image_url)}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                      <span className="product-category-badge">
                        {product.category_name || "Commodity"}
                      </span>
                    </div>
                  </Link>

                  <div className="product-card-content">
                    <span className="product-category-label">
                      {product.category_name || "Agricultural Produce"}
                    </span>

                    <h3>
                      <Link to={`/products/${product.id}`}>
                        {product.name}
                      </Link>
                    </h3>

                    <p>
                      {product.short_description ||
                        product.description ||
                        "Carefully sourced for wholesale buyers and commercial distributors."}
                    </p>

                    <div className="product-card-actions">
                      <Link
                        className="product-details-link"
                        to={`/products/${product.id}`}
                      >
                        View Product Details <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="products-empty">
              <Search size={34} />
              <h3>No products found</h3>
              <p>Try another search term or category.</p>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("All Products");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Wholesale enquiry banner */}
      <section className="products-enquiry-section">
        <div className="container products-enquiry-content">
          <div>
            <span className="eyebrow eyebrow-light">
              WHOLESALE & BULK SUPPLY
            </span>
            <h2>Looking for Products in Bulk?</h2>
            <p>
              Tell us what you need, including product, quantity
              and packaging preferences.
            </p>
          </div>

          <a
            className="btn btn-gold"
            href="mailto:info@indkan.com?subject=Bulk%20Commodity%20Wholesale%20Enquiry"
          >
            Send Bulk Enquiry <ArrowRight size={18} />
          </a>
        </div>
      </section>
      </main>

      {/* Unified B2B Footer */}
      <Footer />
    </div>
  );
}
