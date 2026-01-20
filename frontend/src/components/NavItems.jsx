/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faFire, faBars } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/images/logo1.png";


const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const STATIC_NAV = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Team", path: "/team" },
  { label: "Our Works", path: "/works" },
  { label: "Contact", path: "/contact" },
  { label: "Achievements", path: "/achievements" },
];

export default function NavItems() {
  const navigate = useNavigate();
  const finalBg = "bg-[var(--bg-secondary)]";

  const [navItems, setNavItems] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [titlesByNav, setTitlesByNav] = useState({});
  const [hoverTitleId, setHoverTitleId] = useState(null);
  const [subtitlesByTitle, setSubtitlesByTitle] = useState({});
  const navCenterRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [activeTitle, setActiveTitle] = useState(null);

  const closeTimer = useRef(null);
  const openTimer = useRef(null);
  const leaveTimer = useRef(null);

  const menuHoveringRef = useRef(false);
  const headHoveringRef = useRef(false);

  /* ---------------- FETCH NAV ---------------- */
  useEffect(() => {
    fetch(`${API_BASE}/nav-items`)
      .then(r => r.json())
      .then(items => setNavItems(items || []))
      .catch(err => console.error(err));
  }, []);

  /* ---------------- CLOSE ON SCROLL ---------------- */
  useEffect(() => {
    const close = () => {
      setOpenMenu(null);
      setHoverTitleId(null);
    };
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, []);

  /* ---------------- HOVER LOGIC ---------------- */
  const open = (id) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(id);
    setHoverTitleId(null);

    if (!titlesByNav[id]) {
      fetch(`${API_BASE}/nav-items/${id}/titles`)
        .then(r => r.json())
        .then(t => setTitlesByNav(p => ({ ...p, [id]: t || [] })));
    }
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      if (!menuHoveringRef.current && !headHoveringRef.current) {
        setOpenMenu(null);
        setHoverTitleId(null);
      }
    }, 200);
  };

  const handleItemEnter = (id) => {
    headHoveringRef.current = true;
    clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => open(id), 80);
  };

  const handleItemLeave = () => {
    leaveTimer.current = setTimeout(() => {
      headHoveringRef.current = false;
      scheduleClose();
    }, 80);
  };

  const handleMenuEnter = () => {
    menuHoveringRef.current = true;
    clearTimeout(closeTimer.current);
  };

  const handleMenuLeave = () => {
    menuHoveringRef.current = false;
    scheduleClose();
  };

  const slugify = (t) =>
    t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const navigateToService = (name) => {
    navigate(`/services/${slugify(name)}`);
    setMobileOpen(false);
  };

  return (
    <div className={`${finalBg} shadow-lg`}>
      <div className="max-w-[1500px] mx-auto px-4 py-3 flex items-center">

        {/* LOGO */}
      <div className="flex-shrink-0">
  <img
  src={logo}
  alt="Mr.Professional Logo"
  className="h-9 sm:h-10 lg:h-11 w-auto object-contain cursor-pointer"
  onClick={() => navigate("/")}
/>

</div>


        {/* DESKTOP NAV */}
        <div
          ref={navCenterRef}
          className="hidden lg:flex items-center flex-1 justify-center"
        >
          <ul className="flex items-center gap-10 text-(--text-primary)">
            {STATIC_NAV.map(item => (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.path)}
                  className="hover:text-(--color-brand-hover) text-[18px]"
                >
                  {item.label}
                </button>
              </li>
            ))}

            {navItems.map(nav => {
              const isOpen = openMenu === nav._id;

              return (
                <li
                  key={nav._id}
                  className="relative"
                  onMouseEnter={() => handleItemEnter(nav._id)}
                  onMouseLeave={handleItemLeave}
                >
                  <button className="flex items-center gap-1 text-[18px]">
                    {nav.name}
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`text-[17px] transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <DynamicMenu
                      title={nav.name}
                      titles={titlesByNav[nav._id] || []}
                      hoverTitleId={hoverTitleId}
                      onHoverTitle={(id) => {
                        setHoverTitleId(id);
                        if (!subtitlesByTitle[id]) {
                          fetch(`${API_BASE}/titles/${id}/subtitles`)
                            .then(r => r.json())
                            .then(s =>
                              setSubtitlesByTitle(p => ({ ...p, [id]: s || [] }))
                            );
                        }
                      }}
                      subtitles={
                        hoverTitleId ? subtitlesByTitle[hoverTitleId] || [] : []
                      }
                      anchorEl={navCenterRef.current}
                      onMouseEnter={handleMenuEnter}
                      onMouseLeave={handleMenuLeave}
                      onSelectService={navigateToService}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* CTA */}
        <div className="hidden lg:flex flex-shrink-0 ml-8">
          <Link
            to="/partners-signup"
            className="px-8 py-2 rounded-full bg-(--color-brand)
                       text-white text-[19px] font-semibold
                       hover:opacity-90 transition
                       whitespace-nowrap"
          >
            Partner With Us
          </Link>
        </div>

        {/* MOBILE MENU */}
        <div className="lg:hidden ml-auto">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-[360px] bg-[#0b2b4b] text-white p-5">
            {STATIC_NAV.map(i => (
              <button
                key={i.label}
                className="block w-full py-3 border-b border-white/10 text-[18px]"
                onClick={() => {
                  navigate(i.path);
                  setMobileOpen(false);
                }}
              >
                {i.label}
              </button>
            ))}

            <Link
              to="/partners-signup"
              className="block mt-6 text-center py-3 rounded-full bg-(--color-brand)"
              onClick={() => setMobileOpen(false)}
            >
              Partner With Us
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= MEGA MENU ================= */

function DynamicMenu({
  title,
  titles,
  hoverTitleId,
  onHoverTitle,
  subtitles,
  anchorEl,
  onMouseEnter,
  onMouseLeave,
  onSelectService,
}) {
  const [pos, setPos] = useState({ left: 0, top: 120, width: 720 });

  useEffect(() => {
    const rect = anchorEl?.getBoundingClientRect();
    const vw = window.innerWidth;
    const width = Math.min(720, vw - 16);
    const left = rect
      ? rect.left + rect.width / 2 - width / 2
      : (vw - width) / 2;

    setPos({
      left: Math.max(8, left),
      top: rect ? rect.bottom + 14 : 120,
      width,
    });
  }, [anchorEl]);

  return (
    <div
      className="fixed z-50"
      style={pos}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-(--bg-secondary) rounded-2xl shadow-2xl border-t-4 border-(--color-brand)">
        <div className="px-6 py-5 grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-(--color-brand) font-semibold mb-2">Titles</h4>
            {titles.map(t => (
              <button
                key={t._id}
                onMouseEnter={() => onHoverTitle(t._id)}
                className={`block w-full text-left px-3 py-2 rounded-lg ${
                  hoverTitleId === t._id
                    ? "bg-(--bg-main)"
                    : "hover:bg-(--bg-main)"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>

          <div>
            <h4 className="text-(--color-brand) font-semibold mb-2">Subtitles</h4>
            {subtitles.map((s, i) => (
              <button
                key={s._id}
                onClick={() => onSelectService(s.title)}
                className="flex gap-2 text-[19px] hover:text-(--color-brand-hover)"
              >
                {s.title}
                {i < 2 && (
                  <FontAwesomeIcon icon={faFire} className="text-[17px]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

