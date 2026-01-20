import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faShieldHalved,
  faTags,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faXTwitter,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

import phonepeImg from "../assets/payments/phonepe.svg";
import upiImg from "../assets/payments/payment.svg";
import googleImg from "../assets/images/google.svg";

/* ---------------- DATA ---------------- */

const ORG_LINKS = [
  { label: "About Us", path: "/about" },
  { label: "Careers", path: "/careers" },
  { label: "The Team", path: "/team" },
  { label: "Contact Us", path: "/contact" },
  { label: "Privacy Policy", path: "/privacy-policy" },
];

const USEFUL_TOOLS = [
  { label: "Check FSSAI License Number Status", path: "/tools/fssai-status" },
  { label: "TDS Interest Calculator", path: "/tools/tds-interest-calculator" },
  { label: "Depreciation Calculator", path: "/tools/depreciation-calculator" },
  { label: "PPF Calculator", path: "/tools/ppf-calculator" },
  { label: "EMI Calculator", path: "/tools/emi-calculator" },
];

/* -------- GOOGLE REVIEWS (FROM YOUR SCREENSHOTS) -------- */

const GOOGLE_REVIEWS = [
  {
    name: "Elixir Ramesh Jaiswal",
    text:
      "Helping startups to complete all statutory and financial compliance for the first year of establishment, absolutely free of cost.",
  },
  {
    name: "Dolphin",
    text:
      "They are providing free GST registration and many more information according to your business.",
  },
  {
    name: "Santosh Jaiswal",
    text:
      "Best chartered accountant team for GST and Income Tax.",
  },
  {
    name: "Dilip Shukla",
    text:
      "It's very nice experience working with Mr Professional team. They have resolved my paperwork in very less time.",
  },
  {
    name: "Suraj Suraj",
    text:
      "Very nice guys for professional work in the field of taxation and legal tasks.",
  },
  {
    name: "Roshani Gupta",
    text:
      "Very experienced team for GST tax finance.",
  },
  {
    name: "Renu Gupta",
    text:
      "For society and trust, best services. Form 80G and 12A.",
  },
];

/* ---------------- COMPONENT ---------------- */

