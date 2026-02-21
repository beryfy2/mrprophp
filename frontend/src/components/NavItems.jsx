import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faBars,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
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

  // Mobile states
  const [mobileActiveNav, setMobileActiveNav] = useState(null);
  const [mobileActiveTitle, setMobileActiveTitle] = useState(null);

  /* ---------------- FETCH NAV ---------------- */
  useEffect(() => {
    fetch(`${API_BASE}/nav-items`)
      .then((r) => r.json())
      .then((d) => setNavItems(d || []))
      .catch(console.error);
  }, []);

  const slugify = (t) =>
    t.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");

  return (
    <>
      {/* ================= TOP NAV ================= */}
      <div className="bg-[var(--bg-main)] border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-6 h-[72px] flex items-center justify-between">

          {/* LOGO */}
          <img
            src={logo}
            alt="Mr Professional"
            className="h-10 lg:h-11 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* ================= DESKTOP NAV ================= */}
          <ul
            ref={navCenterRef}
            className="hidden lg:flex items-center gap-10 text-[16px] font-semibold"
          >
            {STATIC_NAV.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.path)}
                  className="hover:text-[var(--color-brand)] transition"
                >
                  {item.label}
                </button>
              </li>
            ))}

            {navItems.map((nav) => (
              <li
                key={nav._id}
                className="relative"
                onMouseEnter={() => setOpenMenu(nav._id)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="flex items-center gap-2 hover:text-[var(--color-brand)]">
                  {nav.name}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-[13px] transition ${openMenu === nav._id ? "rotate-180" : ""
                      }`}
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
                    onSelect={(name) =>
                      navigate(`/services/${slugify(name)}`)
                    }
                  />
                )}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            to="/partners-signup"
            className="hidden lg:inline-flex px-6 py-2.5 rounded-full
                       border-2 border-[var(--color-brand)]
                       text-[var(--color-brand)]
                       font-semibold hover:bg-[var(--color-brand)]
                       hover:text-white transition"
          >
            Partner With Us
          </Link>

          {/* MOBILE ICON */}
          <div className="lg:hidden ml-auto">
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="text-2xl"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? "visible" : "invisible"
          }`}
      >
        {/* BACKDROP */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* SIDEBAR */}
        <div
          className={`absolute left-0 top-0 h-full w-[85%] max-w-[380px]
          bg-[#0b2b4b] text-white p-5 overflow-y-auto
          transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-[20px] font-semibold">Menu</span>
            <button onClick={() => setMobileOpen(false)}>
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
          </div>

          {/* STATIC NAV */}
          {STATIC_NAV.map((item) => (
            <button
              key={item.label}
              className="block w-full py-3 text-left border-b border-white/10 text-[18px]"
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}

          {/* SERVICES */}
          <div className="mt-4">
            {navItems.map((nav) => (
              <div key={nav._id} className="border-b border-white/10">

                <button
                  className="flex w-full justify-between items-center py-3 text-[18px]"
                  onClick={() => {
                    setMobileActiveNav(
                      mobileActiveNav === nav._id ? null : nav._id
                    );
                    setMobileActiveTitle(null);

                    if (!titlesByNav[nav._id]) {
                      fetch(`${API_BASE}/nav-items/${nav._id}/titles`)
                        .then((r) => r.json())
                        .then((t) =>
                          setTitlesByNav((p) => ({
                            ...p,
                            [nav._id]: t || [],
                          }))
                        );
                    }
                  }}
                >
                  {nav.name}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`transition ${mobileActiveNav === nav._id ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {mobileActiveNav === nav._id &&
                  titlesByNav[nav._id]?.map((t) => (
                    <div key={t._id} className="pl-4">
                      <button
                        className="flex w-full justify-between py-2 text-[16px]"
                        onClick={() => {
                          setMobileActiveTitle(
                            mobileActiveTitle === t._id ? null : t._id
                          );

                          if (!subtitlesByTitle[t._id]) {
                            fetch(
                              `${API_BASE}/titles/${t._id}/subtitles`
                            )
                              .then((r) => r.json())
                              .then((s) =>
                                setSubtitlesByTitle((p) => ({
                                  ...p,
                                  [t._id]: s || [],
                                }))
                              );
                          }
                        }}
                      >
                        {t.title}
                        <FontAwesomeIcon icon={faChevronDown} />
                      </button>

                      {mobileActiveTitle === t._id &&
                        subtitlesByTitle[t._id]?.map((s, i) => (
                          <button
                            key={s._id}
                            className="flex gap-2 pl-4 py-1 text-[15px]"
                            onClick={() => {
                              navigate(
                                `/services/${slugify(s.title)}`
                              );
                              setMobileOpen(false);
                            }}
                          >
                            {s.title}
                            {i < 2 && (
                              <FontAwesomeIcon icon={faFire} />
                            )}
                          </button>
                        ))}
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            className="mt-6 w-full py-3 rounded-full bg-[var(--color-brand)] font-semibold"
            onClick={() => {
              navigate("/partners-signup");
              setMobileOpen(false);
            }}
          >
            Partner With Us
          </button>
        </div>
      </div>
    </>
  );
}

/* ================= DESKTOP MEGA MENU ================= */

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
        .then((r) => r.json())
        .then((t) =>
          setTitlesByNav((p) => ({ ...p, [navId]: t || [] }))
        );
    }
  }, [navId]);

  return (
    <div className="fixed z-50" style={pos}>
      <div className="bg-[var(--bg-main)] rounded-xl shadow-2xl border border-white/10">
        <div className="grid grid-cols-2 gap-6 px-6 py-5 text-[15px]">
          <div>
            {titlesByNav[navId]?.map((t) => (
              <button
                key={t._id}
                onMouseEnter={() => {
                  setHoverTitleId(t._id);
                  if (!subtitlesByTitle[t._id]) {
                    fetch(
                      `${API_BASE}/titles/${t._id}/subtitles`
                    )
                      .then((r) => r.json())
                      .then((s) =>
                        setSubtitlesByTitle((p) => ({
                          ...p,
                          [t._id]: s || [],
                        }))
                      );
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