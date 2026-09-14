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

    // Reveal the real logo lockup left-to-right via clip-path
    tl.to('.loader-logo-mask', {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.6,
      ease: 'power2.inOut',
    }, 0);

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
        <div className="loader-logo-mask">
          <img
            src="/assets/brand/logo-badge-white.svg"
            alt="LFK Solutions LLC"
            className="loader-logo-img"
          />
        </div>

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
