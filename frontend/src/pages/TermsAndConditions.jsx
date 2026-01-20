import React from "react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <NavBar />

      {/* Header */}
      <section className="bg-[var(--color-brand)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Terms & Conditions</h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-8 space-y-6">

          {/* Introduction */}
          <p className="text-[var(--text-secondary)]">
            These Terms & Conditions govern your use of the website and services
            provided by <strong>Mr. Professional</strong>. By accessing this
            website or availing any services, you agree to be bound by these
            Terms & Conditions.
          </p>

          {/* Services */}
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Scope of Services</h2>
            <p className="text-[var(--text-secondary)]">
              Mr. Professional provides incubation support, business setup,
              compliance, taxation, accounting, legal, licensing, advisory,
              and allied professional services. Services are offered based on
              information and documents provided by the client.
            </p>
          </div>

          {/* Client Responsibility */}
          <div>
            <h2 className="text-xl font-semibold mb-2">2. Client Responsibilities</h2>
            <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
              <li>Provide accurate and complete information and documents</li>
              <li>Respond promptly to queries and clarification requests</li>
              <li>Ensure compliance with applicable laws and regulations</li>
              <li>Verify final documents before submission or approval</li>
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h2 className="text-xl font-semibold mb-2">3. Fees and Payments</h2>
            <p className="text-[var(--text-secondary)]">
              All fees must be paid in advance unless otherwise agreed in writing.
              Government fees, statutory charges, and third-party costs are
              non-refundable and may vary as per authorities.
            </p>
          </div>

          {/* No Guarantee */}
          <div>
            <h2 className="text-xl font-semibold mb-2">4. No Guarantee of Outcome</h2>
            <p className="text-[var(--text-secondary)]">
              Mr. Professional does not guarantee approvals, timelines, or
              outcomes from government bodies, regulatory authorities, or
              third-party institutions. Decisions rest solely with the
              respective authorities.
            </p>
          </div>

          {/* Intellectual Property */}
          <div>
            <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
            <p className="text-[var(--text-secondary)]">
              All content, branding, designs, text, and materials on this website
              are the intellectual property of Mr. Professional and may not be
              copied, reproduced, or distributed without written consent.
            </p>
          </div>

          {/* Confidentiality */}
          <div>
            <h2 className="text-xl font-semibold mb-2">6. Confidentiality</h2>
            <p className="text-[var(--text-secondary)]">
              We maintain confidentiality of client information and documents
              except where disclosure is required by law or government authority.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div>
            <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
            <p className="text-[var(--text-secondary)]">
              Mr. Professional shall not be liable for indirect, incidental,
              consequential, or special damages arising from the use of our
              services or website.
            </p>
          </div>

          {/* Termination */}
          <div>
            <h2 className="text-xl font-semibold mb-2">8. Termination of Services</h2>
            <p className="text-[var(--text-secondary)]">
              We reserve the right to suspend or terminate services in case of
              non-payment, misrepresentation, misuse, or violation of these
              Terms & Conditions.
            </p>
          </div>

          {/* Amendments */}
          <div>
            <h2 className="text-xl font-semibold mb-2">9. Amendments</h2>
            <p className="text-[var(--text-secondary)]">
              Mr. Professional may update these Terms & Conditions at any time.
              Continued use of the website or services constitutes acceptance
              of the updated terms.
            </p>
          </div>

          {/* Jurisdiction */}
          <div>
            <h2 className="text-xl font-semibold mb-2">10. Governing Law & Jurisdiction</h2>
            <p className="text-[var(--text-secondary)]">
              These Terms & Conditions shall be governed by the laws of India.
              Any disputes shall be subject to the exclusive jurisdiction of
              Indian courts.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-semibold mb-2">11. Contact Information</h2>
            <p className="text-[var(--text-secondary)]">
              For any questions regarding these Terms & Conditions:
              <br /><br />
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

export default TermsAndConditions;

