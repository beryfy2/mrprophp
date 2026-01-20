import React from "react";
import { Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import NavBar from "./components/Navbar";

import Footer from "./components/Footer";

/* ================= HOME SECTIONS ================= */
import HeroPage from "./pages/HeroPage";
import SolutionSection from "./pages/SolutionSection";
import TestimonialsSection from "./pages/TestimonialsSection";

import Team from "./components/Team";
import Map from "./components/Map";
import WhyUs from "./pages/WhyUs";

import IndustriesSection from "./components/IndustriesSection";
import TrustedBy from "./components/TrustBy";
import MediaCoverage from "./components/MediaCoverage";

/* ================= TOOLS ================= */
import EmiCalculator from "./pages/tools/EmiCalculator";
import PpfCalculator from "./pages/tools/PpfCalculator";
import DepreciationCalculator from "./pages/tools/DepreciationCalculator";
import TdsInterestCalculator from "./pages/tools/TdsInterestCalculator";
import FssaiLicenseChecker from "./pages/tools/FssaiLicenseChecker";

/* ================= PAGES ================= */
import Careers from "./pages/Careers";
import ServicePage from "./pages/ServicePage";
import AboutUs from "./pages/AboutUs";
import TeamMem from "./pages/TeamMem";
import Achievements from "./pages/Achievements";
import Works from "./pages/Works";
import WorkPage from "./pages/WorkPage";
import Contact from "./pages/Contact";
import PartnersSignup from "./pages/PartnersSignup";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";

/* ================= PAYMENT ================= */
import Payment from "./pages/Payment";
import PaymentStatus from "./pages/PaymentStatus";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

/* ================= HOME LAYOUT ================= */
const Home = () => (
  <>
    <NavBar />
    <HeroPage />
    <SolutionSection />
    <TestimonialsSection />
   
    <Team />
    <IndustriesSection />
    <TrustedBy />
    <MediaCoverage />
    <Map />
    <WhyUs />
    <Footer />
  </>
);

/* ================= TOOL LAYOUT ================= */
const ToolPage = ({ children }) => (
  <>
    <NavBar />
    {children}
    <Footer />
  </>
);

/* ================= APP ================= */
const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* SERVICES */}
        <Route path="/services/:slug" element={<ServicePage />} />

        {/* CAREERS */}
        <Route
          path="/careers"
          element={
            <ToolPage>
              <Careers />
            </ToolPage>
          }
        />

        {/* TOOLS */}
        <Route
          path="/tools/emi-calculator"
          element={
            <ToolPage>
              <EmiCalculator />
            </ToolPage>
          }
        />
        <Route
          path="/tools/ppf-calculator"
          element={
            <ToolPage>
              <PpfCalculator />
            </ToolPage>
          }
        />
        <Route
          path="/tools/depreciation-calculator"
          element={
            <ToolPage>
              <DepreciationCalculator />
            </ToolPage>
          }
        />
        <Route
          path="/tools/tds-interest-calculator"
          element={
            <ToolPage>
              <TdsInterestCalculator />
            </ToolPage>
          }
        />
        <Route
          path="/tools/fssai-status"
          element={
            <ToolPage>
              <FssaiLicenseChecker />
            </ToolPage>
          }
        />

        {/* COMPANY */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/team" element={<TeamMem />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/works" element={<Works />} />
        <Route path="/works/:id" element={<WorkPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/partners-signup" element={<PartnersSignup />} />

        {/* ================= PAYMENT ROUTES ================= */}
        {/* NOTE: NO NAVBAR / FOOTER on payment pages */}
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />

        {/* LEGAL */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
      </Routes>
    </>
  );
};

export default App;

