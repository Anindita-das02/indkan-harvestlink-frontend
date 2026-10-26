import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderTree,
  FileText,
  Activity,
  Settings,
  LogOut,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  MapPin,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RefreshCw,
  Upload,
  X,
  Download
} from "lucide-react";
import apiService from "../services/apiService";
import { API_ENDPOINTS } from "../config/api";
import Footer from "../components/Footer";
import { exportSingleEnquiryPDF, exportMultipleEnquiriesPDF } from "../utils/pdfExport";
import "../styles/admin.css";

type ProductItem = {
  id: number;
  category_id: number;
  category_name?: string;
  product_code: string;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  origin_country: string;
  quality_grade: string;
  minimum_order_quantity: number;
  moq_unit: string;
  stock_quantity: number;
  stock_unit: string;
  availability_status: string;
  packaging_options?: string[];
  image_url?: string;
  is_active: boolean;
  created_at?: string;
};

type CategoryItem = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  product_count?: number;
  is_active?: boolean;
};

type EnquiryItem = {
  id: number;
  reference_id: string;
  secret_pin: string;
  buyer_name: string;
  company_name: string;
  buyer_type: string;
  email: string;
  phone: string;
  country: string;
  destination_port: string;
  delivery_address: string;
  tax_id: string;
  business_website?: string;
  is_address_verified: boolean;
  status: string;
  status_label: string;
  status_color: string;
  step: number;
  admin_notes?: string;
  created_at: string;
  items?: Array<{
    id?: number;
    product_name?: string;
    product_code?: string;
    quantity: number;
    unit: string;
    packaging_requested?: string;
  }>;
};

type DashboardStats = {
  total_products: number;
  in_stock_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  on_request_products: number;
  total_enquiries: number;
  pending_enquiries: number;
  under_review_enquiries: number;
  quote_sent_enquiries: number;
  order_confirmed_enquiries?: number;
  in_shipment_enquiries?: number;
  completed_enquiries: number;
};

const resolveImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5001";
  const cleanBase = baseUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

