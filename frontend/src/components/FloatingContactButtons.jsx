import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const FloatingContactButtons = () => {
    return (
        <div className="fixed right-6 bottom-6 z-50 flex flex-col items-center gap-3 p-1">
            <a
                href="tel:+918800932090"
                className="h-12 w-12 rounded-full bg-[#0b5e92] flex items-center justify-center text-white shadow-lg hover:scale-110 transition"
            >
                <FontAwesomeIcon icon={faPhone} size="sm" />
            </a>

            <a
                href="https://wa.me/+918800932090"
                target="_blank"
                rel="noreferrer"
                className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg hover:scale-110 transition"
            >
                <FontAwesomeIcon icon={faWhatsapp} size="sm" />
            </a>
        </div>
    );
};

export default FloatingContactButtons;

