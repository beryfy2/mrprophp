import React, { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const BASE_URL = API_BASE.replace("/api", "");

const MediaCoverage = () => {
    const [mediaItems, setMediaItems] = useState([]);
    const [current, setCurrent] = useState(0);
    const [hover, setHover] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const touchStart = useRef(null);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await fetch(`${API_BASE}/public/media`);
                if (res.ok) {
                    const data = await res.json();
                    setMediaItems(
                        data.map((item) => ({
                            id: item._id,
                            outlet: item.publication,
                            logo: item.photo ? `${BASE_URL}${item.photo}` : null,
                            heading: item.title,
                            body: [item.content],
                            link: item.link,
                        }))
                    );
                }
            } catch (e) {
                console.error("Failed to fetch media", e);
            }
        };
        fetchMedia();

        const resize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    /* SLIDES */
    const slides = useMemo(() => {
        if (mediaItems.length === 0) return [];

        if (isMobile) {
            return mediaItems.map((item) => [item]);
        }

        const arr = [];
        for (let i = 0; i < mediaItems.length; i += 2) {
            arr.push(mediaItems.slice(i, i + 2));
        }
        return arr;
    }, [isMobile, mediaItems]);

    /* AUTO PLAY */
    useEffect(() => {
        if (hover || slides.length === 0) return;
        const id = setInterval(() => {
            setCurrent((p) => (p + 1) % slides.length);
        }, 4500);
        return () => clearInterval(id);
    }, [hover, slides.length]);

    const prev = () =>
        setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));
    const next = () =>
        setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));

    if (mediaItems.length === 0) {
        return (
            <section className="bg-(--bg-main) py-16 overflow-x-hidden">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-(--text-primary)">
                        Media Coverage
                    </h2>
                    <div className="h-1 w-24 bg-(--color-brand) mx-auto mt-3 rounded-full" />
                    <p className="mt-6 text-(--text-secondary)">
                        No media coverage available.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-(--bg-main) py-16 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4">

                {/* HEADING */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-(--text-primary)">
                        Media Coverage
                    </h2>
                    <div className="h-1 w-24 bg-(--color-brand) mx-auto mt-3 rounded-full" />
                </div>

                {/* SLIDER */}
                <div
                    className="relative overflow-hidden rounded-3xl border border-(--color-brand)
          shadow-xl bg-(--bg-secondary)"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onTouchStart={(e) =>
                        (touchStart.current = e.touches[0].clientX)
                    }
                    onTouchEnd={(e) => {
                        const diff =
                            touchStart.current - e.changedTouches[0].clientX;
                        if (diff > 60) next();
                        if (diff < -60) prev();
                    }}
                >

                    {/* SLIDES */}
                    <div
                        className="flex transition-transform duration-700 ease-out"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {slides.map((pair, idx) => (
                            <div
                                key={idx}
                                className="min-w-full grid gap-6 md:grid-cols-2
                px-4 py-6 md:px-12 md:py-12"
                            >
                                {pair.map((item) => (
                                    <MediaCard key={item.id} item={item} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* DOTS */}
                <div className="flex justify-center gap-2 mt-5">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-2 w-2 rounded-full transition ${i === current
                                    ? "bg-(--color-brand)"
                                    : "bg-(--text-secondary)/40"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ================= CARD ================= */

const MediaCard = ({ item }) => (
    <article className="flex flex-col h-full w-full overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-3 gap-3">
            <div className="min-w-0">
                <h3 className="text-[23px] font-semibold text-(--color-brand) truncate">
                    {item.outlet}
                </h3>
                <div className="mt-1 h-1 w-14 bg-(--color-brand) rounded-full" />
            </div>

            {item.logo && (
                <img
                    src={item.logo}
                    alt={item.outlet}
                    className="h-8 object-contain shrink-0"
                />
            )}
        </div>

        {/* TITLE */}
        <h4 className="text-[21px] font-semibold text-(--text-primary) mb-2 wrap-break-word">
            {item.heading}
        </h4>

        {/* BODY */}
        <div
            className="text-[19px] leading-relaxed text-(--text-secondary)
            space-y-2 flex-1 wrap-break-word"
        >
            {item.body.map((p, i) => (
                <p key={i} className="wrap-break-word">
                    {p}
                </p>
            ))}
        </div>

        {/* BUTTON */}
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center
                px-4 py-2 rounded-lg bg-(--color-brand)
                text-white text-[19px] font-semibold shadow
                hover:bg-(--color-brand-hover) transition"
        >
            Read More
        </a>
    </article>
);

export default MediaCoverage;

