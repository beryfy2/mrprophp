import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import SearchBar from "./SearchBar";

library.add(fas, far, fab);

const NavProfile = ({ hidden = false, transparent = false }) => {
  return (
    <div
      className="w-full text-(--text-primary) text-[19px] px-6 flex items-center justify-between"
      style={{
        background: transparent ? "transparent" : "var(--bg-secondary)",
        height: "56px",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 300ms ease, background-color 300ms ease",
        zIndex: 1200,
        backdropFilter: transparent ? "saturate(180%) blur(6px)" : "none",
      }}
    >
      {/* Contact Details */}
      <div className="flex items-center gap-8">
        <span className="font-semibold flex items-center gap-2 leading-none">
          <FontAwesomeIcon icon={["fas", "envelope"]} style={{ color: "var(--color-brand)" }} />
          <span className="cursor-pointer hover:text-(--color-brand-hover)">info@mrprofessional.co.in</span>
        </span>

        <span className="font-semibold flex items-center gap-2 leading-none">
          <FontAwesomeIcon icon={["fas", "phone"]} style={{ color: "var(--color-brand)" }} />
          <span className="cursor-pointer hover:text-(--color-brand-hover)">+918800932090</span>
        </span>
      </div>

    

      {/* Socials media */}
      <div className="hidden md:flex items-center gap-4 text-[23px]">
        <a
          href="https://wa.me/+918800932090"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <FontAwesomeIcon
            className="cursor-pointer hover:text-(--color-brand-hover)"
            icon={["fab", "whatsapp"]}
          />
        </a>

        <a
          href="https://www.facebook.com/Mr.ProfessionalOfficial#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FontAwesomeIcon
            className="cursor-pointer hover:text-blue-500"
            icon={["fab", "facebook-f"]}
          />
        </a>

        <a
          href="https://www.instagram.com/mrprofessional.official/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FontAwesomeIcon
            className="cursor-pointer hover:text-pink-400"
            icon={["fab", "instagram"]}
          />
        </a>

        <a
          href="https://x.com/MrProfe19311696"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter / X"
        >
          <FontAwesomeIcon
            className="cursor-pointer hover:text-(--text-primary)"
            icon={["fab", "x-twitter"]}
          />
        </a>

        <a
          href="https://www.linkedin.com/company/mrprofessionalofficial/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FontAwesomeIcon
            className="cursor-pointer hover:text-blue-300"
            icon={["fab", "linkedin-in"]}
          />
        </a>
      </div>
    </div>
  );
};

export default NavProfile;

