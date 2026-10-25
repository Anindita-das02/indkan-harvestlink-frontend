import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import LandingPage from "./pages/LandingPage";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import EnquiryPage from "./pages/EnquiryPage";
import TrackEnquiryPage from "./pages/TrackEnquiryPage";
import AboutUs from "./pages/AboutUs";
import ExportProcess from "./pages/ExportProcess";
import FAQs from "./pages/FAQs";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Disclaimer from "./pages/Disclaimer";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Core & Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* 1. About Us */}
        <Route path="/about-us" element={<AboutUs />} />

        {/* 2. Products */}
        <Route path="/products" element={<Products />} />
        <Route path="/product" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* 3. Our Export Process */}
        <Route path="/export-process" element={<ExportProcess />} />

        {/* 4. Request a Quotation */}
        <Route path="/enquiry" element={<EnquiryPage />} />

        {/* 5. Track Your Enquiry */}
        <Route path="/track-enquiry" element={<TrackEnquiryPage />} />
        <Route path="/track" element={<TrackEnquiryPage />} />

        {/* 6. FAQs */}
        <Route path="/faqs" element={<FAQs />} />

        {/* 7. Contact Us */}
        <Route path="/contact-us" element={<ContactUs />} />

        {/* 8. Privacy Policy */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* 9. Terms & Conditions */}
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        {/* 10. Disclaimer */}
        <Route path="/disclaimer" element={<Disclaimer />} />

        {/* Internal Admin Desk */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
