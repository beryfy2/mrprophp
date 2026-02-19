import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBars, faFire } from "@fortawesome/free-solid-svg-icons";
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

export default function NavItems({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const navCenterRef = useRef(null);

  const [navItems, setNavItems] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [titlesByNav, setTitlesByNav] = useState({});
  const [hoverTitleId, setHoverTitleId] = useState(null);
  const [subtitlesByTitle, setSubtitlesByTitle] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/nav-items`)
      .then(r => r.json())
      .then(setNavItems)
      .catch(console.error);
  }, []);

  const slugify = t =>
    t.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");

  return (
    <div className="bg-[var(--bg-main)] border-b border-white/10">
      <div className="max-w-[1320px] mx-auto px-8 h-[72px] flex items-center justify-between">

        {/* LOGO */}
        <img
          src={logo}
          alt="Mr Professional"
          className="h-10 lg:h-11 w-auto cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* DESKTOP NAV */}
        <ul
          ref={navCenterRef}
          className="hidden lg:flex items-center gap-10 text-[16px] font-semibold tracking-wide"
        >
          {STATIC_NAV.map(item => (
            <li key={item.label}>
              <button
                onClick={() => navigate(item.path)}
                className="hover:text-[var(--color-brand)] transition-colors duration-200 cursor-pointer"
              >
                {item.label}
              </button>
            </li>
          ))}

          {navItems.map(nav => (
            <li
              key={nav._id}
              className="relative"
              onMouseEnter={() => setOpenMenu(nav._id)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button className="flex items-center gap-2 hover:text-[var(--color-brand)] transition">
                {nav.name}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-[13px] transition ${openMenu === nav._id ? "rotate-180" : ""}`}
                />
              </button>

              {openMenu === nav._id && (
                <DynamicMenu
                  navId={nav._id}
                  titlesByNav={titlesByNav}
                  setTitlesByNav={setTitlesByNav}
                  hoverTitleId={hoverTitleId}
                  setHoverTitleId={setHoverTitleId}
                  subtitlesByTitle={subtitlesByTitle}
                  setSubtitlesByTitle={setSubtitlesByTitle}
                  anchorEl={navCenterRef.current}
                  onSelect={name => navigate(`/services/${slugify(name)}`)}
                />
              )}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          to="/partners-signup"
          className="hidden lg:inline-flex items-center justify-center
          px-6 py-2.5 rounded-full
          border-2 border-[var(--color-brand)]
          text-[15px] font-semibold
          text-[var(--color-brand)]
          hover:bg-[var(--color-brand)]
          hover:text-white
          transition-all duration-300"
        >
          Partner With Us
        </Link>

        {/* MOBILE ICON */}
        <button
          className="lg:hidden text-2xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
    </div>
  );
}

/* ================= MEGA MENU ================= */

function DynamicMenu({
  navId,
  titlesByNav,
  setTitlesByNav,
  hoverTitleId,
  setHoverTitleId,
  subtitlesByTitle,
  setSubtitlesByTitle,
  anchorEl,
  onSelect,
}) {
  const [pos, setPos] = useState({});

  useEffect(() => {
    const rect = anchorEl?.getBoundingClientRect();
    if (!rect) return;

    setPos({
      left: rect.left + rect.width / 2 - 360,
      top: rect.bottom + 14,
      width: 720,
    });
  }, [anchorEl]);

  useEffect(() => {
    if (!titlesByNav[navId]) {
      fetch(`${API_BASE}/nav-items/${navId}/titles`)
        .then(r => r.json())
        .then(t => setTitlesByNav(p => ({ ...p, [navId]: t })));
    }
  }, [navId]);

  return (
    <div className="fixed z-50" style={pos}>
      <div className="bg-[var(--bg-main)] rounded-xl shadow-2xl border border-white/10">
        <div className="grid grid-cols-2 gap-6 px-6 py-5 text-[15px]">

          <div>
            {titlesByNav[navId]?.map(t => (
              <button
                key={t._id}
                onMouseEnter={() => {
                  setHoverTitleId(t._id);
                  if (!subtitlesByTitle[t._id]) {
                    fetch(`${API_BASE}/titles/${t._id}/subtitles`)
                      .then(r => r.json())
                      .then(s => setSubtitlesByTitle(p => ({ ...p, [t._id]: s })));
                  }
                }}
                className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
              >
                {t.title}
              </button>
            ))}
          </div>

          <div>
            {subtitlesByTitle[hoverTitleId]?.map((s, i) => (
              <button
                key={s._id}
                onClick={() => onSelect(s.title)}
                className="flex items-center gap-2 py-1.5 hover:text-[var(--color-brand)]"
              >
                {s.title}
                {i < 2 && <FontAwesomeIcon icon={faFire} />}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
