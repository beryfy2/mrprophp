import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const FloatingContactButtons = () => {
    return (
        <div className="fixed right-6 bottom-6 z-900">
            <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex flex-col items-center justify-center gap-2 p-2 shadow-lg">
                <a
                    href="tel:+918800932090"
                    className="h-8 w-8 rounded-full bg-[#0b5e92] flex items-center justify-center text-white shadow-lg hover:scale-110 transition"
                >
                    <FontAwesomeIcon icon={faPhone} size="sm" />
                </a>

                <a
                    href="https://wa.me/+918800932090"
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg hover:scale-110 transition"
                >
                    <FontAwesomeIcon icon={faWhatsapp} size="sm" />
                </a>
            </div>
        </div>
    );
};

export default FloatingContactButtons;

