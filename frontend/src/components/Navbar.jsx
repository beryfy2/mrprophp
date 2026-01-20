import React, { useState } from "react";
import NavProfile from "./NavProfile";
import NavItems from "./NavItems";
import useScrollState from "../hooks/useScrollState";

const NAVBAR_HEIGHT = 72;

const NavBar = () => {
    const { hideUpper, lowerSticky } = useScrollState({
        lowerStickyThreshold: 260,
    });

    const isMobile = window.innerWidth <= 640;
    const sticky = lowerSticky || isMobile;

    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <NavProfile hidden={hideUpper} />

            <div
                className={`w-full transition-all duration-300
        ${sticky
                        ? "fixed top-0 left-0 right-0 z-[1100]"
                        : "absolute top-14 left-0 right-0 z-[400]"
                    }`}
            >
                <NavItems
                    sticky={sticky}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />
            </div>

            {sticky && <div style={{ height: NAVBAR_HEIGHT }} />}
        </>
    );
};

export default NavBar;

