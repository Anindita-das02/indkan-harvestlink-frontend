import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck, MapPin, Search, ChevronDown, X, Clock, KeyRound, Copy, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import apiService from "../services/apiService";
import { API_ENDPOINTS } from "../config/api";

type ProductOption = {
  id: number;
  name: string;
  category_name?: string;
  product_code?: string;
};

export default function EnquiryPage() {
  const [searchParams] = useSearchParams();
  const initialProductName = searchParams.get("product") || "";
  const initialProductId = searchParams.get("id") ? Number(searchParams.get("id")) : null;

  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Buyer & Business Verification Fields
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [buyerCountry, setBuyerCountry] = useState("");
  const [buyerType] = useState<"wholesaler" | "distributor" | "retailer" | "other">("wholesaler");
  const [verifiedBuyerPhone, setVerifiedBuyerPhone] = useState<string | null>(null);

  useEffect(() => {
    const savedPhone = localStorage.getItem("indkan_buyer_phone");
    if (savedPhone) {
      setVerifiedBuyerPhone(savedPhone);
      setPhone((prev) => prev || savedPhone);
    }
  }, []);

  // Delivery Destination & Real Location Verification
  const [destinationPort, setDestinationPort] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string; address?: any }>>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedProductId, setSelectedProductId] = useState<number | "">(initialProductId || "");
  const [productSearch, setProductSearch] = useState("");
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const productSelectorRef = useRef<HTMLDivElement>(null);

  const [quantity, setQuantity] = useState<number | string>(1);
  const [unit, setUnit] = useState("Metric Ton");
  const [packaging, setPackaging] = useState("25 kg bag");
  const [incoterm, setIncoterm] = useState("FOB");
  const [additionalRequirements, setAdditionalRequirements] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<number | null>(null);
  const [submittedReferenceId, setSubmittedReferenceId] = useState<string>("");
  const [submittedSecretPin, setSubmittedSecretPin] = useState<string>("");
  const [copiedField, setCopiedField] = useState<"ref" | "pin" | null>(null);

  const copyToClipboard = (text: string, field: "ref" | "pin") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchProductList = async () => {
      try {
        setLoadingProducts(true);
        const res = await apiService.get(API_ENDPOINTS.PRODUCTS);
        const list = res.data?.data || res.data || [];
        if (isMounted && Array.isArray(list)) {
          setProducts(list);
          let targetProd = null;
          if (initialProductId) {
            targetProd = list.find((p) => p.id === initialProductId);
          } else if (initialProductName) {
            targetProd = list.find((p) => p.name.toLowerCase() === initialProductName.toLowerCase());
          }
          if (targetProd) {
            setSelectedProductId(targetProd.id);
            setProductSearch(`${targetProd.name}${targetProd.product_code ? ` (${targetProd.product_code})` : ""}`);
          } else if (list.length > 0 && !selectedProductId) {
            setSelectedProductId(list[0].id);
            setProductSearch(`${list[0].name}${list[0].product_code ? ` (${list[0].product_code})` : ""}`);
          }
        }
      } catch {
        if (isMounted) {
          const fallbackList = [
            { id: 4, name: "Black Pepper", product_code: "IK-SPC-002" },
            { id: 8, name: "Chickpeas", product_code: "IK-PUL-003" },
            { id: 2, name: "Green Gram", product_code: "IK-PUL-002" },
            { id: 7, name: "Red Chilli", product_code: "IK-SPC-004" },
            { id: 1, name: "Red Lentils", product_code: "IK-PUL-001" },
            { id: 3, name: "Turmeric", product_code: "IK-SPC-001" },
          ];
          setProducts(fallbackList);
          let targetProd = null;
          if (initialProductId) {
            targetProd = fallbackList.find((p) => p.id === initialProductId);
          } else if (initialProductName) {
            targetProd = fallbackList.find((p) => p.name.toLowerCase() === initialProductName.toLowerCase());
          }
          if (targetProd) {
            setSelectedProductId(targetProd.id);
            setProductSearch(`${targetProd.name}${targetProd.product_code ? ` (${targetProd.product_code})` : ""}`);
          } else if (!selectedProductId) {
            setSelectedProductId(fallbackList[0].id);
            setProductSearch(`${fallbackList[0].name}${fallbackList[0].product_code ? ` (${fallbackList[0].product_code})` : ""}`);
          }
        }
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    };

    fetchProductList();

    return () => {
      isMounted = false;
    };
  }, [initialProductName, initialProductId]);

  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    }
  }, [initialProductId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (productSelectorRef.current && !productSelectorRef.current.contains(e.target as Node)) {
        setIsProductListOpen(false);
        if (selectedProductId && products.length > 0) {
          const sel = products.find((p) => p.id === Number(selectedProductId));
          if (sel) {
            setProductSearch(`${sel.name}${sel.product_code ? ` (${sel.product_code})` : ""}`);
          }
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedProductId, products]);

  const handleSelectProduct = (prod: ProductOption) => {
    setSelectedProductId(prod.id);
    setProductSearch(`${prod.name}${prod.product_code ? ` (${prod.product_code})` : ""}`);
    setIsProductListOpen(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strictly numeric only, max 10 digits
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleAddressInput = (text: string) => {
    setDeliveryAddress(text);
    setIsAddressVerified(false);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (text.trim().length < 3) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    setIsSearchingLocation(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&addressdetails=1&limit=5`
        );
        if (response.ok) {
          const data = await response.json();
          setLocationSuggestions(data || []);
          setShowLocationDropdown((data || []).length > 0);
        }
      } catch (err) {
        console.error("Location search error:", err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 350);
  };

  const handleSelectLocation = (loc: { display_name: string; address?: any }) => {
    setDeliveryAddress(loc.display_name);
    setIsAddressVerified(true);
    setShowLocationDropdown(false);

    if (loc.address?.country && !buyerCountry) {
      setBuyerCountry(loc.address.country);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const emailTrimmed = email.trim();
    const phoneTrimmed = phone.trim();
    const taxIdTrimmed = taxId.trim();
    const portTrimmed = destinationPort.trim();
    const addressTrimmed = deliveryAddress.trim();

    if (
      !fullName.trim() ||
      !companyName.trim() ||
      !taxIdTrimmed ||
      !emailTrimmed ||
      !phoneTrimmed ||
      !portTrimmed ||
      !addressTrimmed ||
      !buyerCountry.trim()
    ) {
      setSubmitError("Please fill in all mandatory fields (*) including Business Tax ID, Destination Port and Delivery Address.");
      return;
    }

    if (taxIdTrimmed.length < 4) {
      setSubmitError("Please enter a valid Business Tax ID or Trade Registration Number (min 4 characters).");
      return;
    }

    if (addressTrimmed.length < 5) {
      setSubmitError("Please enter your complete warehouse or commercial market delivery address.");
      return;
    }

    // Email format validation (accepts valid domain and TLD, e.g. gmail.com, company.com)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailTrimmed)) {
      setSubmitError("Please enter a valid email address (e.g. name@company.com or yourname@gmail.com).");
      return;
    }

    // Phone number limitation: exactly 10 digits
    const phoneDigits = phoneTrimmed.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setSubmitError("Please enter a valid 10-digit mobile number (e.g. 9876543210).");
      return;
    }

    if (!selectedProductId) {
      setSubmitError("Please select a commodity product.");
      return;
    }

    const qtyNum = Number(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setSubmitError("Please enter a valid order quantity greater than 0.");
      return;
    }

    const formattedMessage = [
      `Destination Port: ${portTrimmed}`,
      `Delivery Address: ${addressTrimmed}`,
      `Business Tax / Trade License: ${taxIdTrimmed}`,
      businessWebsite.trim() ? `Website / Business Link: ${businessWebsite.trim()}` : "",
      `Location Verified on Map: ${isAddressVerified ? "Yes (Geocoded)" : "Manual Entry"}`,
      buyerCountry ? `Buyer Country: ${buyerCountry.trim()}` : "",
      incoterm ? `Preferred Incoterm: ${incoterm}` : "",
      additionalRequirements.trim() ? `Additional Requirements: ${additionalRequirements.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      buyer_name: fullName.trim(),
      company_name: companyName.trim(),
      tax_id: taxIdTrimmed,
      business_website: businessWebsite.trim(),
      destination_port: portTrimmed,
      delivery_address: addressTrimmed,
      is_address_verified: isAddressVerified,
      buyer_type: buyerType,
      email: emailTrimmed,
      phone: phoneTrimmed,
      buyer_country: buyerCountry.trim(),
      country: buyerCountry.trim(),
      message: formattedMessage,
      items: [
        {
          product_id: Number(selectedProductId),
          quantity: qtyNum,
          unit: unit,
          packaging_requested: packaging,
        },
      ],
    };

    try {
      setIsSubmitting(true);
      const res = await apiService.post(API_ENDPOINTS.ENQUIRIES, payload);
      if (res.data?.success) {
        const eid = res.data.enquiry_id || 1;
        const refId = res.data.reference_id || `ENQ-2026-${String(eid).padStart(4, "0")}`;
        const pinCode = res.data.secret_pin || "";
        setSubmittedEnquiryId(eid);
        setSubmittedReferenceId(refId);
        setSubmittedSecretPin(pinCode);
      } else {
        throw new Error(res.data?.error || "Submission failed. Please try again.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect to export desk. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProductObj = products.find((p) => p.id === Number(selectedProductId));

  const filteredProducts = products.filter((prod) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase().trim();
    const selectedFullStr = selectedProductObj
      ? `${selectedProductObj.name}${selectedProductObj.product_code ? ` (${selectedProductObj.product_code})` : ""}`.toLowerCase()
      : "";
    if (q === selectedFullStr) {
      return true;
    }
    const nameMatch = prod.name.toLowerCase().includes(q);
    const codeMatch = prod.product_code?.toLowerCase().includes(q);
    const catMatch = prod.category_name?.toLowerCase().includes(q);
    return nameMatch || codeMatch || catMatch;
  });

  return (
    <div className="enquiry-page-wrapper">
      <Navbar />

      <main className="enquiry-page-main">
        <div className="container" style={{ maxWidth: "1080px" }}>
          <div style={{ marginBottom: "16px" }}>
            <Link to="/product" className="btn btn-outline" style={{ padding: "8px 16px", minHeight: "36px", fontSize: "13px" }}>
              <ArrowLeft size={16} /> Back to Products
            </Link>
          </div>

          <div className="enquiry-modal-card page-card-mode">
            {/* Header */}
            <div className="enquiry-modal-header">
              <div className="enquiry-modal-header-text">
                <h2>Get a Price Quote</h2>
                <p>Submit your bulk commodity requirements to receive wholesale rates & specifications.</p>
              </div>
            </div>

            {/* Body */}
            <div className="enquiry-modal-body">
              {submittedEnquiryId ? (
                <div className="enquiry-success-view">
                  <div className="success-icon-wrap">
                    <CheckCircle2 size={54} color="#C9A451" />
                  </div>
                  <h3>Price Quote Request Sent!</h3>

                  {/* Reference ID & Secret PIN Credentials Box */}
                  <div className="enquiry-credentials-card">
                    <div className="credentials-card-header">
                      <KeyRound size={22} color="#C9A451" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <h4>Your Quotation Tracking Credentials</h4>
                        <p>
                          Save this Reference ID and Secret PIN. You can track your quotation status, KYC review, and batch rate sheet anytime without creating an account.
                        </p>
                      </div>
                    </div>

                    <div className="credentials-grid">
                      <div className="credential-box">
                        <span className="credential-label">Enquiry Reference ID</span>
                        <div className="credential-val-row">
                          <span className="credential-value">{submittedReferenceId}</span>
                          <button
                            type="button"
                            className="credential-copy-btn"
                            onClick={() => copyToClipboard(submittedReferenceId, "ref")}
                          >
                            {copiedField === "ref" ? <Check size={14} color="#2ECC71" /> : <Copy size={14} />}
                            {copiedField === "ref" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>

                      <div className="credential-box">
                        <span className="credential-label">Secret PIN (Password)</span>
                        <div className="credential-val-row">
                          <span className="credential-value pin-highlight">{submittedSecretPin}</span>
                          <button
                            type="button"
                            className="credential-copy-btn"
                            onClick={() => copyToClipboard(submittedSecretPin, "pin")}
                          >
                            {copiedField === "pin" ? <Check size={14} color="#2ECC71" /> : <Copy size={14} />}
                            {copiedField === "pin" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="credentials-footer-note">
                      🔒 You can change this Secret PIN at any time directly from the Tracking Desk.
                    </div>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <span className="enquiry-kyc-status-badge">
                      <ShieldCheck size={14} color="#C9A451" />
                      Verification Status: Pending B2B Trade KYC
                    </span>
                  </div>
                  <p className="success-intro">
                    Thank you, <strong>{fullName}</strong> ({companyName}). Your quote request has been received. Our trade desk will verify your business details and email the official wholesale quote within 24 hours.
                  </p>

                  <div className="enquiry-summary-box">
                    <div className="summary-item">
                      <span className="summary-label">Commodity:</span>
                      <strong>{selectedProductObj?.name || initialProductName || "Export Commodity"}</strong>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Volume:</span>
                      <span>{quantity} {unit}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Destination Port:</span>
                      <strong>{destinationPort}</strong>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Delivery Address:</span>
                      <span style={{ maxWidth: "60%", textAlign: "right" }}>
                        {deliveryAddress}
                        {isAddressVerified && (
                          <span className="enquiry-location-verified-badge" style={{ marginLeft: "6px" }}>
                            ✓ Map Verified
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Business Tax / Reg ID:</span>
                      <span>{taxId}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Incoterm / Packaging:</span>
                      <span>{incoterm} ({packaging})</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Destination Country:</span>
                      <span>{buyerCountry}</span>
                    </div>
                  </div>

                  <div className="success-guarantee-note">
                    <ShieldCheck size={18} color="#C9A451" />
                    <span>Our trade desk will verify your market/entity credentials and email the formal FOB/CIF rate sheet and verified batch COA within 24 hours.</span>
                  </div>

                  <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" }}>
                    <Link
                      to={`/track?ref=${encodeURIComponent(submittedReferenceId)}&pin=${encodeURIComponent(submittedSecretPin)}`}
                      className="btn btn-gold"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 20px", fontSize: "13.5px" }}
                    >
                      <Clock size={16} /> Track Quotation Live →
                    </Link>
                    <Link to="/product" className="btn btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 20px", fontSize: "13.5px" }}>
                      Browse Other Commodities
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="enquiry-trade-form">
                  {verifiedBuyerPhone ? (
                    <div className="enquiry-verified-phone-banner">
                      <span>
                        ✓ <strong>Verified Mobile Session:</strong> {verifiedBuyerPhone} (Quotation will be linked to your live tracking dashboard)
                      </span>
                      <Link to="/track" style={{ color: "#2ECC71", fontSize: "12px", textDecoration: "underline", fontWeight: 700 }}>
                        View Dashboard →
                      </Link>
                    </div>
                  ) : (
                    <div className="enquiry-track-hint-strip">
                      <span>
                        Already submitted a quote request? Track status and KYC review anytime via Mobile OTP.
                      </span>
                      <Link to="/track" style={{ color: "#D4AF37", fontSize: "12px", textDecoration: "underline", fontWeight: 700 }}>
                        Track Enquiry →
                      </Link>
                    </div>
                  )}

                  {submitError && (
                    <div className="enquiry-error-banner">
                      <AlertCircle size={18} />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Horizontal 2-Column Grid */}
                  <div className="enquiry-two-col-grid">
                    {/* Left Column: 1. Buyer & Business Verification */}
                    <div className="enquiry-form-section">
                      <h3 className="enquiry-section-title">1. Buyer & Business Information</h3>

                      <div className="enquiry-field-group">
                        <label htmlFor="page-fullname">Authorized Buyer Name *</label>
                        <input
                          id="page-fullname"
                          type="text"
                          required
                          placeholder="e.g. Anindita Das"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>

                      <div className="enquiry-field-group">
                        <label htmlFor="page-company">Company / Trading Entity Name *</label>
                        <input
                          id="page-company"
                          type="text"
                          required
                          placeholder="e.g. Al Khaleej Trading LLC"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>

                      <div className="enquiry-field-group">
                        <label htmlFor="page-taxid">Business Tax ID / Trade License *</label>
                        <input
                          id="page-taxid"
                          type="text"
                          required
                          placeholder="e.g. TRN-100293848190003"
                          value={taxId}
                          onChange={(e) => setTaxId(e.target.value)}
                        />
                      </div>

                      <div className="enquiry-field-group">
                        <label htmlFor="page-email">Business / Contact Email *</label>
                        <input
                          id="page-email"
                          type="email"
                          required
                          placeholder="e.g. name@company.com"
                          pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                          title="Please enter a valid email address with a domain (e.g. yourname@gmail.com)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="enquiry-sub-row">
                        <div className="enquiry-field-group">
                          <label htmlFor="page-phone">Phone / WhatsApp *</label>
                          <input
                            id="page-phone"
                            type="tel"
                            required
                            placeholder="e.g. 9876543210"
                            maxLength={10}
                            value={phone}
                            onChange={handlePhoneChange}
                          />
                        </div>

                        <div className="enquiry-field-group">
                          <label htmlFor="page-website">Website / Profile Link</label>
                          <input
                            id="page-website"
                            type="url"
                            placeholder="https://company.com"
                            value={businessWebsite}
                            onChange={(e) => setBusinessWebsite(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="enquiry-field-group">
                        <label htmlFor="page-additional">Additional Cargo / Quality Requirements</label>
                        <input
                          id="page-additional"
                          type="text"
                          placeholder="e.g. SGS quality inspection"
                          value={additionalRequirements}
                          onChange={(e) => setAdditionalRequirements(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Right Column: 2. Delivery Destination & Order Requirements */}
                    <div className="enquiry-form-section">
                      <h3 className="enquiry-section-title">2. Delivery Destination & Order Requirements</h3>

                      <div className="enquiry-field-group" ref={productSelectorRef}>
                        <label htmlFor="page-product-search">Commodity Product *</label>
                        <div className="enquiry-product-search-wrap">
                          <Search size={15} className="product-search-icon" />
                          <input
                            id="page-product-search"
                            type="text"
                            required
                            autoComplete="off"
                            placeholder={loadingProducts ? "Loading commodities..." : "Search commodity name or code..."}
                            value={productSearch}
                            onFocus={() => setIsProductListOpen(true)}
                            onChange={(e) => {
                              setProductSearch(e.target.value);
                              setIsProductListOpen(true);
                            }}
                          />
                          {productSearch ? (
                            <button
                              type="button"
                              className="product-search-clear-btn"
                              title="Clear & browse all"
                              onClick={() => {
                                setProductSearch("");
                                setSelectedProductId("");
                                setIsProductListOpen(true);
                              }}
                            >
                              <X size={14} />
                            </button>
                          ) : (
                            <ChevronDown
                              size={15}
                              className={`product-search-chevron ${isProductListOpen ? "open" : ""}`}
                            />
                          )}

                          {isProductListOpen && (
                            <ul className="enquiry-product-dropdown">
                              <li className="enquiry-product-dropdown-header">
                                <span>
                                  {productSearch.trim() &&
                                  (!selectedProductObj ||
                                    productSearch.toLowerCase() !==
                                      `${selectedProductObj.name}${selectedProductObj.product_code ? ` (${selectedProductObj.product_code})` : ""}`.toLowerCase())
                                    ? `Matching Commodities (${filteredProducts.length})`
                                    : `All Commodities (${products.length})`}
                                </span>
                              </li>
                              {filteredProducts.length === 0 ? (
                                <li className="enquiry-product-no-results">
                                  No commodity found matching &ldquo;{productSearch}&rdquo;
                                </li>
                              ) : (
                                filteredProducts.map((prod) => {
                                  const isSelected = prod.id === Number(selectedProductId);
                                  return (
                                    <li
                                      key={prod.id}
                                      className={`enquiry-product-item ${isSelected ? "selected" : ""}`}
                                      onClick={() => handleSelectProduct(prod)}
                                    >
                                      <div className="product-item-info">
                                        <span className="product-item-name">{prod.name}</span>
                                        {prod.product_code && (
                                          <span className="product-item-code">{prod.product_code}</span>
                                        )}
                                      </div>
                                      {prod.category_name && (
                                        <span className="product-item-category">{prod.category_name}</span>
                                      )}
                                    </li>
                                  );
                                })
                              )}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="enquiry-qty-unit-row">
                        <div className="enquiry-field-group flex-qty">
                          <label htmlFor="page-quantity">Order Volume *</label>
                          <input
                            id="page-quantity"
                            type="number"
                            min="0.1"
                            step="any"
                            required
                            placeholder="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                        </div>

                        <div className="enquiry-field-group flex-unit">
                          <label htmlFor="page-unit">Unit</label>
                          <select
                            id="page-unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                          >
                            <option value="Metric Ton">Metric Ton</option>
                            <option value="kg">Kilogram (kg)</option>
                            <option value="20ft FCL">20ft FCL Container (~24 MT)</option>
                            <option value="40ft FCL">40ft FCL Container (~26 MT)</option>
                          </select>
                        </div>
                      </div>

                      {/* Destination Discharge Port & Country */}
                      <div className="enquiry-sub-row">
                        <div className="enquiry-field-group">
                          <label htmlFor="page-port">Destination Port *</label>
                          <input
                            id="page-port"
                            type="text"
                            required
                            list="popular-ports"
                            placeholder="e.g. Jebel Ali Port"
                            value={destinationPort}
                            onChange={(e) => setDestinationPort(e.target.value)}
                          />
                          <datalist id="popular-ports">
                            <option value="Jebel Ali Port (Dubai, UAE)" />
                            <option value="Port of Nhava Sheva / JNPT (Mumbai, India)" />
                            <option value="Chittagong Port (Chattogram, Bangladesh)" />
                            <option value="Port of Rotterdam (Netherlands)" />
                            <option value="Port of Singapore" />
                            <option value="Port of Colombo (Sri Lanka)" />
                            <option value="King Abdulaziz Port, Dammam (Saudi Arabia)" />
                            <option value="Mombasa Port (Kenya)" />
                            <option value="Port of Felixstowe (UK)" />
                            <option value="Port of New York / New Jersey (USA)" />
                          </datalist>
                        </div>

                        <div className="enquiry-field-group">
                          <label htmlFor="page-country">Buyer Country *</label>
                          <input
                            id="page-country"
                            type="text"
                            required
                            placeholder="e.g. UAE"
                            value={buyerCountry}
                            onChange={(e) => setBuyerCountry(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Delivery Address & Market Autocomplete */}
                      <div className="enquiry-field-group" style={{ position: "relative" }}>
                        <label htmlFor="page-address" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>Company / Warehouse Delivery Address *</span>
                          {isAddressVerified && (
                            <span className="enquiry-location-verified-badge" style={{ margin: 0, padding: "2px 6px" }}>
                              <CheckCircle2 size={12} color="#2ECC71" /> Verified on Map
                            </span>
                          )}
                        </label>
                        <div className="enquiry-location-search-wrap">
                          <MapPin size={16} className="location-input-icon" />
                          <input
                            id="page-address"
                            type="text"
                            required
                            placeholder="e.g. Deira Spice Souk, Dubai"
                            value={deliveryAddress}
                            onChange={(e) => handleAddressInput(e.target.value)}
                            onFocus={() => {
                              if (locationSuggestions.length > 0) setShowLocationDropdown(true);
                            }}
                          />
                          {isSearchingLocation && <Loader2 size={16} className="location-input-spinner" />}

                          {showLocationDropdown && locationSuggestions.length > 0 && (
                            <ul className="enquiry-location-dropdown">
                              {locationSuggestions.map((loc, idx) => (
                                <li
                                  key={idx}
                                  className="enquiry-location-item"
                                  onClick={() => handleSelectLocation(loc)}
                                >
                                  <MapPin size={15} color="#C9A451" style={{ flexShrink: 0, marginTop: "2px" }} />
                                  <div className="location-item-text">
                                    <div className="location-item-main">{loc.display_name.split(",")[0]}</div>
                                    <div className="location-item-sub">{loc.display_name}</div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="enquiry-field-group">
                        <label className="group-label">Preferred Incoterm</label>
                        <div className="enquiry-radio-group horizontal-grid">
                          {[
                            { val: "FOB", label: "FOB (Buyer freight)" },
                            { val: "CIF", label: "CIF (Ins. & freight)" },
                            { val: "EXW", label: "EXW (Premises)" },
                          ].map((term) => (
                            <label key={term.val} className="enquiry-radio-label compact">
                              <input
                                type="radio"
                                name="incoterm-page"
                                value={term.val}
                                checked={incoterm === term.val}
                                onChange={(e) => setIncoterm(e.target.value)}
                              />
                              <span>{term.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="enquiry-field-group">
                        <label className="group-label">Preferred Packaging</label>
                        <div className="enquiry-radio-group horizontal-grid">
                          {[
                            { val: "25 kg bag", label: "25 kg bag" },
                            { val: "50 kg bag", label: "50 kg bag" },
                            { val: "Custom packaging", label: "Custom pack" },
                          ].map((opt) => (
                            <label key={opt.val} className="enquiry-radio-label compact">
                              <input
                                type="radio"
                                name="packaging-page"
                                value={opt.val}
                                checked={packaging === opt.val}
                                onChange={(e) => setPackaging(e.target.value)}
                              />
                              <span>{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="enquiry-footer-action-bar">
                    <button
                      type="submit"
                      className="enquiry-submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="spinner" />
                          Sending Quote Request...
                        </>
                      ) : (
                        <>
                          Get Price Quote <ArrowRight size={18} />
                        </>
                      )}
                    </button>

                    <p className="enquiry-disclaimer">
                      * Required fields. All information is securely encrypted and verified through the B2B Export Registry.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
