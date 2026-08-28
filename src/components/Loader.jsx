import React, { useEffect } from 'react';
import gsap from 'gsap';

const Loader = () => {
  useEffect(() => {
    document.body.classList.add('is-loading');

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('is-loading');
        const el = document.getElementById('sofi-loader');
        if (el) el.style.display = 'none';
      }
    });

    // Draw the SVG logo paths in white on dark-green
    tl.to('.svg-draw-path', {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power2.inOut',
      stagger: 0.1,
    });
    tl.to('.svg-draw-text', { opacity: 1, duration: 0.5, ease: 'power1.inOut' }, '-=0.5');

    // Orange progress bar fills left-to-right
    tl.to('.loader-progress-fill', { scaleX: 1, duration: 2.5, ease: 'power2.inOut' }, 0);

    // Panels wipe up/down revealing the page
    tl.to('.loader-panel.top-panel', { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '+=0.2');
    tl.to('.loader-panel.bottom-panel', { yPercent: 100, duration: 1, ease: 'power4.inOut' }, '<');

    // Fade logo content behind the wipe
    tl.to('.loader-content', { opacity: 0, duration: 0.5 }, '-=1');

    return () => tl.kill();
  }, []);

  return (
    <div
      id="sofi-loader"
      className="sofi-loader"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      {/* Green panels (top/bottom) */}
      <div className="loader-panel top-panel" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: 'var(--primary)' }} />
      <div className="loader-panel bottom-panel" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: 'var(--primary)' }} />

      {/* Logo + progress — sits above the panels */}
      <div className="loader-content" style={{ position: 'relative', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg
          className="loader-svg-logo"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '120px', height: '120px' }}
        >
          {/* Rounded border frame — white stroke */}
          <path
            className="svg-draw-path"
            d="M 180 70 L 180 40 Q 180 20 160 20 L 40 20 Q 20 20 20 40 L 20 160 Q 20 180 40 180 L 160 180 Q 180 180 180 160 L 180 130"
            stroke="white"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: 800, strokeDashoffset: 800 }}
          />
          {/* L — white */}
          <path
            className="svg-draw-path"
            d="M 50 70 L 50 130 L 75 130"
            stroke="white"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
          />
          {/* F — white */}
          <path
            className="svg-draw-path"
            d="M 90 130 L 90 70 L 115 70 M 90 100 L 110 100"
            stroke="white"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
          />
          {/* K vertical — white */}
          <path
            className="svg-draw-path"
            d="M 130 70 L 130 130"
            stroke="white"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
          />
          {/* K chevron accent — orange */}
          <path
            className="svg-draw-path accent"
            d="M 160 80 L 140 100 L 160 120"
            stroke="#FAA747"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
          />
          {/* Sub-text — white */}
          <text
            className="svg-draw-text"
            x="100"
            y="160"
            fill="white"
            fontFamily="Inter"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            letterSpacing="1"
            opacity="0"
          >
            Solutions, LLC
          </text>
        </svg>

        {/* Progress bar: dark-green track, orange fill */}
        <div
          className="loader-progress-bar"
          style={{
            width: '200px', height: '2px',
            background: 'rgba(255,255,255,0.2)',
            marginTop: '24px',
            overflow: 'hidden',
            borderRadius: '2px',
          }}
        >
          <div
            className="loader-progress-fill"
            style={{
              width: '100%', height: '100%',
              background: '#FAA747',
              transformOrigin: 'left',
              transform: 'scaleX(0)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
