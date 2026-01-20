import React from "react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <NavBar />

      {/* Header */}
      <section className="bg-[var(--color-brand)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-8 space-y-8">

          {/* Intro */}
          <p className="text-[var(--text-secondary)]">
            Mr. Professional (“we”, “our”, “us”) respects your privacy and is
            committed to protecting your personal and business information.
            This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you visit our website or use our
            incubation, compliance, legal, accounting, taxation, and advisory
            services.
          </p>

          {/* Info Collection */}
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
            <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
              <li>Personal details such as name, email address, phone number</li>
              <li>Business details including company name, address, and documents</li>
              <li>Identity and compliance documents (PAN, Aadhaar, GST, etc.)</li>
              <li>Payment and transaction-related information</li>
              <li>Website usage data such as IP address, browser type, cookies</li>
            </ul>
          </div>

          {/* Usage */}
          <div>
            <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
            <p className="text-[var(--text-secondary)]">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
              <li>Provide incubation, registration, compliance, and advisory services</li>
              <li>Process payments and fulfill contractual obligations</li>
              <li>Communicate service updates and regulatory requirements</li>
              <li>Improve our website, services, and customer experience</li>
              <li>Comply with legal and regulatory obligations</li>
            </ul>
          </div>

          {/* Sharing */}
          <div>
            <h2 className="text-xl font-semibold mb-2">3. Information Sharing & Disclosure</h2>
            <p className="text-[var(--text-secondary)]">
              We do not sell or rent your personal information. Information may
              be shared only with:
            </p>
            <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
              <li>Government authorities for statutory filings</li>
              <li>Professional partners (CA, CS, Lawyers) strictly for service delivery</li>
              <li>Technology and payment service providers</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </div>

          {/* Cookies */}
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Cookies & Tracking Technologies</h2>
            <p className="text-[var(--text-secondary)]">
              Our website may use cookies to enhance user experience, analyze
              traffic, and improve functionality. You may choose to disable
              cookies through your browser settings.
            </p>
          </div>

          {/* Security */}
          <div>
            <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
            <p className="text-[var(--text-secondary)]">
              We implement reasonable administrative, technical, and physical
              safeguards to protect your information. However, no electronic
              transmission over the internet is completely secure.
            </p>
          </div>

          {/* Retention */}
          <div>
            <h2 className="text-xl font-semibold mb-2">6. Data Retention</h2>
            <p className="text-[var(--text-secondary)]">
              We retain personal information only for as long as required to
              fulfill legal, contractual, and business obligations.
            </p>
          </div>

          {/* Rights */}
          <div>
            <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
            <p className="text-[var(--text-secondary)]">
              You have the right to access, update, or request deletion of your
              personal information, subject to legal requirements.
            </p>
          </div>

          {/* Children */}
          <div>
            <h2 className="text-xl font-semibold mb-2">8. Children’s Privacy</h2>
            <p className="text-[var(--text-secondary)]">
              Our services are not intended for individuals under 18 years of age.
              We do not knowingly collect data from minors.
            </p>
          </div>

          {/* Updates */}
          <div>
            <h2 className="text-xl font-semibold mb-2">9. Policy Updates</h2>
            <p className="text-[var(--text-secondary)]">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with immediate effect.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
            <p className="text-[var(--text-secondary)]">
              📞 +91 88009 32090, +91 94157 18705 <br />
              🕘 Mon – Sat, 9:00 AM – 6:30 PM <br />
              📧 info@mrprofessional.co.in
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

