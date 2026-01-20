import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

const FEATURES = [
    { icon: ["fas", "users"], title: "One Stop Corporate", subtitle: "Solution" },
    { icon: ["fas", "indian-rupee-sign"], title: "PAN India", subtitle: "Services" },
    { icon: ["fas", "user-tie"], title: "Free Expert", subtitle: "Assistance" },
    { icon: ["fas", "check-circle"], title: "Google Verified", subtitle: "Business" },
    { icon: ["fas", "headset"], title: "Dedicated Support", subtitle: "Staff" },
    { icon: ["fas", "rotate-left"], title: "Money-Back", subtitle: "Guarantee" },
];

const WhyCompanySection = () => {
    return (
        <section className="bg-(--bg-main) py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4">

                {/* Top text */}
                <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold text-(--text-primary) mb-3">
                        Why Us?
                    </h2>

                    <p className="text-(--text-secondary) text-[17px] md:text-[19px] leading-relaxed max-w-3xl mx-auto">
                        At Mr Professional, we leverage our industry knowledge and
                        expertise to help businesses navigate complex regulations, minimize
                        risks, and optimize operations for maximum efficiency and
                        profitability.
                        <br />
                       
                    </p>
                </div>

                {/* FEATURES GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 md:gap-x-10 md:gap-y-10">
                    {FEATURES.map((item) => (
                        <div
                            key={item.title}
                            className="flex items-center gap-4 bg-(--bg-main) border border-(--border-color) rounded-xl
                                shadow-md
                                px-5 py-5 md:px-6 md:py-6 
                                hover:-translate-y-1 hover:shadow-lg
                                transition-all duration-300"
                        >
                            {/* ICON */}
                            <div className="relative shrink-0">
                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-full 
                                    bg-linear-to-b from-[#007C82] to-[#007C82]
                                    flex items-center justify-center
                                    shadow-[0_10px_25px_rgba(0,150,0,0.4)]">

                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className="text-white text-[21px] md:text-[23px]"
                                    />
                                </div>

                                <div className="absolute inset-0 rounded-full border border-(--border-color)"></div>
                            </div>

                            {/* Text */}
                            <div className="text-(--text-primary) text-[17px] md:text-[19px] font-semibold leading-snug">
                                <div>{item.title}</div>
                                {item.subtitle && <div>{item.subtitle}</div>}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default WhyCompanySection;

