import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Loader2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  MapPin, 
  Building2, 
  LogOut,
  RefreshCw,
  Plus,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  Hash,
  Check
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import apiService from "../services/apiService";
import { API_ENDPOINTS } from "../config/api";

type EnquiryItem = {
  id?: number;
  product_id: number;
  product_name: string;
  product_code: string;
  quantity: number;
  unit: string;
  packaging_requested?: string;
};

type EnquiryData = {
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
  created_at: string;
  items: EnquiryItem[];
};

export default function TrackEnquiryPage() {
  const [searchParams] = useSearchParams();

  // Login / Tracking state
  const [step, setStep] = useState<"login" | "dashboard">("login");
  const [referenceId, setReferenceId] = useState(searchParams.get("ref") || localStorage.getItem("indkan_track_ref") || "");
  const [secretPin, setSecretPin] = useState(searchParams.get("pin") || localStorage.getItem("indkan_track_pin") || "");
  const [showPin, setShowPin] = useState(false);

  const [isTracking, setIsTracking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active loaded enquiry
  const [activeEnquiry, setActiveEnquiry] = useState<EnquiryData | null>(null);

  // Change PIN state
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isSubmittingPinChange, setIsSubmittingPinChange] = useState(false);
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);
  const [pinChangeSuccess, setPinChangeSuccess] = useState<string | null>(null);

  // Auto-fetch if both reference ID and PIN are in URL params or localStorage
  useEffect(() => {
    const refParam = searchParams.get("ref") || localStorage.getItem("indkan_track_ref");
    const pinParam = searchParams.get("pin") || localStorage.getItem("indkan_track_pin");

    if (refParam && pinParam) {
      setReferenceId(refParam);
      setSecretPin(pinParam);
      fetchEnquiry(refParam, pinParam);
    }
  }, []);

  const fetchEnquiry = async (ref: string, pin: string) => {
    const cleanRef = ref.trim().toUpperCase();
    const cleanPin = pin.trim();

    if (!cleanRef) {
      setErrorMessage("Please enter your Enquiry Reference ID (e.g. ENQ-2026-0001).");
      return;
    }
    if (!cleanPin) {
      setErrorMessage("Please enter your Secret PIN to view your quotation.");
      return;
    }

    setIsTracking(true);
    setErrorMessage(null);

    try {
      const res = await apiService.post(API_ENDPOINTS.TRACK_BY_PIN, {
        reference_id: cleanRef,
        secret_pin: cleanPin
      });

      if (res.data?.success && res.data.enquiry) {
        const enq = res.data.enquiry as EnquiryData;
        setActiveEnquiry(enq);
        setStep("dashboard");
        localStorage.setItem("indkan_track_ref", enq.reference_id);
        localStorage.setItem("indkan_track_pin", cleanPin);
      } else {
        throw new Error(res.data?.error || "Could not retrieve quotation. Please verify your Reference ID and PIN.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Failed to load quotation details.";
      setErrorMessage(msg);
      setActiveEnquiry(null);
      setStep("login");
    } finally {
      setIsTracking(false);
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnquiry(referenceId, secretPin);
  };

  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError(null);
    setPinChangeSuccess(null);

    if (!activeEnquiry) return;

    if (!currentPin.trim()) {
      setPinChangeError("Please enter your current Secret PIN.");
      return;
    }
    if (!newPin.trim() || newPin.trim().length < 4) {
      setPinChangeError("New Secret PIN must be at least 4 digits or characters.");
      return;
    }
    if (newPin.trim() !== confirmPin.trim()) {
      setPinChangeError("New PIN and Confirm PIN do not match.");
      return;
    }
    if (newPin.trim() === currentPin.trim()) {
      setPinChangeError("New PIN cannot be identical to current PIN.");
      return;
    }

    setIsSubmittingPinChange(true);
    try {
      const res = await apiService.post(API_ENDPOINTS.CHANGE_PIN, {
        reference_id: activeEnquiry.reference_id,
        current_pin: currentPin.trim(),
        new_pin: newPin.trim()
      });

      if (res.data?.success) {
        const updatedPin = res.data.new_pin || newPin.trim();
        setPinChangeSuccess(res.data.message || "Secret PIN changed successfully!");
        setSecretPin(updatedPin);
        localStorage.setItem("indkan_track_pin", updatedPin);
        
        // Reset form fields
        setCurrentPin("");
        setNewPin("");
        setConfirmPin("");

        // Auto close after 2.5s
        setTimeout(() => {
          setIsChangingPin(false);
          setPinChangeSuccess(null);
        }, 2500);
      } else {
        throw new Error(res.data?.error || "Failed to change PIN.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Failed to change Secret PIN.";
      setPinChangeError(msg);
    } finally {
      setIsSubmittingPinChange(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("indkan_track_ref");
    localStorage.removeItem("indkan_track_pin");
    setActiveEnquiry(null);
    setReferenceId("");
    setSecretPin("");
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsChangingPin(false);
    setStep("login");
  };

  return (
    <div className="track-page-wrapper">
      <Navbar />

      <main className="track-page-main">
        <div className="container" style={{ maxWidth: step === "dashboard" ? "1000px" : "620px" }}>
          
          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link to="/product" className="btn btn-outline" style={{ padding: "8px 16px", minHeight: "36px", fontSize: "13px" }}>
              <ArrowLeft size={16} /> Back to Products
            </Link>

            <Link to="/enquiry" className="btn btn-gold" style={{ padding: "8px 16px", minHeight: "36px", fontSize: "13px" }}>
              <Plus size={16} /> New Quote Request
            </Link>
          </div>

          <div className={`track-card ${step === "dashboard" ? "wide-mode" : ""}`}>
            
            {/* Header */}
            <div className="track-header">
              <div className="track-header-icon">
                <ShieldCheck size={26} />
              </div>
              <h2>Track Your Quotation Request</h2>
              <p>
                {step === "dashboard"
                  ? "Live status & KYC updates for your commercial export quotation."
                  : "No account required. Simply enter your Enquiry Reference ID and Secret PIN."}
              </p>
            </div>

            {/* Body */}
            <div className="track-body">

              {/* Alert Messages */}
              {errorMessage && (
                <div className="enquiry-error-banner" style={{ marginBottom: "16px" }}>
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && !errorMessage && (
                <div className="enquiry-location-verified-badge" style={{ display: "flex", padding: "8px 12px", marginBottom: "16px", fontSize: "12.5px" }}>
                  <CheckCircle2 size={16} />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* STEP 1: Enter Reference ID + Secret PIN */}
              {step === "login" && (
                <form onSubmit={handleTrackSubmit}>
                  {/* Reference ID Field */}
                  <div className="track-field-group">
                    <label htmlFor="track-ref-input">Enquiry Reference ID *</label>
                    <div className="track-pin-input-wrap">
                      <Hash size={17} className="track-pin-icon-left" />
                      <input
                        id="track-ref-input"
                        type="text"
                        required
                        placeholder="e.g. ENQ-2026-0001"
                        value={referenceId}
                        onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
                        autoFocus
                      />
                    </div>
                    <p className="enquiry-field-hint" style={{ marginTop: "6px" }}>
                      Given to you upon submitting your quotation request.
                    </p>
                  </div>

                  {/* Secret PIN Field */}
                  <div className="track-field-group">
                    <label htmlFor="track-pin-input">Secret PIN (Password) *</label>
                    <div className="track-pin-input-wrap">
                      <Lock size={17} className="track-pin-icon-left" />
                      <input
                        id="track-pin-input"
                        type={showPin ? "text" : "password"}
                        required
                        placeholder="Enter your 6-digit Secret PIN"
                        value={secretPin}
                        onChange={(e) => setSecretPin(e.target.value)}
                      />
                      <button
                        type="button"
                        className="track-pin-toggle-right"
                        onClick={() => setShowPin(!showPin)}
                        title={showPin ? "Hide PIN" : "Show PIN"}
                      >
                        {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <p className="enquiry-field-hint" style={{ marginTop: "6px" }}>
                      Confidential security PIN provided at quotation submission.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="track-submit-btn"
                    disabled={isTracking || !referenceId.trim() || !secretPin.trim()}
                  >
                    {isTracking ? (
                      <>
                        <Loader2 size={18} className="spinner" />
                        Verifying Quotation Credentials...
                      </>
                    ) : (
                      <>
                        Track Quotation Status <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  <div style={{ marginTop: "22px", textAlign: "center", fontSize: "12.5px", color: "#8DA193", lineHeight: 1.5 }}>
                    🔒 Zero-Account Protected Trade Desk. Only individuals with both Reference ID and Secret PIN can view quotation status.
                  </div>
                </form>
              )}

              {/* STEP 2: Dashboard View of the Quotation */}
              {step === "dashboard" && activeEnquiry && (
                <div>
                  {/* Top Profile / Action Bar */}
                  <div className="track-user-profile-bar">
                    <div className="track-user-info">
                      <Hash size={16} color="#C9A451" />
                      <strong style={{ letterSpacing: "0.5px" }}>{activeEnquiry.reference_id}</strong>
                      <span className="track-verified-pill">
                        <CheckCircle2 size={12} /> PIN Verified
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className={`track-logout-btn ${isChangingPin ? "active" : ""}`}
                        style={{ color: isChangingPin ? "#C9A451" : undefined, borderColor: isChangingPin ? "#C9A451" : undefined }}
                        title="Change your Secret PIN"
                        onClick={() => {
                          setIsChangingPin(!isChangingPin);
                          setPinChangeError(null);
                          setPinChangeSuccess(null);
                        }}
                      >
                        <KeyRound size={13} style={{ marginRight: "4px" }} /> Change PIN
                      </button>

                      <button
                        type="button"
                        className="track-logout-btn"
                        title="Refresh status"
                        onClick={() => fetchEnquiry(activeEnquiry.reference_id, secretPin)}
                      >
                        <RefreshCw size={13} style={{ marginRight: "4px" }} /> Refresh
                      </button>

                      <button
                        type="button"
                        className="track-logout-btn"
                        title="Track another enquiry"
                        onClick={handleLogout}
                      >
                        <LogOut size={13} style={{ marginRight: "4px" }} /> Exit
                      </button>
                    </div>
                  </div>

                  {/* Change Secret PIN Expandable Panel */}
                  {isChangingPin && (
                    <div className="track-change-pin-panel">
                      <div className="track-change-pin-header">
                        <h4>
                          <KeyRound size={16} /> Update Your Secret PIN
                        </h4>
                        <span style={{ fontSize: "12px", color: "#8DA193" }}>
                          Choose a secure 4 to 10 character PIN
                        </span>
                      </div>

                      {pinChangeError && (
                        <div className="enquiry-error-banner" style={{ marginBottom: "12px", padding: "8px 12px", fontSize: "12.5px" }}>
                          <AlertCircle size={15} />
                          <span>{pinChangeError}</span>
                        </div>
                      )}

                      {pinChangeSuccess && (
                        <div className="enquiry-location-verified-badge" style={{ display: "flex", padding: "8px 12px", marginBottom: "12px", fontSize: "12.5px" }}>
                          <CheckCircle2 size={15} />
                          <span>{pinChangeSuccess}</span>
                        </div>
                      )}

                      <form onSubmit={handleChangePinSubmit}>
                        <div className="track-pin-fields-grid">
                          <div>
                            <label style={{ display: "block", fontSize: "11.5px", color: "#A0B3A6", marginBottom: "6px" }}>
                              Current Secret PIN *
                            </label>
                            <div className="track-pin-input-wrap">
                              <Lock size={14} className="track-pin-icon-left" />
                              <input
                                type={showCurrentPin ? "text" : "password"}
                                required
                                placeholder="Current PIN"
                                value={currentPin}
                                onChange={(e) => setCurrentPin(e.target.value)}
                              />
                              <button
                                type="button"
                                className="track-pin-toggle-right"
                                onClick={() => setShowCurrentPin(!showCurrentPin)}
                                title={showCurrentPin ? "Hide PIN" : "Show PIN"}
                              >
                                {showCurrentPin ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "11.5px", color: "#A0B3A6", marginBottom: "6px" }}>
                              New Secret PIN *
                            </label>
                            <div className="track-pin-input-wrap">
                              <KeyRound size={14} className="track-pin-icon-left" />
                              <input
                                type={showNewPin ? "text" : "password"}
                                required
                                minLength={4}
                                placeholder="New PIN (min 4 chars)"
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value)}
                              />
                              <button
                                type="button"
                                className="track-pin-toggle-right"
                                onClick={() => setShowNewPin(!showNewPin)}
                                title={showNewPin ? "Hide PIN" : "Show PIN"}
                              >
                                {showNewPin ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "11.5px", color: "#A0B3A6", marginBottom: "6px" }}>
                              Confirm New PIN *
                            </label>
                            <div className="track-pin-input-wrap">
                              <KeyRound size={14} className="track-pin-icon-left" />
                              <input
                                type={showConfirmPin ? "text" : "password"}
                                required
                                minLength={4}
                                placeholder="Confirm New PIN"
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value)}
                              />
                              <button
                                type="button"
                                className="track-pin-toggle-right"
                                onClick={() => setShowConfirmPin(!showConfirmPin)}
                                title={showConfirmPin ? "Hide PIN" : "Show PIN"}
                              >
                                {showConfirmPin ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", marginTop: "14px" }}>
                          <button
                            type="button"
                            className="track-logout-btn"
                            onClick={() => setIsChangingPin(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-gold"
                            disabled={isSubmittingPinChange || !currentPin || !newPin || !confirmPin}
                            style={{ padding: "7px 20px", fontSize: "12.5px", minHeight: "34px" }}
                          >
                            {isSubmittingPinChange ? (
                              <>
                                <Loader2 size={14} className="spinner" /> Saving...
                              </>
                            ) : (
                              "Update PIN"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Main Enquiry Details Card */}
                  <div className="track-enquiry-card" style={{ marginTop: "10px" }}>
                    {/* Top Row */}
                    <div className="track-enquiry-top-row">
                      <div>
                        <span className="track-enquiry-ref">{activeEnquiry.reference_id}</span>
                        <div className="track-enquiry-date">
                          <Clock size={12} style={{ display: "inline", marginRight: "4px" }} />
                          Submitted on {activeEnquiry.created_at}
                        </div>
                      </div>

                      <span
                        className="track-status-pill"
                        style={{
                          background: `${activeEnquiry.status_color}22`,
                          color: activeEnquiry.status_color,
                          border: `1px solid ${activeEnquiry.status_color}55`
                        }}
                      >
                        {activeEnquiry.status_label}
                      </span>
                    </div>

                    {/* Stepper Timeline */}
                    <div className="track-timeline-stepper">
                      <div className={`timeline-step ${activeEnquiry.step >= 1 ? (activeEnquiry.step === 1 ? "current" : "completed") : ""}`}>
                        <div className="timeline-step-circle">
                          {activeEnquiry.step > 1 ? "✓" : "1"}
                        </div>
                        <span className="timeline-step-label">Request Received</span>
                      </div>

                      <div className={`timeline-step ${activeEnquiry.step >= 2 ? (activeEnquiry.step === 2 ? "current" : "completed") : ""}`}>
                        <div className="timeline-step-circle">
                          {activeEnquiry.step > 2 ? "✓" : "2"}
                        </div>
                        <span className="timeline-step-label">Trade KYC Review</span>
                      </div>

                      <div className={`timeline-step ${activeEnquiry.step >= 3 ? (activeEnquiry.step === 3 ? "current" : "completed") : ""}`}>
                        <div className="timeline-step-circle">
                          {activeEnquiry.step > 3 ? "✓" : "3"}
                        </div>
                        <span className="timeline-step-label">Quote & Rate Sheet</span>
                      </div>

                      <div className={`timeline-step ${activeEnquiry.step >= 4 ? (activeEnquiry.step === 4 ? "current" : "completed") : ""}`}>
                        <div className="timeline-step-circle">
                          {activeEnquiry.step >= 4 ? "✓" : "4"}
                        </div>
                        <span className="timeline-step-label">Order Finalized</span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="track-details-grid">
                      <div className="track-detail-item">
                        <span className="track-detail-label">Commodity & Volume</span>
                        <span className="track-detail-val">
                          {activeEnquiry.items && activeEnquiry.items.length > 0 ? (
                            <>
                              {activeEnquiry.items[0].product_name}{" "}
                              {activeEnquiry.items[0].product_code ? `(${activeEnquiry.items[0].product_code})` : ""} —{" "}
                              {activeEnquiry.items[0].quantity} {activeEnquiry.items[0].unit}
                            </>
                          ) : (
                            "Agricultural Commodity"
                          )}
                        </span>
                      </div>

                      <div className="track-detail-item">
                        <span className="track-detail-label">Discharge Port</span>
                        <span className="track-detail-val">
                          {activeEnquiry.destination_port || "Pending Destination"}
                        </span>
                      </div>

                      <div className="track-detail-item">
                        <span className="track-detail-label">Trading Entity & Tax ID</span>
                        <span className="track-detail-val" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Building2 size={13} color="#C9A451" />
                          {activeEnquiry.company_name} ({activeEnquiry.tax_id})
                        </span>
                      </div>

                      <div className="track-detail-item">
                        <span className="track-detail-label">Delivery Address</span>
                        <span className="track-detail-val" style={{ fontSize: "12px", color: "#D2DCD5" }}>
                          <MapPin size={12} color="#2ECC71" style={{ display: "inline", marginRight: "3px" }} />
                          {activeEnquiry.delivery_address || "On file"}
                        </span>
                      </div>
                    </div>

                    {/* Trade Security Note */}
                    <div style={{ marginTop: "16px", padding: "10px 14px", background: "rgba(201, 164, 81, 0.08)", border: "1px dashed rgba(201, 164, 81, 0.25)", borderRadius: "8px", fontSize: "12px", color: "#B8C9BF", display: "flex", alignItems: "center", gap: "8px" }}>
                      <ShieldCheck size={16} color="#C9A451" style={{ flexShrink: 0 }} />
                      <span>
                        Official wholesale rate sheet and verified batch Certificate of Analysis (COA) will be dispatched to <strong>{activeEnquiry.email}</strong> once B2B trade KYC is approved.
                      </span>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