export default function AdminPage() {
  // Authentication State
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem("indkan_admin_token"));
  const [adminUser, setAdminUser] = useState<any>(
    localStorage.getItem("indkan_admin_user") ? JSON.parse(localStorage.getItem("indkan_admin_user") || "{}") : null
  );

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Navigation Section
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "categories" | "enquiries">("dashboard");
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Global Data State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [recentHistory, setRecentHistory] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Filter & Search states
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [enquirySearch, setEnquirySearch] = useState("");
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>("all");

  // Selected Enquiry Drawer State
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [enquiryDetailHistory, setEnquiryDetailHistory] = useState<any[]>([]);
  const [newStatusInput, setNewStatusInput] = useState("");
  const [statusNoteInput, setStatusNoteInput] = useState("");
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Product Add / Edit Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category_id: 1,
    product_code: "",
    short_description: "",
    description: "",
    origin_country: "India",
    quality_grade: "Grade A Export",
    minimum_order_quantity: 1,
    moq_unit: "Metric Ton",
    stock_quantity: 100,
    stock_unit: "Metric Ton",
    availability_status: "in_stock",
    packaging_options: "25 kg bag, 50 kg PP bag, Bulk Container Liner",
    image_url: "",
    is_active: true
  });

  // Product Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [imageInputMode, setImageInputMode] = useState<"file" | "url">("file");

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageUploadError("Please select a valid image file (JPG, PNG, WEBP, SVG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageUploadError("File size exceeds 10MB limit.");
      return;
    }

    setIsUploadingImage(true);
    setImageUploadError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await apiService.post(API_ENDPOINTS.ADMIN_UPLOAD_IMAGE, formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data?.success && res.data.image_url) {
        setProductForm((prev) => ({ ...prev, image_url: res.data.image_url }));
        triggerFeedback("Product image uploaded successfully from your device!", "success");
      } else {
        setImageUploadError("Failed to upload image.");
      }
    } catch (err: any) {
      console.error("Upload image error:", err);
      const msg = err.response?.data?.error || "Error uploading image to server.";
      setImageUploadError(msg);
      triggerFeedback(msg, "error");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");

  // Change Password State
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [isChangingPw, setIsChangingPw] = useState(false);

  // Helper for auth headers
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${adminToken}` }
  });

  // Show transient feedback banner
  const triggerFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // 1. Initial Load on Authentication
  useEffect(() => {
    if (adminToken) {
      loadAllAdminData();
    }
  }, [adminToken]);

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      const [resStats, resProds, resCats, resEnqs] = await Promise.all([
        apiService.get(API_ENDPOINTS.ADMIN_STATS, getAuthHeader()),
        apiService.get(API_ENDPOINTS.ADMIN_PRODUCTS, getAuthHeader()),
        apiService.get(API_ENDPOINTS.ADMIN_CATEGORIES, getAuthHeader()),
        apiService.get(API_ENDPOINTS.ADMIN_ENQUIRIES, getAuthHeader())
      ]);

      if (resStats.data?.success) {
        setStats(resStats.data.stats);
        setRecentEnquiries(resStats.data.recent_enquiries || []);
        setRecentHistory(resStats.data.recent_history || []);
      }
      if (resProds.data?.success) {
        setProducts(resProds.data.products || []);
      }
      if (resCats.data?.success) {
        setCategories(resCats.data.categories || []);
      }
      if (resEnqs.data?.success) {
        setEnquiries(resEnqs.data.enquiries || []);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        console.error("Failed to load admin data:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await apiService.post(API_ENDPOINTS.ADMIN_LOGIN, {
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword.trim()
      });

      if (res.data?.success && res.data.token) {
        const token = res.data.token;
        const user = res.data.admin;
        localStorage.setItem("indkan_admin_token", token);
        localStorage.setItem("indkan_admin_user", JSON.stringify(user));
        setAdminToken(token);
        setAdminUser(user);
        triggerFeedback(`Welcome, ${user.name}! Admin console active.`);
      } else {
        throw new Error(res.data?.error || "Login failed.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Invalid credentials.";
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("indkan_admin_token");
    localStorage.removeItem("indkan_admin_user");
    setAdminToken(null);
    setAdminUser(null);
  };

  // 3. Product Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category_id: categories.length > 0 ? categories[0].id : 1,
      product_code: "",
      short_description: "",
      description: "",
      origin_country: "India",
      quality_grade: "Grade A Export",
      minimum_order_quantity: 1,
      moq_unit: "Metric Ton",
      stock_quantity: 100,
      stock_unit: "Metric Ton",
      availability_status: "in_stock",
      packaging_options: "25 kg bag, 50 kg PP bag, Bulk Container Liner",
      image_url: "",
      is_active: true
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: ProductItem) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category_id: p.category_id,
      product_code: p.product_code,
      short_description: p.short_description || "",
      description: p.description || "",
      origin_country: p.origin_country || "India",
      quality_grade: p.quality_grade || "Grade A Export",
      minimum_order_quantity: p.minimum_order_quantity,
      moq_unit: p.moq_unit,
      stock_quantity: p.stock_quantity,
      stock_unit: p.stock_unit,
      availability_status: p.availability_status,
      packaging_options: Array.isArray(p.packaging_options) ? p.packaging_options.join(", ") : "25 kg bag, 50 kg PP bag",
      image_url: p.image_url || "",
      is_active: p.is_active
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        packaging_options: productForm.packaging_options.split(",").map((s) => s.trim()).filter(Boolean)
      };

      if (editingProduct) {
        await apiService.put(API_ENDPOINTS.ADMIN_PRODUCT_BY_ID(editingProduct.id), payload, getAuthHeader());
        triggerFeedback(`Product "${productForm.name}" updated successfully.`);
      } else {
        await apiService.post(API_ENDPOINTS.ADMIN_PRODUCTS, payload, getAuthHeader());
        triggerFeedback(`New product "${productForm.name}" added to export catalogue.`);
      }
      setShowProductModal(false);
      loadAllAdminData();
    } catch (err: any) {
      triggerFeedback(err.response?.data?.error || "Failed to save product.", "error");
    }
  };

  const handleToggleProductActive = async (productId: number) => {
    try {
      const res = await apiService.patch(API_ENDPOINTS.ADMIN_PRODUCT_TOGGLE(productId), {}, getAuthHeader());
      if (res.data?.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, is_active: res.data.is_active } : p))
        );
        triggerFeedback(res.data.is_active ? "Product activated on storefront." : "Product deactivated/hidden.");
      }
    } catch (err: any) {
      triggerFeedback("Failed to toggle product status.", "error");
    }
  };

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete or archive product "${productName}"?`)) return;
    try {
      await apiService.delete(API_ENDPOINTS.ADMIN_PRODUCT_BY_ID(productId), getAuthHeader());
      triggerFeedback(`Product "${productName}" deleted.`);
      loadAllAdminData();
    } catch (err: any) {
      triggerFeedback(err.response?.data?.error || "Cannot delete product.", "error");
    }
  };

  // 4. Quick Availability Update Handler
  const handleQuickProductAvailability = async (productId: number, newAvailability: string) => {
    try {
      const res = await apiService.patch(
        API_ENDPOINTS.ADMIN_PRODUCT_STOCK(productId),
        { availability_status: newAvailability },
        getAuthHeader()
      );
      if (res.data?.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, availability_status: newAvailability }
              : p
          )
        );
        triggerFeedback(`Product availability updated to "${newAvailability.replace("_", " ").toUpperCase()}"`);
      }
    } catch (err: any) {
      triggerFeedback("Failed to update availability.", "error");
    }
  };

  // 5. Category Handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    try {
      await apiService.post(
        API_ENDPOINTS.ADMIN_CATEGORIES,
        { name: categoryName.trim(), description: categoryDesc.trim() },
        getAuthHeader()
      );
      triggerFeedback(`Category "${categoryName}" created.`);
      setShowCategoryModal(false);
      setCategoryName("");
      setCategoryDesc("");
      loadAllAdminData();
    } catch (err: any) {
      triggerFeedback("Failed to create category.", "error");
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await apiService.delete(API_ENDPOINTS.ADMIN_CATEGORY_BY_ID(id), getAuthHeader());
      triggerFeedback(`Category "${name}" deleted.`);
      loadAllAdminData();
    } catch (err: any) {
      triggerFeedback(err.response?.data?.error || "Cannot delete category with products.", "error");
    }
  };

  // 6. Enquiry & Tracking Handlers
  const handleOpenEnquiryDetail = async (enq: EnquiryItem) => {
    setSelectedEnquiry(enq);
    setNewStatusInput(enq.status);
    setAdminNotesInput(enq.admin_notes || "");
    setStatusNoteInput("");
    try {
      const res = await apiService.get(API_ENDPOINTS.ADMIN_ENQUIRY_BY_ID(enq.id), getAuthHeader());
      if (res.data?.success && res.data.enquiry) {
        setSelectedEnquiry(res.data.enquiry);
        setEnquiryDetailHistory(res.data.enquiry.history || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateEnquiryStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setIsUpdatingStatus(true);
    try {
      const res = await apiService.patch(
        API_ENDPOINTS.ADMIN_ENQUIRY_STATUS(selectedEnquiry.id),
        {
          status: newStatusInput,
          note: statusNoteInput.trim() || `Status updated to ${newStatusInput} by Admin.`
        },
        getAuthHeader()
      );

      if (res.data?.success) {
        triggerFeedback(`Enquiry ${selectedEnquiry.reference_id} status updated to "${newStatusInput}". Live on buyer tracking!`);
        // Refresh detail
        handleOpenEnquiryDetail(selectedEnquiry);
        loadAllAdminData();
      }
    } catch (err: any) {
      triggerFeedback(err.response?.data?.error || "Failed to update enquiry status.", "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveAdminNotes = async () => {
    if (!selectedEnquiry) return;
    try {
      await apiService.post(
        API_ENDPOINTS.ADMIN_ENQUIRY_NOTES(selectedEnquiry.id),
        { admin_notes: adminNotesInput },
        getAuthHeader()
      );
      triggerFeedback("Admin internal notes saved.");
      loadAllAdminData();
    } catch (err) {
      triggerFeedback("Failed to save notes.", "error");
    }
  };

  // 7. Password Change Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      triggerFeedback("New password and confirm password do not match.", "error");
      return;
    }
    setIsChangingPw(true);
    try {
      const res = await apiService.post(
        API_ENDPOINTS.ADMIN_CHANGE_PASSWORD,
        { current_password: currentPw, new_password: newPw },
        getAuthHeader()
      );
      if (res.data?.success) {
        triggerFeedback("Admin password updated successfully.");
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
        setShowSettingsModal(false);
      }
    } catch (err: any) {
      triggerFeedback(err.response?.data?.error || "Password change failed.", "error");
    } finally {
      setIsChangingPw(false);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase();
    const matchesQ = !q || p.name.toLowerCase().includes(q) || p.product_code.toLowerCase().includes(q) || p.origin_country.toLowerCase().includes(q);
    const matchesCat = selectedCategoryFilter === "all" || String(p.category_id) === selectedCategoryFilter;
    return matchesQ && matchesCat;
  });

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter((e) => {
    const q = enquirySearch.toLowerCase();
    const matchesQ =
      !q ||
      e.reference_id.toLowerCase().includes(q) ||
      e.buyer_name.toLowerCase().includes(q) ||
      e.company_name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.destination_port.toLowerCase().includes(q);

    const matchesStatus =
      enquiryStatusFilter === "all" ||
      e.status === enquiryStatusFilter ||
      (enquiryStatusFilter === "pending" && (e.status === "pending" || e.status === "submitted"));

    return matchesQ && matchesStatus;
  });

  // Batch Enquiry Selection State for PDF Export
  const [selectedEnquiryIds, setSelectedEnquiryIds] = useState<number[]>([]);

  const toggleSelectEnquiry = (id: number) => {
    setSelectedEnquiryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllEnquiries = () => {
    if (selectedEnquiryIds.length === filteredEnquiries.length) {
      setSelectedEnquiryIds([]);
    } else {
      setSelectedEnquiryIds(filteredEnquiries.map((e) => e.id));
    }
  };

  const handleExportSelectedPDF = () => {
    const selected = filteredEnquiries.filter((e) => selectedEnquiryIds.includes(e.id));
    if (selected.length === 0) {
      triggerFeedback("Please select at least one enquiry to export.", "error");
      return;
    }
    if (selected.length === 1) {
      exportSingleEnquiryPDF(selected[0]);
      triggerFeedback(`Exported Dossier PDF for Enquiry ${selected[0].reference_id}`);
    } else {
      exportMultipleEnquiriesPDF(selected);
      triggerFeedback(`Exported batch PDF containing ${selected.length} enquiries.`);
    }
  };

  const handleExportAllVisiblePDF = () => {
    if (filteredEnquiries.length === 0) {
      triggerFeedback("No enquiries available to export.", "error");
      return;
    }
    exportMultipleEnquiriesPDF(filteredEnquiries);
    triggerFeedback(`Exported batch master PDF for all ${filteredEnquiries.length} visible enquiries.`);
  };

  // =========================================================================
  // VIEW: ADMIN LOGIN SCREEN (If not authenticated)
  // =========================================================================
  if (!adminToken) {
    return (
      <div className="admin-page-root">
        <div className="admin-login-wrapper">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <div className="admin-login-logo-wrap">
                <ShieldCheck size={32} />
              </div>
              <h2>INDKAN Export Trade Admin</h2>
              <p>Authorized personnel command console & logistics trade desk.</p>
            </div>

            <div className="admin-login-body">
              {loginError && (
                <div className="enquiry-error-banner" style={{ marginBottom: "16px" }}>
                  <AlertCircle size={18} />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="admin-form-group">
                  <label>Administrator Email *</label>
                  <div className="track-pin-input-wrap">
                    <Mail size={16} className="track-pin-icon-left" />
                    <input
                      type="email"
                      required
                      placeholder="admin@indkan.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Admin Password *</label>
                  <div className="track-pin-input-wrap">
                    <Lock size={16} className="track-pin-icon-left" />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="track-pin-toggle-right"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-gold"
                  disabled={isLoggingIn}
                  style={{ width: "100%", padding: "12px", marginTop: "10px", fontSize: "14px", fontWeight: 700 }}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 size={18} className="spinner" /> Authenticating...
                    </>
                  ) : (
                    "Sign In to Admin Console →"
                  )}
                </button>

                <div style={{ textAlign: "center", marginTop: "18px" }}>
                  <Link to="/" style={{ color: "#8FA496", fontSize: "12px", textDecoration: "underline" }}>
                    ← Return to Public Website
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // =========================================================================
  // VIEW: AUTHENTICATED ADMIN COMMAND CENTER
  // =========================================================================
  return (
    <div className="admin-page-root">
      {/* 1. TOP ADMIN NAVBAR */}
      <header className="admin-navbar-top">
        <div className="container admin-navbar-container">
          {/* Brand */}
          <div className="admin-nav-brand">
            <Link to="/" className="admin-brand-link" title="INDKAN Public Site">
              <div className="admin-brand-icon">
                <ShieldCheck size={20} />
              </div>
              <div className="admin-brand-text">
                <h3>INDKAN ADMIN</h3>
                <span>Export Trade Desk</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="admin-top-nav-links">
            <button
              type="button"
              className={`admin-top-nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
              title="Dashboard"
            >
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className={`admin-top-nav-btn ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
              title="Products"
            >
              <Package size={17} />
              <span>Products</span>
            </button>

            <button
              type="button"
              className={`admin-top-nav-btn ${activeTab === "categories" ? "active" : ""}`}
              onClick={() => setActiveTab("categories")}
              title="Categories"
            >
              <FolderTree size={17} />
              <span>Categories</span>
            </button>

            <button
              type="button"
              className={`admin-top-nav-btn ${activeTab === "enquiries" ? "active" : ""}`}
              onClick={() => setActiveTab("enquiries")}
              title="Buyer Enquiries"
            >
              <FileText size={17} />
              <span>Buyer Enquiries</span>
            </button>
          </nav>

          {/* User Controls */}
          <div className="admin-top-user-controls">
            <button
              type="button"
              className="admin-action-btn"
              onClick={loadAllAdminData}
              title="Refresh Data"
            >
              <RefreshCw size={14} /> Refresh
            </button>

            <div className="admin-user-info-chip">
              <span className="admin-user-name">{adminUser?.name || "Super Admin"}</span>
              <span className="admin-user-email">admin@indkan.com</span>
            </div>

            <button
              type="button"
              className="admin-user-action-btn settings"
              onClick={() => setShowSettingsModal(true)}
              title="Settings & Profile"
              aria-label="Settings & Profile"
            >
              <Settings size={17} />
            </button>

            <button
              type="button"
              className="admin-user-action-btn logout"
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. SUBHEADER BANNER */}
      <div className="admin-page-title-banner">
        <div className="container admin-title-inner">
          <h2>
            {activeTab === "dashboard" && "Executive Dashboard Overview"}
            {activeTab === "products" && "Export Product Catalogue Management"}
            {activeTab === "categories" && "Commodity Category Classifications"}
            {activeTab === "enquiries" && "Commercial Buyer Quotation Requests & Tracking"}
          </h2>
          <div className="admin-badge-online">
            <span className="pulse-dot"></span> Live Terminal
          </div>
        </div>
      </div>

      {/* FEEDBACK TOAST BANNER */}
      {feedbackMessage && (
        <div
          style={{
            padding: "10px 28px",
            background: feedbackMessage.type === "success" ? "#DCFCE7" : "#FEE2E2",
            color: feedbackMessage.type === "success" ? "#166534" : "#991B1B",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            borderBottom: feedbackMessage.type === "success" ? "1px solid #86EFAC" : "1px solid #FCA5A5"
          }}
        >
          {feedbackMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* 3. MAIN CONTENT AREA */}
      <main className="admin-main-body">
        <div className="container">
          {isLoading && (
            <div style={{ textAlign: "center", padding: "12px", color: "#C9A451", fontSize: "13px" }}>
              <Loader2 size={16} className="spinner" style={{ display: "inline", marginRight: "6px" }} />
              Syncing export database...
            </div>
          )}

          {/* TAB: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div>
              {/* KPI Grid */}
              <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                  <div className="admin-kpi-icon" style={{ background: "rgba(201, 164, 81, 0.15)", color: "#C9A451" }}>
                    <Package size={24} />
                  </div>
                  <div className="admin-kpi-info">
                    <h4>Total Products</h4>
                    <div className="kpi-num">{stats?.total_products || 0}</div>
                    <div className="kpi-sub">Active export commodities</div>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-icon" style={{ background: "rgba(46, 204, 113, 0.15)", color: "#2ECC71" }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="admin-kpi-info">
                    <h4>In Stock</h4>
                    <div className="kpi-num">{stats?.in_stock_products || 0}</div>
                    <div className="kpi-sub">Ready for container dispatch</div>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-icon" style={{ background: "rgba(243, 156, 18, 0.15)", color: "#F39C12" }}>
                    <Layers size={24} />
                  </div>
                  <div className="admin-kpi-info">
                    <h4>Low / Out of Stock</h4>
                    <div className="kpi-num">
                      {(stats?.low_stock_products || 0) + (stats?.out_of_stock_products || 0)}
                    </div>
                    <div className="kpi-sub">{stats?.on_request_products || 0} on request</div>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-icon" style={{ background: "rgba(52, 152, 219, 0.15)", color: "#3498DB" }}>
                    <FileText size={24} />
                  </div>
                  <div className="admin-kpi-info">
                    <h4>Pending Enquiries</h4>
                    <div className="kpi-num">{(stats?.pending_enquiries || 0) + (stats?.under_review_enquiries || 0)}</div>
                    <div className="kpi-sub">{stats?.under_review_enquiries || 0} under KYC review</div>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981" }}>
                    <Activity size={24} />
                  </div>
                  <div className="admin-kpi-info">
                    <h4>Orders & Shipments</h4>
                    <div className="kpi-num">{(stats?.order_confirmed_enquiries || 0) + (stats?.in_shipment_enquiries || 0)}</div>
                    <div className="kpi-sub">{stats?.in_shipment_enquiries || 0} active in transit</div>
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Recent Enquiries & Recent Activity Log */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px" }}>
                {/* Left Card: Recent Enquiries */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>
                      <Clock size={16} color="#C9A451" /> Recent Buyer Quotation Requests
                    </h3>
                    <button
                      type="button"
                      className="admin-action-btn"
                      onClick={() => setActiveTab("enquiries")}
                    >
                      View All ({enquiries.length})
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Ref ID</th>
                          <th>Buyer / Entity</th>
                          <th>Country</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentEnquiries.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>No enquiries submitted yet.</td>
                          </tr>
                        ) : (
                          recentEnquiries.map((enq) => (
                            <tr key={enq.id}>
                              <td style={{ fontWeight: 700, color: "#8F7226" }}>{enq.reference_id}</td>
                              <td>
                                <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{enq.buyer_name}</div>
                                <div style={{ fontSize: "11.5px", color: "var(--admin-text-muted)" }}>{enq.company_name}</div>
                              </td>
                              <td>{enq.country || "International"}</td>
                              <td>
                                <span className={`status-badge status-${enq.status}`}>
                                  {enq.status.replace("_", " ").toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="admin-action-btn"
                                  onClick={() => {
                                    const fullObj = enquiries.find((e) => e.id === enq.id) || enq;
                                    handleOpenEnquiryDetail(fullObj);
                                  }}
                                >
                                  Review
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Card: Status Change Activity Feed */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>
                      <Activity size={16} color="#C9A451" /> Trade Status Audit Log
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {recentHistory.length === 0 ? (
                      <div style={{ color: "#8FA496", fontSize: "13px", padding: "16px 0" }}>No status updates recorded yet.</div>
                    ) : (
                      recentHistory.map((h) => (
                        <div
                          key={h.id}
                          style={{
                            padding: "10px 14px",
                            background: "var(--admin-surface-2)",
                            borderLeft: "3px solid var(--admin-gold)",
                            borderRadius: "4px"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--admin-text-muted)", marginBottom: "4px" }}>
                            <span><strong>{h.reference_id}</strong> ({h.buyer_name})</span>
                            <span>{h.created_at}</span>
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--admin-text-main)" }}>
                            Status moved to <strong style={{ color: "#8F7226" }}>{h.new_status.toUpperCase()}</strong>
                          </div>
                          {h.note && (
                            <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)", marginTop: "4px", fontStyle: "italic" }}>
                              &ldquo;{h.note}&rdquo;
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS MANAGEMENT */}
          {activeTab === "products" && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                  <h3>
                    <Package size={18} color="#C9A451" /> Export Product Catalogue ({filteredProducts.length})
                  </h3>

                  {/* Search Input */}
                  <div style={{ position: "relative", minWidth: "240px" }}>
                    <Search size={15} style={{ position: "absolute", left: "10px", top: "11px", color: "var(--admin-text-muted)" }} />
                    <input
                      type="text"
                      placeholder="Search commodities..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      style={{
                        padding: "8px 12px 8px 32px",
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: "6px",
                        color: "var(--admin-text-main)",
                        fontSize: "13px"
                      }}
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      background: "var(--admin-surface)",
                      border: "1px solid var(--admin-border)",
                      borderRadius: "6px",
                      color: "var(--admin-text-main)",
                      fontSize: "13px"
                    }}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={handleOpenAddProduct}
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", fontSize: "13px" }}
                >
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Origin & Grade</th>
                      <th>MOQ</th>
                      <th>Availability</th>
                      <th>Stock Qty</th>
                      <th>Store Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {p.image_url ? (
                              <img
                                src={resolveImageUrl(p.image_url)}
                                alt={p.name}
                                style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }}
                              />
                            ) : (
                              <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "var(--admin-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-gold)" }}>
                                <Package size={18} />
                              </div>
                            )}
                            <div>
                              <div style={{ fontWeight: 700, color: "var(--admin-text-main)" }}>{p.name}</div>
                              <div style={{ fontSize: "11.5px", color: "var(--admin-text-muted)" }}>{p.product_code}</div>
                            </div>
                          </div>
                        </td>
                        <td>{p.category_name}</td>
                        <td>
                          <div>{p.origin_country}</div>
                          <div style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>{p.quality_grade}</div>
                        </td>
                        <td>{p.minimum_order_quantity} {p.moq_unit}</td>
                        <td>
                          <select
                            value={p.availability_status}
                            onChange={(e) => handleQuickProductAvailability(p.id, e.target.value)}
                            className={`status-badge status-${p.availability_status}`}
                            style={{
                              cursor: "pointer",
                              border: "1px solid rgba(0, 0, 0, 0.1)",
                              borderRadius: "20px",
                              padding: "4px 8px",
                              fontWeight: 700,
                              fontSize: "11px",
                              outline: "none"
                            }}
                            title="Click to update stock availability directly"
                          >
                            <option value="in_stock" style={{ background: "#FFFFFF", color: "#15803D" }}>IN STOCK</option>
                            <option value="low_stock" style={{ background: "#FFFFFF", color: "#B45309" }}>LOW STOCK</option>
                            <option value="out_of_stock" style={{ background: "#FFFFFF", color: "#B91C1C" }}>OUT OF STOCK</option>
                            <option value="on_request" style={{ background: "#FFFFFF", color: "#854D0E" }}>ON REQUEST</option>
                          </select>
                        </td>
                        <td style={{ fontWeight: 600 }}>{p.stock_quantity} {p.stock_unit}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleToggleProductActive(p.id)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "12px",
                              fontSize: "11.5px",
                              fontWeight: 700,
                              cursor: "pointer",
                              border: "none",
                              background: p.is_active ? "rgba(46, 204, 113, 0.2)" : "rgba(231, 76, 60, 0.2)",
                              color: p.is_active ? "#2ECC71" : "#E74C3C"
                            }}
                          >
                            {p.is_active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              type="button"
                              className="admin-action-btn"
                              title="Edit product"
                              onClick={() => handleOpenEditProduct(p)}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn delete"
                              title="Delete/archive product"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="admin-card" style={{ maxWidth: "920px", margin: "16px auto 30px" }}>
              <div className="admin-card-header">
                <h3>
                  <FolderTree size={18} color="#C9A451" /> Commodity Categories ({categories.length})
                </h3>
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => setShowCategoryModal(true)}
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", fontSize: "13px" }}
                >
                  <Plus size={16} /> Add Category
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Category Name</th>
                      <th>Slug</th>
                      <th>Description</th>
                      <th>Products</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id}>
                        <td>#{c.id}</td>
                        <td style={{ fontWeight: 700, color: "var(--admin-text-main)" }}>{c.name}</td>
                        <td style={{ color: "var(--admin-text-muted)" }}>{c.slug}</td>
                        <td>{c.description || "—"}</td>
                        <td>
                          <span className="admin-nav-badge">{c.product_count || 0} items</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="admin-action-btn delete"
                            title="Delete category"
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: BUYER ENQUIRIES */}
          {activeTab === "enquiries" && (
            <div className="admin-card">
              <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                  <h3>
                    <FileText size={18} color="#C9A451" /> Commercial Export Quotations ({filteredEnquiries.length})
                  </h3>

                  {/* Search */}
                  <div style={{ position: "relative", minWidth: "240px" }}>
                    <Search size={15} style={{ position: "absolute", left: "10px", top: "11px", color: "var(--admin-text-muted)" }} />
                    <input
                      type="text"
                      placeholder="Search Ref ID, buyer, company..."
                      value={enquirySearch}
                      onChange={(e) => setEnquirySearch(e.target.value)}
                      style={{
                        padding: "8px 12px 8px 32px",
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: "6px",
                        color: "var(--admin-text-main)",
                        fontSize: "13px"
                      }}
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={enquiryStatusFilter}
                    onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      background: "var(--admin-surface)",
                      border: "1px solid var(--admin-border)",
                      borderRadius: "6px",
                      color: "var(--admin-text-main)",
                      fontSize: "13px"
                    }}
                  >
                    <option value="all">All Stages</option>
                    <option value="pending">1. Submitted</option>
                    <option value="under_review">2. Under Review</option>
                    <option value="quote_sent">3. Quotation Sent</option>
                    <option value="accepted">4. Quotation Accepted</option>
                    <option value="order_confirmed">5. Order Confirmed</option>
                    <option value="processing">6. Processing</option>
                    <option value="packed">7. Packed</option>
                    <option value="shipped">8. Shipped</option>
                    <option value="delivered">9. Delivered</option>
                    <option value="cancelled">Closed / Rejected</option>
                  </select>
                </div>

                {/* PDF Batch Export Action Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  {selectedEnquiryIds.length > 0 ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12.5px", color: "#8F7226", fontWeight: 700 }}>
                        {selectedEnquiryIds.length} selected
                      </span>
                      <button
                        type="button"
                        className="btn btn-gold"
                        style={{ padding: "7px 14px", fontSize: "12.5px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                        onClick={handleExportSelectedPDF}
                        title="Download multi-enquiry consolidated batch PDF report"
                      >
                        <Download size={14} /> Export Selected ({selectedEnquiryIds.length}) PDF
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ padding: "7px 10px", fontSize: "12px" }}
                        onClick={() => setSelectedEnquiryIds([])}
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ padding: "7px 14px", fontSize: "12.5px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      onClick={handleExportAllVisiblePDF}
                      title="Export all visible enquiries into a consolidated master PDF report"
                    >
                      <Download size={14} /> Export All ({filteredEnquiries.length}) as PDF
                    </button>
                  )}
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: "40px", textAlign: "center" }}>
                        <input
                          type="checkbox"
                          aria-label="Select all enquiries"
                          checked={filteredEnquiries.length > 0 && selectedEnquiryIds.length === filteredEnquiries.length}
                          onChange={toggleSelectAllEnquiries}
                          style={{ cursor: "pointer", width: "15px", height: "15px" }}
                          title="Select / Deselect all visible enquiries"
                        />
                      </th>
                      <th>Reference ID</th>
                      <th>Secret PIN</th>
                      <th>Buyer Name</th>
                      <th>Entity & Tax ID</th>
                      <th>Destination Port</th>
                      <th>Submitted On</th>
                      <th>Current Stage</th>
                      <th style={{ minWidth: "180px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnquiries.map((enq) => {
                      const isSelected = selectedEnquiryIds.includes(enq.id);
                      return (
                        <tr key={enq.id} style={{ background: isSelected ? "rgba(201, 164, 81, 0.08)" : undefined }}>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              aria-label={`Select enquiry ${enq.reference_id}`}
                              checked={isSelected}
                              onChange={() => toggleSelectEnquiry(enq.id)}
                              style={{ cursor: "pointer", width: "15px", height: "15px" }}
                            />
                          </td>
                          <td>
                            <span style={{ fontWeight: 800, color: "#8F7226", letterSpacing: "0.5px" }}>
                              {enq.reference_id}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontFamily: "monospace", color: "#8F7226", background: "rgba(201, 164, 81, 0.15)", padding: "2px 6px", borderRadius: "4px" }}>
                              {enq.secret_pin}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{enq.buyer_name}</div>
                            <div style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>{enq.email}</div>
                          </td>
                          <td>
                            <div style={{ color: "var(--admin-text-main)" }}>{enq.company_name}</div>
                            <div style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>{enq.tax_id}</div>
                          </td>
                          <td>{enq.destination_port || "—"}</td>
                          <td>{enq.created_at}</td>
                          <td>
                            <span className={`status-badge status-${enq.status}`}>
                              {enq.status_label || enq.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <button
                                type="button"
                                className="btn btn-gold"
                                style={{ padding: "5px 10px", fontSize: "11.5px", minHeight: "28px" }}
                                onClick={() => handleOpenEnquiryDetail(enq)}
                              >
                                Manage Stage →
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline"
                                style={{
                                  padding: "5px 10px",
                                  fontSize: "11.5px",
                                  minHeight: "28px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px"
                                }}
                                onClick={() => {
                                  exportSingleEnquiryPDF(enq);
                                  triggerFeedback(`Exported PDF for ${enq.reference_id}`);
                                }}
                                title="Download official dossier PDF for this enquiry"
                              >
                                <Download size={13} /> PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 4. MODAL: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Export Product"}</h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                style={{ background: "none", border: "none", color: "#8FA496", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-modal-body">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Red Lentils (Masoor Dal)"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Category *</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: Number(e.target.value) })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Product Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. IK-PUL-001"
                    value={productForm.product_code}
                    onChange={(e) => setProductForm({ ...productForm, product_code: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Origin Country</label>
                  <input
                    type="text"
                    placeholder="e.g. India"
                    value={productForm.origin_country}
                    onChange={(e) => setProductForm({ ...productForm, origin_country: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Quality Grade</label>
                  <input
                    type="text"
                    placeholder="e.g. Premium Grade A Sortex"
                    value={productForm.quality_grade}
                    onChange={(e) => setProductForm({ ...productForm, quality_grade: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Availability Status *</label>
                  <select
                    value={productForm.availability_status}
                    onChange={(e) => setProductForm({ ...productForm, availability_status: e.target.value })}
                  >
                    <option value="in_stock">In Stock (Ready)</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="on_request">Available On Request</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Available Stock Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.stock_quantity}
                    onChange={(e) => setProductForm({ ...productForm, stock_quantity: Number(e.target.value) })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Stock & MOQ Unit</label>
                  <select
                    value={productForm.stock_unit}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock_unit: e.target.value, moq_unit: e.target.value })
                    }
                  >
                    <option value="Metric Ton">Metric Ton</option>
                    <option value="kg">kg</option>
                    <option value="Quintal">Quintal</option>
                    <option value="Bags">Bags</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Packaging Options (comma separated)</label>
                <input
                  type="text"
                  placeholder="25 kg bag, 50 kg PP bag, Bulk Container Liner"
                  value={productForm.packaging_options}
                  onChange={(e) => setProductForm({ ...productForm, packaging_options: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ margin: 0 }}>Product Image *</label>
                  <div className="image-mode-toggle">
                    <button
                      type="button"
                      className={`image-toggle-btn ${imageInputMode === "file" ? "active" : ""}`}
                      onClick={() => setImageInputMode("file")}
                    >
                      <Upload size={13} />
                      From Device
                    </button>
                    <button
                      type="button"
                      className={`image-toggle-btn ${imageInputMode === "url" ? "active" : ""}`}
                      onClick={() => setImageInputMode("url")}
                    >
                      <ExternalLink size={13} />
                      Web URL
                    </button>
                  </div>
                </div>

                {imageInputMode === "file" ? (
                  <div className="product-image-uploader">
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      accept="image/png,image/jpeg,image/webp,image/jpg,image/svg+xml"
                      onChange={handleImageFileUpload}
                    />

                    {productForm.image_url ? (
                      <div className="image-preview-card">
                        <img
                          src={resolveImageUrl(productForm.image_url)}
                          alt="Preview"
                          className="image-preview-thumb"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=700&q=80";
                          }}
                        />
                        <div className="image-preview-details">
                          <span className="image-preview-badge">
                            <CheckCircle2 size={13} /> Image Ready
                          </span>
                          <span className="image-preview-path" title={productForm.image_url}>
                            {productForm.image_url}
                          </span>
                          <div className="image-preview-actions">
                            <button
                              type="button"
                              className="btn-upload-action"
                              disabled={isUploadingImage}
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload size={13} />
                              {isUploadingImage ? "Uploading..." : "Change Image"}
                            </button>
                            <button
                              type="button"
                              className="btn-upload-action btn-danger-action"
                              disabled={isUploadingImage}
                              onClick={() => setProductForm({ ...productForm, image_url: "" })}
                            >
                              <Trash2 size={13} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`image-dropzone ${isUploadingImage ? "uploading" : ""}`}
                        onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                      >
                        {isUploadingImage ? (
                          <div className="dropzone-content">
                            <div className="dropzone-info">
                              <Loader2 size={18} className="spin-anim" style={{ color: "#C9A451" }} />
                              <div className="dropzone-text-group">
                                <span className="dropzone-title">Uploading image...</span>
                                <span className="dropzone-hint">Saving to server</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="dropzone-content">
                            <div className="dropzone-info">
                              <div className="dropzone-icon-circle">
                                <Upload size={15} />
                              </div>
                              <div className="dropzone-text-group">
                                <span className="dropzone-title">Choose image from your computer</span>
                                <span className="dropzone-hint">PNG, JPG, WEBP, SVG (Max 10MB)</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn-browse-file"
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                            >
                              Browse Files
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {imageUploadError && (
                      <div className="image-upload-error">
                        <AlertCircle size={14} />
                        <span>{imageUploadError}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... or /uploads/products/..."
                      value={productForm.image_url}
                      onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    />
                    {productForm.image_url && (
                      <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={resolveImageUrl(productForm.image_url)}
                          alt="Preview"
                          style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover", border: "1px solid #1C3122" }}
                        />
                        <span style={{ fontSize: "12px", color: "#8FA496" }}>Image preview loaded</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label>Short Description (for cards)</label>
                <textarea
                  rows={2}
                  placeholder="Brief wholesale summary..."
                  value={productForm.short_description}
                  onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Detailed Specifications & Export Information</label>
                <textarea
                  rows={4}
                  placeholder="Moisture content, foreign matter %, certification..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  className="admin-action-btn"
                  onClick={() => setShowProductModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold" style={{ padding: "8px 20px" }}>
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: ADD CATEGORY */}
      {showCategoryModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "460px" }}>
            <div className="admin-modal-header">
              <h3>Add Commodity Category</h3>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                style={{ background: "none", border: "none", color: "#8FA496", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="admin-modal-body">
              <div className="admin-form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oil Seeds or Grains"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Category trade notes..."
                  value={categoryDesc}
                  onChange={(e) => setCategoryDesc(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  className="admin-action-btn"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold" style={{ padding: "8px 18px" }}>
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. POPUP MODAL: ENQUIRY DETAIL & LIVE STAGE TRACKING CONTROL */}
      {selectedEnquiry && (
        <div className="admin-modal-overlay" onClick={() => setSelectedEnquiry(null)}>
          <div className="admin-enquiry-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-enquiry-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "#C9A451", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Commercial Quotation Management
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "2px", flexWrap: "wrap" }}>
                    <h3 style={{ margin: 0, color: "var(--admin-forest)", fontSize: "18px", fontWeight: 800 }}>
                      {selectedEnquiry.reference_id}
                    </h3>
                    <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#8F7226", background: "rgba(201, 164, 81, 0.15)", padding: "2px 8px", borderRadius: "4px" }}>
                      PIN: {selectedEnquiry.secret_pin}
                    </span>
                    <span style={{ fontSize: "11.5px", color: "var(--admin-text-muted)" }}>
                      • Submitted on {selectedEnquiry.created_at}
                    </span>
                  </div>
                </div>
                <span className={`status-badge status-${selectedEnquiry.status}`}>
                  {selectedEnquiry.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  className="btn btn-gold"
                  style={{
                    padding: "6px 14px",
                    fontSize: "12.5px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                  onClick={() => {
                    exportSingleEnquiryPDF(selectedEnquiry);
                    triggerFeedback(`Exported PDF for ${selectedEnquiry.reference_id}`);
                  }}
                  title="Download official PDF report for this enquiry"
                >
                  <Download size={14} /> Download PDF Dossier
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  style={{ background: "none", border: "none", color: "var(--admin-text-muted)", cursor: "pointer", padding: "4px" }}
                  title="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="admin-enquiry-modal-body">
              <div className="admin-enquiry-grid">
                {/* LEFT COLUMN: BUYER DETAILS, COMMODITIES, AUDIT LOG */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Buyer & KYC Card */}
                  <div style={{ padding: "16px", background: "var(--admin-surface-2)", borderRadius: "8px", border: "1px solid var(--admin-border)" }}>
                    <div style={{ marginBottom: "12px" }}>
                      <h4 style={{ margin: "0 0 2px", fontSize: "16px", color: "var(--admin-forest)" }}>{selectedEnquiry.buyer_name}</h4>
                      <span style={{ fontSize: "13px", color: "#8F7226", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                        <Building2 size={13} /> {selectedEnquiry.company_name}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12.5px" }}>
                      <div>
                        <span style={{ color: "var(--admin-text-muted)" }}>Email: </span>
                        <a href={`mailto:${selectedEnquiry.email}`} style={{ color: "var(--admin-text-main)", textDecoration: "underline", fontWeight: 500 }}>
                          {selectedEnquiry.email}
                        </a>
                      </div>
                      <div>
                        <span style={{ color: "var(--admin-text-muted)" }}>Phone: </span>
                        <span style={{ color: "var(--admin-text-main)", fontWeight: 500 }}>{selectedEnquiry.phone}</span>
                      </div>
                      <div>
                        <span style={{ color: "var(--admin-text-muted)" }}>Tax ID / Reg: </span>
                        <span style={{ color: "var(--admin-text-main)", fontWeight: 600 }}>{selectedEnquiry.tax_id}</span>
                      </div>
                      <div>
                        <span style={{ color: "var(--admin-text-muted)" }}>Country: </span>
                        <span style={{ color: "var(--admin-text-main)", fontWeight: 500 }}>{selectedEnquiry.country || "India"}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid var(--admin-border)", fontSize: "12px" }}>
                      <div style={{ color: "var(--admin-text-muted)", marginBottom: "3px" }}>Delivery Address & Discharge Port:</div>
                      <div style={{ color: "var(--admin-text-main)", lineHeight: 1.4 }}>
                        <MapPin size={12} color="#16A34A" style={{ display: "inline", marginRight: "4px" }} />
                        {selectedEnquiry.delivery_address} (Port: <strong>{selectedEnquiry.destination_port}</strong>)
                      </div>
                    </div>
                  </div>

                  {/* Requested Commodities */}
                  <div>
                    <h4 style={{ margin: "0 0 8px", fontSize: "13px", color: "var(--admin-text-secondary)", textTransform: "uppercase", fontWeight: 700 }}>
                      Requested Commodities
                    </h4>
                    {selectedEnquiry.items && selectedEnquiry.items.length > 0 ? (
                      selectedEnquiry.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: "10px 14px",
                            background: "var(--admin-surface-2)",
                            border: "1px solid var(--admin-border)",
                            borderRadius: "6px",
                            marginBottom: "6px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <div>
                            <strong style={{ color: "var(--admin-text-main)" }}>{item.product_name || "Agri Commodity"}</strong>
                            <div style={{ fontSize: "11.5px", color: "var(--admin-text-muted)" }}>
                              Packaging: {item.packaging_requested || "Standard export bag"}
                            </div>
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: 800, color: "#8F7226" }}>
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div style={{ color: "var(--admin-text-muted)", fontSize: "13px" }}>No item details available.</div>
                    )}
                  </div>

                  {/* Status History Timeline */}
                  <div>
                    <h4 style={{ margin: "0 0 8px", fontSize: "13px", color: "var(--admin-text-secondary)", textTransform: "uppercase", fontWeight: 700 }}>
                      Timeline Audit History
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "190px", overflowY: "auto" }}>
                      {enquiryDetailHistory.length === 0 ? (
                        <div style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>No status updates recorded yet.</div>
                      ) : (
                        enquiryDetailHistory.map((h, i) => (
                          <div
                            key={i}
                            style={{
                              padding: "8px 12px",
                              background: "var(--admin-surface-2)",
                              borderLeft: "3px solid var(--admin-gold)",
                              fontSize: "12px",
                              borderRadius: "0 6px 6px 0"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--admin-text-muted)" }}>
                              <span>By <strong>{h.changed_by}</strong></span>
                              <span>{h.created_at}</span>
                            </div>
                            <div style={{ color: "#8F7226", fontWeight: 700, marginTop: "2px" }}>
                              {h.old_status ? `${h.old_status.toUpperCase()} → ` : ""}
                              {h.new_status.toUpperCase()}
                            </div>
                            {h.note && <div style={{ color: "var(--admin-text-secondary)", marginTop: "2px" }}>{h.note}</div>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: LIVE STAGE CONTROLLER & ADMIN NOTES */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* LIVE STAGE CHANGER */}
                  <div style={{ background: "#FDFBF7", padding: "16px", borderRadius: "8px", border: "1.5px solid var(--admin-gold)" }}>
                    <h4 style={{ margin: "0 0 10px", fontSize: "14px", color: "var(--admin-forest)", display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}>
                      <Activity size={16} color="var(--admin-gold)" /> Update Live Stage (Syncs with Buyer Track Page)
                    </h4>

                    {/* Quick Stage Shortcuts */}
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ fontSize: "11px", color: "#8FA496", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Quick Stage Actions:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setNewStatusInput("under_review");
                            setStatusNoteInput("Trade KYC and company tax entity under review by compliance team.");
                          }}
                          className="admin-action-btn"
                          style={{ fontSize: "11px", padding: "4px 8px", background: newStatusInput === "under_review" ? "rgba(243,156,18,0.25)" : undefined, borderColor: "#F39C12", color: "#F39C12" }}
                        >
                          Under Review
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewStatusInput("quote_sent");
                            setStatusNoteInput("Official CIF / FOB export rate sheet and specification issued to buyer.");
                          }}
                          className="admin-action-btn"
                          style={{ fontSize: "11px", padding: "4px 8px", background: newStatusInput === "quote_sent" ? "rgba(52,152,219,0.25)" : undefined, borderColor: "#3498DB", color: "#3498DB" }}
                        >
                          Quotation Sent
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewStatusInput("accepted");
                            setStatusNoteInput("Buyer reviewed and accepted commercial quotation sheet.");
                          }}
                          className="admin-action-btn"
                          style={{ fontSize: "11px", padding: "4px 8px", background: newStatusInput === "accepted" ? "rgba(46,204,113,0.25)" : undefined, borderColor: "#2ECC71", color: "#2ECC71" }}
                        >
                          Accepted
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewStatusInput("order_confirmed");
                            setStatusNoteInput("Commercial sales contract signed & export order confirmed.");
                          }}
                          className="admin-action-btn"
                          style={{ fontSize: "11px", padding: "4px 8px", background: newStatusInput === "order_confirmed" ? "rgba(16,185,129,0.25)" : undefined, borderColor: "#10B981", color: "#10B981", fontWeight: 700 }}
                        >
                          ✓ Order Confirmed
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewStatusInput("processing");
                            setStatusNoteInput("Commodity milling, Sortex cleaning and batch lab testing in progress.");
                          }}
                          className="admin-action-btn"
                          style={{ fontSize: "11px", padding: "4px 8px", background: newStatusInput === "processing" ? "rgba(139,92,246,0.25)" : undefined, borderColor: "#8B5CF6", color: "#A78BFA" }}
                        >
                          Processing
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewStatusInput("packed");
                            setStatusNoteInput("Consignment packaged in export-grade bags with container pallet seals.");
                          }}
                          className="admin-action-btn"
                          style={{ fontSize: "11px", padding: "4px 8px", background: newStatusInput === "packed" ? "rgba(245,158,11,0.25)" : undefined, borderColor: "#F59E0B", color: "#FBBF24" }}
                        >
                          Packed
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewStatusInput("shipped");
                            setStatusNoteInput("Container dispatched on freight vessel. Bill of Lading (BL) active.");
                          }}
                          className="admin-action-btn"
                          style={{ fontSize: "11px", padding: "4px 8px", background: newStatusInput === "shipped" ? "rgba(6,182,212,0.25)" : undefined, borderColor: "#06B6D4", color: "#22D3EE" }}
                        >
                          Shipped
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewStatusInput("delivered");
                            setStatusNoteInput("Container consignment safely arrived and cleared at destination port.");
                          }}
                          className="admin-action-btn"
                          style={{ fontSize: "11px", padding: "4px 8px", background: newStatusInput === "delivered" ? "rgba(5,150,105,0.25)" : undefined, borderColor: "#059669", color: "#34D399" }}
                        >
                          Delivered
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewStatusInput("rejected");
                            setStatusNoteInput("Quotation closed or declined due to trade specifications.");
                          }}
                          className="admin-action-btn"
                          style={{ fontSize: "11px", padding: "4px 8px", background: newStatusInput === "rejected" ? "rgba(231,76,60,0.25)" : undefined, borderColor: "#E74C3C", color: "#E74C3C" }}
                        >
                          Rejected
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateEnquiryStatus}>
                      <div className="admin-form-group">
                        <label>Select Stage / Status *</label>
                        <select
                          value={newStatusInput}
                          onChange={(e) => setNewStatusInput(e.target.value)}
                        >
                          <optgroup label="1. Review & Status">
                            <option value="pending">Submitted (New Request)</option>
                            <option value="under_review">Under Review (Trade KYC)</option>
                            <option value="quote_sent">Quotation Sent</option>
                            <option value="accepted">Accepted (Quotation Accepted)</option>
                            <option value="rejected">Rejected</option>
                          </optgroup>
                          <optgroup label="2. Order Confirmation">
                            <option value="order_confirmed">Order Confirmed</option>
                          </optgroup>
                          <optgroup label="3. Shipment Progress">
                            <option value="processing">Processing (Sortex & Cleaning)</option>
                            <option value="packed">Packed (Export Packaging)</option>
                            <option value="shipped">Shipped (Vessel in Transit)</option>
                            <option value="delivered">Delivered (Port of Discharge)</option>
                          </optgroup>
                          <optgroup label="4. Other">
                            <option value="cancelled">Cancelled / Closed</option>
                          </optgroup>
                        </select>
                      </div>

                      <div className="admin-form-group">
                        <label>Status Update Note (Saved in History) *</label>
                        <input
                          type="text"
                          placeholder="e.g. Entity tax ID verified, CIF quotation sheet dispatched."
                          value={statusNoteInput}
                          onChange={(e) => setStatusNoteInput(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-gold"
                        disabled={isUpdatingStatus}
                        style={{ width: "100%", padding: "10px", fontSize: "13px" }}
                      >
                        {isUpdatingStatus ? "Updating Live Stage..." : "Update Stage & Notify Buyer →"}
                      </button>
                    </form>
                  </div>

                  {/* Internal Admin Notes */}
                  <div>
                    <h4 style={{ margin: "0 0 8px", fontSize: "13px", color: "var(--admin-text-secondary)", textTransform: "uppercase", fontWeight: 700 }}>
                      Internal Admin Notes
                    </h4>
                    <textarea
                      rows={3}
                      placeholder="Private internal notes (e.g. Verified with customs agent on 24 Oct)..."
                      value={adminNotesInput}
                      onChange={(e) => setAdminNotesInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: "6px",
                        color: "var(--admin-text-main)",
                        fontSize: "13px",
                        resize: "vertical"
                      }}
                    />
                    <button
                      type="button"
                      className="admin-action-btn"
                      onClick={handleSaveAdminNotes}
                      style={{ marginTop: "6px" }}
                    >
                      Save Internal Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. POPUP MODAL: ADMINISTRATOR SETTINGS & CREDENTIALS */}
      {showSettingsModal && (
        <div
          className="admin-modal-overlay"
          onClick={() => setShowSettingsModal(false)}
        >
          <div
            className="admin-modal"
            style={{ maxWidth: "540px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0, color: "var(--admin-forest)", fontSize: "17px", fontWeight: 700 }}>
                <Settings size={18} color="#C9A451" /> Administrator Settings & Profile
              </h3>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                style={{ background: "none", border: "none", color: "var(--admin-text-muted)", cursor: "pointer", padding: "4px" }}
                aria-label="Close settings modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ padding: "20px" }}>
              <div style={{ marginBottom: "20px", padding: "14px 16px", background: "var(--admin-surface-2)", borderRadius: "8px", border: "1px solid var(--admin-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ color: "var(--admin-text-muted)", fontSize: "12.5px" }}>Administrator Name:</span>
                  <strong style={{ color: "var(--admin-text-main)", fontSize: "13px" }}>{adminUser?.name || "INDKAN Super Admin"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ color: "var(--admin-text-muted)", fontSize: "12.5px" }}>Email Address:</span>
                  <strong style={{ color: "var(--admin-text-main)", fontSize: "13px" }}>admin@indkan.com</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--admin-text-muted)", fontSize: "12.5px" }}>Assigned Role:</span>
                  <span className="status-badge status-in_stock" style={{ fontSize: "11px", padding: "3px 8px" }}>Super Admin (Trade Controller)</span>
                </div>
              </div>

              <h4 style={{ margin: "0 0 12px", color: "var(--admin-forest)", fontSize: "14px", fontWeight: 700 }}>Change Administrator Password</h4>
              <form onSubmit={handleChangePassword}>
                <div className="admin-form-group">
                  <label>Current Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>New Password (min 6 characters) *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="New password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Confirm new password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                  <button
                    type="button"
                    className="admin-action-btn"
                    onClick={() => setShowSettingsModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-gold"
                    disabled={isChangingPw || !currentPw || !newPw || !confirmPw}
                    style={{ padding: "8px 20px", fontSize: "13px" }}
                  >
                    {isChangingPw ? "Saving Password..." : "Update Admin Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

