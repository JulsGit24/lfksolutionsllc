import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const IMAGE_SRCS = [
  '/assets/home/featured/comm_plumbing_1.jpeg',
  '/assets/home/featured/comm_plumbing_2.jpeg',
  '/assets/home/featured/comm_plumbing_3.jpeg',
  '/assets/home/featured/commercial-plumbing.png',
  '/assets/home/featured/res_plumbing_1.jpeg',
  '/assets/home/featured/res_plumbing_2.jpeg',
  '/assets/home/featured/res_plumbing_3.jpeg',
  '/assets/home/featured/res_plumbing_4.jpeg',
  '/assets/home/featured/water-heater.png',
];

// Radius needed so N cards of width `cardW` sit edge-to-edge around a ring without
// overlapping, plus ~12% breathing room. Derived rather than hardcoded so adding or
// removing images keeps the ring correctly spaced.
const ringRadius = (cardW, count) =>
  Math.round((cardW / 2) / Math.tan(Math.PI / count) * 1.12);

const getResponsiveDimensions = (w, count) => {
  // scrollVH = total section height. The first 100vh is the pinned viewport, the
  // remainder is the scroll distance that drives the rotation.
  let base;
  if (w <= 480) base = { cardW: 210, cardH: 150, perspective: '1400px', scrollVH: 200 };
  else if (w <= 768) base = { cardW: 280, cardH: 200, perspective: '2000px', scrollVH: 230 };
  else if (w <= 1024) base = { cardW: 340, cardH: 240, perspective: '2800px', scrollVH: 260 };
  else base = { cardW: 420, cardH: 300, perspective: '5000px', scrollVH: 280 };

  return { ...base, radius: ringRadius(base.cardW, count) };
};

const Portfolio = () => {
  const { t } = useTranslation();
  const wrapperRef = useRef(null);
  const [modal, setModal] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const currentDragOffset = useRef(0);

  const cardCount = IMAGE_SRCS.length;

  const [dims, setDims] = useState(() =>
    getResponsiveDimensions(typeof window !== 'undefined' ? window.innerWidth : 1200, cardCount)
  );

  useEffect(() => {
    const handleResize = () => {
      setDims(getResponsiveDimensions(window.innerWidth, cardCount));
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [cardCount]);

  const projects = t('portfolio.projects', { returnObjects: true });
  const images = IMAGE_SRCS.map((src, i) => ({ src, title: Array.isArray(projects) ? (projects[i % projects.length] ?? '') : '' }));

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  // Full 360° rotation over the scroll range + touch drag offset
  const scrollRotateY = useTransform(scrollYProgress, [0, 1], [0, -360]);
  const rotateY = useTransform(scrollRotateY, v => v + dragOffset);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    currentDragOffset.current = dragOffset;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = (clientX - dragStartX.current) * 0.4;
    setDragOffset(currentDragOffset.current + diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    // NOTE: no `overflow: hidden` on this section. An overflow-clipped ancestor makes
    // itself the scroll container for `position: sticky` descendants, which silently
    // stops the viewport below from pinning. The sticky element clips its own overflow.
    <section id="portfolio" style={{ position: 'relative' }}>
      <div ref={wrapperRef} style={{ height: `${dims.scrollVH}vh`, position: 'relative' }}>

        {/* Sticky viewport */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: dims.perspective,
            touchAction: 'pan-y',
          }}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Header */}
          <div style={{ position: 'absolute', top: '8%', zIndex: 10, textAlign: 'center', padding: '0 16px' }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 500 }}>
                {t('portfolio.sectionLabel')}
              </div>
              <h2 style={{ color: '#1d1d1f', fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', fontWeight: 600, lineHeight: 1.1 }}>
                {t('portfolio.title')}
              </h2>
            </motion.div>
          </div>

          {/* 3D ring — rotates via scroll & touch, dynamically responsive to viewport */}
          <motion.div
            style={{
              width: `${dims.cardW}px`,
              height: `${dims.cardH}px`,
              position: 'relative',
              transformStyle: 'preserve-3d',
              rotateY,
            }}
          >
            {images.map((img, i) => {
              const angle = (i / images.length) * 360;
              return (
                <button
                  key={img.src}
                  onClick={() => setModal(img)}
                  aria-label={`Expand ${img.title}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    transform: `rotateY(${angle}deg) translateZ(${dims.radius}px)`,
                    backfaceVisibility: 'visible',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
                    cursor: 'pointer',
                    padding: 0,
                    border: 'none',
                    background: 'none',
                    userSelect: 'none',
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)',
                      borderRadius: '6px', padding: '4px 8px',
                      color: 'rgba(29,29,31,0.85)', fontSize: '0.62rem',
                      fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}
                  >
                    ↗ Expand
                  </div>
                </button>
              );
            })}
          </motion.div>

        </div>
      </div>

      {/* ── Expand-on-click modal ── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            key="portfolio-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setModal(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: '90vw', maxHeight: '88vh',
                borderRadius: '20px', overflow: 'hidden',
                boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
                position: 'relative',
              }}
            >
              <img
                src={modal.src}
                alt={modal.title}
                style={{ display: 'block', maxWidth: '90vw', maxHeight: '82vh', objectFit: 'contain' }}
              />
              <div
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '24px 24px 20px',
                  display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end',
                }}
              >
                <button
                  onClick={() => setModal(null)}
                  aria-label={t('portfolio.close')}
                  style={{
                    background: 'rgba(29,29,31,0.08)', border: 'none',
                    color: '#1d1d1f', padding: '8px 16px', borderRadius: '9999px',
                    cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {t('portfolio.close')} ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
