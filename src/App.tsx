import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import EnquiryPage from "./pages/EnquiryPage";
import TrackEnquiryPage from "./pages/TrackEnquiryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/enquiry" element={<EnquiryPage />} />
        <Route path="/track" element={<TrackEnquiryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