const Footer = () => {
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setReviewIndex((i) => (i + 1) % GOOGLE_REVIEWS.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const activeReview = GOOGLE_REVIEWS[reviewIndex];

  return (
    <footer className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-10 pb-6 space-y-12">



        {/* ---------------- TOP LINKS ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.2fr] gap-8">

          <FooterColumn title="Organization">
            {ORG_LINKS.map((i) => (
              <FooterItem key={i.label} to={i.path}>{i.label}</FooterItem>
            ))}
          </FooterColumn>

          <FooterColumn title="Useful Tools">
            {USEFUL_TOOLS.map((i) => (
              <FooterItem key={i.label} to={i.path}>{i.label}</FooterItem>
            ))}
          </FooterColumn>

          {/* CONTACT */}
          <div className="space-y-4 text-[19px] text-center lg:text-left lg:col-start-4">

            <div>
              <p className="text-[var(--color-brand)] font-semibold text-[17px] mb-1">
                Call us on
              </p>
              <div className="text-3xl font-bold">
                +91 88009 32090
                <div className="text-xl font-semibold mt-1">
                  +91 94157 18705
                </div>
              </div>
              <p className="text-[17px] mt-1">[Mon - Sat, 9am - 6:30pm]</p>
            </div>

            <div>
              <p className="text-[var(--color-brand)] font-semibold text-[17px] mb-1">
                Write to us
              </p>
              <p>info@mrprofessional.co.in</p>
            </div>

            <div>
              <p className="text-[var(--color-brand)] font-semibold text-[17px] mb-1">
                Follow us on
              </p>
              <div className="flex gap-3 mt-2 justify-center lg:justify-start">
                <IconBubble icon={faFacebookF} />
                <IconBubble icon={faInstagram} />
                <IconBubble icon={faXTwitter} />
                <IconBubble icon={faLinkedinIn} />
              </div>
            </div>

            <div className="flex gap-3 pt-2 justify-center lg:justify-start">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-[var(--color-brand)] mt-1"
              />
              <div>
                <p>SF-1, Reliable City Center, Sector-6</p>
                <p>Vasundhara, Ghaziabad – 201014</p>
              </div>
            </div>
          </div>
        </div>

        {/* TRUST + GOOGLE REVIEWS */}
        <div className="rounded-3xl px-6 md:px-10 py-8 border-[var(--border-color)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center">

            {/* LEFT */}
            <div className="grid grid-cols-1 md:grid-cols-[auto_40px_auto_40px_auto] gap-y-6">

              <TrustBadge icon={faShieldHalved} label="Reliable" />
              <Divider />
              <TrustBadge icon={faTags} label="Affordable" />
              <Divider />
              <TrustBadge icon={faHandshake} label="Assurity" />

              <div className="md:col-span-5 flex justify-center">
                <div className="flex flex-col sm:flex-row items-center gap-4">
              

                  <Link to="/payment">
                    <img
                      src={phonepeImg}
                      alt="PhonePe"
                      className="h-9 hover:scale-105 transition"
                    />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-5 flex justify-center">
                <img src={upiImg} alt="UPI" className="h-7" />
              </div>
            </div>

            {/* RIGHT — GOOGLE REVIEW CARD */}
            <div className="bg-[var(--bg-main)] rounded-2xl px-6 py-6 border border-[var(--border-color)] flex flex-col gap-4">

              <p className="text-[19px] md:text-[15px] leading-relaxed">
                {activeReview.text}
              </p>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="font-semibold">{activeReview.name}</p>

                <a
                  href="https://www.google.com/search?q=Mr+Professional+Pvt+Ltd+Ghaziabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-90 transition"
                >
                  <img src={googleImg} alt="Google Reviews" className="h-8" />
                  <span className="font-semibold text-[19px]">
                    4.7 <span className="text-yellow-400">★★★★★</span>
                  </span>
                </a>
              </div>

              <div className="flex gap-2">
                {GOOGLE_REVIEWS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-2.5 rounded-full ${
                      i === reviewIndex
                        ? "bg-[var(--color-brand)]"
                        : "bg-[var(--text-secondary)]/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- BOTTOM BAR ---------------- */}

        <div className="border-t border-[var(--border-color)] pt-4 flex flex-col md:flex-row gap-3 justify-between items-center text-[15px] text-center md:text-left">
          <span>Mr.Professional • © 2026 All Rights Reserved</span>
          <div className="flex gap-4">
            <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink to="/terms-and-conditions">Terms & Conditions</FooterLink>
            <FooterLink to="/refund-policy">Refund Policy</FooterLink>
          </div>
        </div>

      </div>
    </footer>
  );
};

/* ---------------- HELPERS ---------------- */

const FooterColumn = ({ title, children }) => (
  <div>
    <h4 className="text-[var(--color-brand)] font-semibold mb-3 text-[21px]">{title}</h4>
    <ul className="space-y-2">{children}</ul>
  </div>
);

const FooterItem = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-[var(--color-brand-hover)] text-[19px]">
      {children}
    </Link>
  </li>
);

const IconBubble = ({ icon }) => (
  <div className="h-8 w-8 rounded-full border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--bg-main)]">
    <FontAwesomeIcon icon={icon} />
  </div>
);

const TrustBadge = ({ icon, label }) => (
  <div className="flex items-center gap-3 justify-center md:justify-start">
    <div className="h-11 w-11 rounded-full border border-[var(--color-brand)] flex items-center justify-center">
      <FontAwesomeIcon icon={icon} className="text-[var(--color-brand)] text-xl" />
    </div>
    <span className="font-semibold">{label}</span>
  </div>
);

const Divider = () => (
  <div className="hidden md:block h-8 w-px bg-[var(--color-brand)]" />
);

const FooterLink = ({ to, children }) => (
  <Link to={to} className="hover:text-[var(--color-brand-hover)]">
    {children}
  </Link>
);

export default Footer;

