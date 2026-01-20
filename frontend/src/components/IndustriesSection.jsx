import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

const INDUSTRIES = [
    // row 1
    { label: "Apparels", icon: ["fas", "shirt"] },
    { label: "Gems and Jewellery", icon: ["fas", "gem"] },
    { label: "Chemicals", icon: ["fas", "flask"] },
    { label: "Hotel", icon: ["fas", "hotel"] },
    { label: "Health & Medical", icon: ["fas", "user-doctor"] },
    { label: "Tea & Coffee", icon: ["fas", "mug-hot"] },
    { label: "Rubber", icon: ["fas", "circle-dot"] },
    { label: "Handloom", icon: ["fas", "yarn"] },
    { label: "Automobile", icon: ["fas", "car-side"] },

    // row 2
    { label: "Footwear", icon: ["fas", "shoe-prints"] },
    { label: "Tourism & Hospitality", icon: ["fas", "umbrella-beach"] },
    { label: "Telecom", icon: ["fas", "tower-broadcast"] },
    { label: "Railways", icon: ["fas", "train"] },
    { label: "Food Processing", icon: ["fas", "bowl-food"] },
    { label: "Capital Goods", icon: ["fas", "industry"] },
    { label: "NGOs", icon: ["fas", "people-group"] },
    { label: "IT & BPM", icon: ["fas", "laptop-code"] },
    { label: "Tobacco", icon: ["fas", "smoking"] },

    // row 3
    { label: "Furniture", icon: ["fas", "couch"] },
    { label: "Consumer Electronics", icon: ["fas", "tv"] },
    { label: "Oils & Gas", icon: ["fas", "gas-pump"] },
    { label: "Liquor", icon: ["fas", "wine-bottle"] },
    { label: "Dangerous Goods", icon: ["fas", "skull-crossbones"] },
    { label: "Recycling", icon: ["fas", "recycle"] },
    { label: "Silk", icon: ["fas", "ribbon"] },
    { label: "Steel", icon: ["fas", "industry"] },
    { label: "Constructions", icon: ["fas", "city"] },
];

const IndustriesSection = () => {
    return (
        <section className="bg-[var(--bg-main)] py-12">
            <div className="max-w-6xl mx-auto px-3">
                <div className=" rounded-[20px] border border-[var(--color-brand)] bg-[var(--bg-secondary)] shadow-[0_14px_30px_rgba(0,0,0,0.1)] px-1.5 py-5 md:px-3">

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                            Industries Served by <span className="text-[var(--color-brand)]">Company</span>
                        </h2>
                        <div className="mt-3 h-1 w-32 bg-[var(--color-brand)] mx-auto rounded-full" />
                    </div>

                    {/* Outer frame */}
                    <div className="rounded-4xl border border-[var(--color-brand)] bg-[var(--bg-secondary)] shadow-[0_16px_40px_rgba(0,0,0,0.12)] overflow-hidden">
                        {/* background */}
                        <div className="bg-[var(--bg-secondary)]">
                            {/* 9 x 3 strict grid (tightly packed) */}
                            <div className="grid grid-cols-3 md:grid-cols-6 xl:grid-cols-9">
                                {INDUSTRIES.map((item) => (
                                    <IndustryTile
                                        key={item.label}
                                        label={item.label}
                                        icon={item.icon}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const IndustryTile = ({ label, icon }) => (
    <div className="relative group border-r border-b border-[var(--border-color)] last:border-r-0 xl:last:border-r border-opacity-60">
        <div className="flex h-[105px] md:h-[115px] xl:h-[120px] flex-col items-center justify-center gap-2 px-2 text-center bg-[var(--bg-secondary)] transition-colors duration-200 hover:bg-[var(--bg-main)]">
            <FontAwesomeIcon
                icon={icon}
                className="text-[26px] md:text-[28px] text-[var(--color-brand)]"
            />
            <p className="text-[var(--text-secondary)] text-[11px] md:text-[12px] font-medium leading-tight">
                {label}
            </p>
        </div>

        {/* green underline on hover, like in reference */}
        <div className="pointer-events-none absolute bottom-0 left-4 right-4 h-1 rounded-full bg-[var(--color-brand)] scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-200" />
    </div>
);

export default IndustriesSection;

