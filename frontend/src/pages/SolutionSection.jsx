import React from "react";

const SolutionSection = () => {
    return (
        <section className="bg-(--bg-main) py-20">
            <div className="max-w-6xl mx-auto px-4">
                {/* Heading */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-(--text-primary)">
                        Mr.Professional
                    </h2>
                    <p className="mt-3 text-(--text-secondary) max-w-2xl mx-auto">
                        Incubation-driven professional services for India’s startup ecosystem
                    </p>
                </div>

                {/* Content */}
                <div className="bg-(--bg-secondary) rounded-2xl p-8 md:p-12 shadow-md border border-(--border-color) text-(--text-secondary) text-justify text-[15px] md:text-[21px] leading-relaxed space-y-4">
                    <p>
                        <span className="font-semibold text-(--text-primary)">
                            Mr.Professional
                        </span>{" "}
                        is a fast-growing incubation-driven professional services brand.Headquartered in Ghaziabad, Uttar Pradesh. The organization provides
                        technology-enabled incubation and professional services to entrepreneurs
                        across India, both online and offline.
                    </p>

                    <p>
                        With <span className="font-semibold text-(--text-primary)">8 offices nationwide</span>,
                        a young team of Chartered Accountants, Company Secretaries, legal experts,
                        and IIM-trained professionals, Mr.Professional supports startups from
                        ideation to growth by simplifying business setup, compliance, and legal
                        processes.
                    </p>

                    <p>
                        Recognized among the{" "}
                        <span className="font-semibold text-(--text-primary)">
                            Top 400 Startups in India
                        </span>{" "}
                        with Angel Tax Exemption approval, Mr.Professional works closely with GoUP
                        Innovation Hub (AKTU), supports startups across leading institutions, and
                        currently empowers{" "}
                        <span className="font-semibold text-(--text-primary)">
                            2,510+ B2B startups
                        </span>{" "}
                        nationwide as a partner of the Government of Uttar Pradesh, BSE, and Amazon.
                    </p>
                </div>

            </div>
        </section>
    );
};

export default SolutionSection;

