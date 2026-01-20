import { useEffect, useRef, useState } from "react";

/**
 * Enhanced useScrollState hook with better performance and features
 * @param {Object} options - Configuration options
 * @param {number} options.lowerStickyThreshold - Threshold for sticky navbar (default: 220)
 * @param {number} options.scrollThreshold - Minimum scroll delta to trigger hide/show (default: 5)
 * @param {number} options.topOffset - Offset from top to start hiding (default: 20)
 * @returns {Object} { hideUpper, lowerSticky, scrollY, scrollDirection, isAtTop }
 */
export default function useScrollState({ 
    lowerStickyThreshold = 220,
    scrollThreshold = 5,
    topOffset = 20
} = {}) {
    const [hideUpper, setHideUpper] = useState(false);
    const [lowerSticky, setLowerSticky] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('up');
    const [isAtTop, setIsAtTop] = useState(true);
    const lastY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
    const ticking = useRef(false);

    useEffect(() => {
        function onScroll() {
            const currentY = window.scrollY;
            
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const delta = currentY - lastY.current;
                    const absDelta = Math.abs(delta);

                    // Update scroll position
                    setScrollY(currentY);
                    setIsAtTop(currentY <= 10);

                    // Determine scroll direction
                    if (absDelta > 2) {
                        setScrollDirection(delta > 0 ? 'down' : 'up');
                    }

                    // Enhanced hide/show logic with smoother transitions
                    if (delta > scrollThreshold && currentY > topOffset) {
                        setHideUpper(true);
                    } else if (delta < -scrollThreshold || currentY <= topOffset) {
                        setHideUpper(false);
                    }

                    // Sticky when scrolled beyond threshold with smooth transition
                    setLowerSticky(currentY >= lowerStickyThreshold);

                    lastY.current = currentY;
                    ticking.current = false;
                });
                ticking.current = true;
            }
        }

        // Throttle scroll events for better performance
        function throttledScroll() {
            if (!ticking.current) {
                onScroll();
            }
        }

        window.addEventListener("scroll", throttledScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", throttledScroll);
        };
    }, [lowerStickyThreshold, scrollThreshold, topOffset]);

    return { 
        hideUpper, 
        lowerSticky, 
        scrollY, 
        scrollDirection, 
        isAtTop 
    };
}
