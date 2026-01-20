import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, fab);

const TESTIMONIALS = [
  {
    id: 1,
    name: "Himanshu Karia",
    designation: "Director",
    company: "Autogrid Mobility Pvt Ltd",
    initials: "H",
    rating: 5,
    text:
      "The people in the organization are highly professional and helped me throughout the work in the best possible manner.",
  },
  {
    id: 2,
    name: "Lalla Singh",
    designation: "Director",
    company: "Arifin India Nidhi Limited",
    initials: "L",
    rating: 5,
    text:
      "The best consultants I’ve worked with. The approach towards work is highly professional and effective. An energetic team.",
  },
  {
    id: 3,
    name: "Amit Keshari",
    designation: "Director",
    company: "Trueon Lifesciences (OPC) Pvt Ltd",
    initials: "A",
    rating: 5,
    text:
      "The services from Mr. Professional are best in class. The support they provide throughout the work is best in the segment.",
  },
  {
    id: 4,
    name: "Deepesh Kurupath",
    designation: "Founder & CEO",
    company: "CargoFL (Innovative Technologies Pvt Ltd)",
    initials: "D",
    rating: 5,
    text:
      "The best in class service provider in the segment. A very cooperative and understanding team which assists and helps to understand all technicalities very effectively.",
  },
  {
    id: 5,
    name: "Arya Chaurasia",
    designation: "CEO",
    company: "Profitance Pvt Ltd",
    initials: "A",
    rating: 5,
    text:
      "The team work is best as I know this team had done my work well before time. I am glad to work with this organization. The team is so supportive and helpful. The best chartered accountant team you have.",
  },
];


const PER_PAGE_DESKTOP = 3;
const PER_PAGE_MOBILE = 1;

const TestimonialsSection = () => {
    const [page, setPage] = useState(0);
    const [isHover, setIsHover] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const resize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    const PER_PAGE = isMobile ? PER_PAGE_MOBILE : PER_PAGE_DESKTOP;
    const totalPages = Math.ceil(TESTIMONIALS.length / PER_PAGE);
    const start = page * PER_PAGE;
    const visible = TESTIMONIALS.slice(start, start + PER_PAGE);

    const goPrev = () =>
        setPage((p) => (p === 0 ? totalPages - 1 : p - 1));
    const goNext = () =>
        setPage((p) => (p === totalPages - 1 ? 0 : p + 1));

    useEffect(() => {
        if (isHover) return;
        const id = setInterval(() => {
            setPage((p) => (p === totalPages - 1 ? 0 : p + 1));
        }, 3000);
        return () => clearInterval(id);
    }, [isHover, totalPages]);

    return (
        <section
            className="
                py-24
                bg-(--bg-secondary)
                text-(--text-primary)
            "
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div className="max-w-6xl mx-auto px-4 text-(--text-primary)">

                {/* Heading */}
                <div className="text-center mb-10">
                    <p className="text-[23px] md:text-2xl font-semibold text-(--color-brand)">
                        "Explore how Company has helped businesses reach new heights as their trusted partner."
                    </p>
                    <div className="w-16 h-1 bg-green-400 mx-auto mt-4 rounded-full" />
                </div>

                {/* Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8">

                    {/* LEFT */}
                    <div className="space-y-6 text-center lg:text-left">
                        <h3 className="text-xl md:text-2xl font-bold text-green-400">
                            Testimonials
                        </h3>

                        <RatingRow
                            iconClass={['fab', 'google']}
                            iconBg="bg-[var(--bg-main)]"
                            iconColor="text-[#4285F4]"
                            label="Google Customer Rating"
                            score="4.7"
                        />

                        {/* Arrows */}
                        <div className="hidden lg:flex items-center gap-3 mt-6">
                            <button
                                onClick={goPrev}
                                className="h-9 w-9 rounded-full bg-(--bg-main) text-[#03538e] flex items-center justify-center shadow"
                            >
                                <FontAwesomeIcon icon={['fas', 'chevron-left']} />
                            </button>
                            <button
                                onClick={goNext}
                                className="h-9 w-9 rounded-full bg-(--bg-main) text-[#03538e] flex items-center justify-center shadow"
                            >
                                <FontAwesomeIcon icon={['fas', 'chevron-right']} />
                            </button>
                        </div>
                    </div>

                    {/* SLIDER */}
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {visible.map((t) => (
                                <div
                                    key={t.id}
                                    className="bg-(--bg-main) rounded-3xl shadow-lg px-6 py-6 border-b-4 border-b-(--color-brand)
                                        flex flex-col justify-between min-h-80"
                                >
                                    <div>
                                        <FontAwesomeIcon
                                            icon={['fas', 'quote-left']}
                                            className="text-(--color-brand) mb-3"
                                        />
                                        <p className="text-[19px] leading-relaxed text-(--text-secondary)">
                                            {t.text}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 mt-5 pt-4 border-t">
                                        <div className="h-10 w-10 rounded-full bg-(--color-brand)/10 flex items-center justify-center font-bold">
                                            {t.initials}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-[19px]">
                                                {t.name}
                                            </span>
                                            <div className="flex items-center gap-2 text-[17px]">
                                                <FontAwesomeIcon
                                                    icon={['fab', 'google']}
                                                    className="text-[#4285F4]"
                                                />
                                                <Stars count={t.rating} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* DOTS */}
                        <div className="flex justify-center gap-2 mt-4">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`h-2 w-2 rounded-full ${i === page
                                        ? "bg-(--color-brand)"
                                        : "bg-(--text-secondary)/40"
                                        }`}
                                />
                            ))}
                        </div>
                        {/* MOBILE arrows (below dots) */}
                        <div className="flex lg:hidden justify-center gap-4 mt-4">
                            <button
                                onClick={goPrev}
                                className="h-9 w-9 rounded-full bg-(--bg-main) text-[#03538e]
      flex items-center justify-center shadow hover:bg-(--bg-hover)"
                            >
                                <FontAwesomeIcon icon={['fas', 'chevron-left']} />
                            </button>

                            <button
                                onClick={goNext}
                                className="h-9 w-9 rounded-full bg-(--bg-main) text-[#03538e]
      flex items-center justify-center shadow hover:bg-(--bg-hover)"
                            >
                                <FontAwesomeIcon icon={['fas', 'chevron-right']} />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

const RatingRow = ({
    iconClass,
    iconBg,
    iconColor,
    label,
    score,
    customInner,
}) => (
    <div className="flex items-center gap-3">
        <div
            className={`flex items-center justify-center h-8 w-8 rounded-full ${iconBg} ${iconColor} text-xl`}
        >
            {customInner ? (
                <span className="text-[17px] font-bold">{customInner}</span>
            ) : (
                <FontAwesomeIcon icon={iconClass} />
            )}
        </div>
        <div>
            <div className="font-semibold">{label}</div>
            <div className="flex items-center gap-2">
                <span className="font-bold">{score}</span>
                <Stars count={5} />
            </div>
        </div>
    </div>
);

const Stars = ({ count = 5 }) => (
    <span className="flex items-center gap-0.5 text-yellow-300">
        {Array.from({ length: 5 }).map((_, i) => (
            <FontAwesomeIcon
                key={i}
                icon={['fas', 'star']}
                className={i < count ? "opacity-100" : "opacity-30"}
            />
        ))}
    </span>
);

export default TestimonialsSection;

