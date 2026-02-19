import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavProfile = ({ hidden = false }) => {
  return (
    <div
      className="w-full px-8 text-[14px] flex items-center justify-between"
      style={{
        background: "var(--bg-secondary)",
        height: "48px",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "all 300ms ease",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        zIndex: 1200,
      }}
    >
      {/* Contact */}
      <div className="flex items-center gap-8 font-medium text-[var(--text-secondary)]">
        <span className="flex items-center gap-2 hover:text-[var(--color-brand)] transition">
          <FontAwesomeIcon icon={["fas", "envelope"]} />
          info@mrprofessional.co.in
        </span>

        <span className="flex items-center gap-2 hover:text-[var(--color-brand)] transition">
          <FontAwesomeIcon icon={["fas", "phone"]} />
          +91 88009 32090
        </span>
      </div>


      {/* Socials media */}
      <div className="hidden md:flex items-center gap-5 text-[18px] text-[var(--text-secondary)]">
        <a
          href="https://wa.me/+918800932090"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="hover:text-green-400 transition-colors"
        >
          <FontAwesomeIcon icon={["fab", "whatsapp"]} />
        </a>

        <a
          href="https://www.facebook.com/Mr.ProfessionalOfficial#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="hover:text-blue-500 transition-colors"
        >
          <FontAwesomeIcon icon={["fab", "facebook-f"]} />
        </a>

        <a
          href="https://www.instagram.com/mrprofessional.official/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="hover:text-pink-400 transition-colors"
        >
          <FontAwesomeIcon icon={["fab", "instagram"]} />
        </a>

        <a
          href="https://x.com/MrProfe19311696"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter / X"
          className="hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={["fab", "x-twitter"]} />
        </a>

        <a
          href="https://www.linkedin.com/company/mrprofessionalofficial/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:text-blue-400 transition-colors"
        >
          <FontAwesomeIcon icon={["fab", "linkedin-in"]} />
        </a>
      </div>

    </div>
  );
};

export default NavProfile;
