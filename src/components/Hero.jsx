import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const JOBBER_URL =
  'https://clienthub.getjobber.com/hubs/9c82d445-943d-4c4a-9a4d-89953811941a/public/requests/1518206/embedded_new';

const Hero = () => {
  const { t } = useTranslation();
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);

  // Scroll tracking for the 400vh container
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  /* ── Force-play the video on mount ──
     iPadOS Safari and some Android tablet browsers silently reject
     the `autoPlay` HTML attribute even when `muted` + `playsInline`
     are present. A programmatic .play() after mount is the standard
     workaround. We also use an IntersectionObserver to pause the
     video when the hero scrolls out of view (saves battery/CPU on
     tablets) and resume it when it scrolls back. */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const tryPlay = () => {
      // Ensure muted attribute is set at the DOM level (some WebKit
      // builds ignore the JSX attribute on first paint)
      vid.muted = true;
      const p = vid.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Autoplay was blocked — attach a one-time user-gesture
          // listener so the video starts on the first tap/scroll
          const kick = () => {
            vid.play().catch(() => {});
            document.removeEventListener('touchstart', kick, true);
            document.removeEventListener('scroll', kick, true);
          };
          document.addEventListener('touchstart', kick, { once: true, capture: true, passive: true });
          document.addEventListener('scroll', kick, { once: true, capture: true, passive: true });
        });
      }
    };

    // Try playing once the browser says it has enough data
    if (vid.readyState >= 3) {
      tryPlay();
    } else {
      vid.addEventListener('canplay', tryPlay, { once: true });
    }

    // Pause/resume based on viewport visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(vid);

    return () => {
      vid.removeEventListener('canplay', tryPlay);
      observer.disconnect();
    };
  }, []);

  // Text Sequence 1: Main Headline (0-25%)
  const text1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0, 0.25], [0, -50]);

  // Text Sequence 2: Professional Quality (35-65%)
  const text2Opacity = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.35, 0.65], [50, -50]);

  // Text Sequence 3: Master Workmanship + CTAs (75-100%)
  const text3Opacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]);
  const text3Y = useTransform(scrollYProgress, [0.75, 1], [50, 0]);

  const overlayBg = useTransform(scrollYProgress, [0, 0.4, 0.5, 0.6, 1], [
    'rgba(0,0,0,0.5)', // Start somewhat dark for text
    'rgba(0,0,0,0.8)', // Darken during transition
    'rgba(0,0,0,0.8)', 
    'rgba(0,0,0,0.4)', // Lighten for Fernando
    'rgba(0,0,0,0.7)'  // Darken again for final CTA text
  ]);

  return (
    <section id="hero" style={{ position: 'relative', background: '#000' }}>
      {/* 400vh wrapper creates the long scroll timeline */}
      <div ref={wrapperRef} style={{ height: '400vh', position: 'relative' }}>
        
        {/* Sticky Viewport */}
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
          
          {/* Background Video Layer
              poster paints immediately while the video buffers so the hero
              is never a black rectangle on a slow connection.
              preload="auto" ensures enough data is buffered for autoplay
              on tablet browsers that reject preload="metadata". */}
          <video
            ref={videoRef}
            src="/assets/home/hero/hero-video.mp4"
            poster="/assets/home/hero/hero-poster.jpg"
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0
            }}
          />

          {/* Dynamic Overlay */}
          <motion.div style={{ position: 'absolute', inset: 0, background: overlayBg, zIndex: 1 }} />

          {/* Typography Layer */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px', zIndex: 2 }}>
            
            {/* Sequence 1 */}
            <motion.div style={{ position: 'absolute', opacity: text1Opacity, y: text1Y, maxWidth: '800px' }}>
              <h1 style={{ color: 'white', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}>
                {t('hero.seq1Title')}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', fontWeight: 500, letterSpacing: '0.01em', marginBottom: '40px' }}>
                {t('hero.seq1Subtitle')}
              </p>
            </motion.div>

            {/* Sequence 2 */}
            <motion.div style={{ position: 'absolute', opacity: text2Opacity, y: text2Y, maxWidth: '800px' }}>
              <h2 style={{ color: 'white', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '24px' }}>
                {t('hero.seq2Title')}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', fontWeight: 500 }}>
                {t('hero.seq2Subtitle')}
              </p>
            </motion.div>

            {/* Sequence 3 (Final CTA) */}
            <motion.div style={{ position: 'absolute', opacity: text3Opacity, y: text3Y, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ color: 'white', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '40px' }}>
                {t('hero.seq3Title')}
              </h2>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a
                  href={JOBBER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'var(--primary)', color: '#fff',
                    padding: '16px 32px', borderRadius: '9999px',
                    fontSize: '1.1rem', fontWeight: 600, textDecoration: 'none',
                    transition: 'transform 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.background = 'var(--primary-hover)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'var(--primary)';
                  }}
                >
                  {t('nav.freeEstimate')}
                </a>
                <a
                  href="tel:7038594908"
                  style={{
                    background: 'rgba(255,255,255,0.1)', color: 'white',
                    padding: '16px 32px', borderRadius: '9999px',
                    fontSize: '1.1rem', fontWeight: 600, textDecoration: 'none',
                    backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  {t('hero.ctaPhone')}
                </a>
                <a
                  href="tel:7038594908"
                  style={{
                    background: '#e63946', color: 'white',
                    padding: '16px 32px', borderRadius: '9999px',
                    fontSize: '1.1rem', fontWeight: 700, textDecoration: 'none',
                    border: '1px solid #ff4d4d',
                    boxShadow: '0 4px 14px rgba(230, 57, 70, 0.4)',
                    transition: 'background 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#d62828';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#e63946';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {t('hero.ctaEmergency')}
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
