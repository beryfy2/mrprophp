import React, { useMemo } from 'react';
import '../style/about-animated.css';

/**
 * AnimatedShapes
 * - Renders a layer of abstract geometric blocks that animate upward and rotate.
 * - Uses CSS animations for performance. JS only generates per-shape CSS variables.
 * - Props:
 *    - count: number of shapes to render (default 12)
 *    - className: additional class names for the container
 */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function AnimatedShapes({ count = 12, className = '' }) {
  // Tunable ranges - if you want to tweak defaults change these values
  const MIN_SIZE = 40; // px
  const MAX_SIZE = 260; // px
  const MIN_DURATION = 14; // s
  const MAX_DURATION = 30; // s
  const containerPadding = 0; // percent padding from edges

  const shapes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const w = Math.round(Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE);
      const h = Math.round(w * (0.7 + Math.random() * 0.6)); // varied aspect
      const left = Math.round(Math.random() * (100 - containerPadding * 2)) + containerPadding;
      const duration = (Math.random() * (MAX_DURATION - MIN_DURATION) + MIN_DURATION).toFixed(2);
      // negative delay so shapes are already mid-flight when page loads
      const delay = (-Math.random() * duration).toFixed(2);
      const rotateStart = Math.round((Math.random() - 0.5) * 60); // -30deg .. +30deg
      const opacity = (0.06 + Math.random() * 0.14).toFixed(2); // 0.06 - 0.20

      arr.push({ w, h, left, duration, delay, rotateStart, opacity });
    }
    return arr;
  }, [count]);

  return (
    <div className={`animated-shapes ${className}`} aria-hidden="true">
      {shapes.map((s, idx) => (
        <span
          key={idx}
          className="shape"
          style={{
            ['--w']: `${s.w}px`,
            ['--h']: `${s.h}px`,
            ['--left']: `${clamp(s.left, 0, 100)}%`,
            ['--duration']: `${s.duration}s`,
            ['--delay']: `${s.delay}s`,
            ['--rotate-start']: `${s.rotateStart}deg`,
            ['--shape-opacity']: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

