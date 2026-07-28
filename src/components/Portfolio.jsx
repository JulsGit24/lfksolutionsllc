import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const CARD_W = 420;
const CARD_H = 300;
const RADIUS = 520;

const IMAGE_SRCS = [
  '/assets/hero-bathroom-remodel.png',
  '/assets/residential-plumbing.png',
  '/assets/commercial_pipelines.png',
  '/assets/remodeling.png',
  '/assets/gallery-tile.png',
  '/assets/bg_house_natural_pipes.png',
];

const Portfolio = () => {
  const { t } = useTranslation();
  const wrapperRef = useRef(null);
  const [modal, setModal] = useState(null);

  const projects = t('portfolio.projects', { returnObjects: true });
  const images = IMAGE_SRCS.map((src, i) => ({ src, title: projects[i] ?? '' }));

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  // Full 360° rotation over the scroll range — large perspective minimises depth scaling
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -360]);

  return (
    <section id="portfolio" style={{ position: 'relative' }}>
      <div ref={wrapperRef} style={{ height: '280vh', position: 'relative' }}>

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
            /* Large perspective value → minimal depth scaling on rotation */
            perspective: '5000px',
          }}
        >
          {/* Header */}
          <div style={{ position: 'absolute', top: '10%', zIndex: 10, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 500 }}>
                {t('portfolio.sectionLabel')}
              </div>
              <h2 style={{ color: '#1d1d1f', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, lineHeight: 1.1 }}>
                {t('portfolio.title')}
              </h2>
            </motion.div>
          </div>

          {/* 3D ring — rotates via scroll, no scale applied anywhere */}
          <motion.div
            style={{
              width: `${CARD_W}px`,
              height: `${CARD_H}px`,
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
                    transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                    backfaceVisibility: 'visible',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.55)',
                    cursor: 'pointer',
                    padding: 0,
                    border: 'none',
                    background: 'none',
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(255,255,255,0.85) 0%, transparent 55%)',
                      display: 'flex', alignItems: 'flex-end',
                      padding: '20px 24px',
                    }}
                  >
                    <span style={{ color: '#1d1d1f', fontWeight: 500, fontSize: '1.05rem' }}>{img.title}</span>
                  </div>
                  <div
                    style={{
                      position: 'absolute', top: '14px', right: '14px',
                      background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
                      borderRadius: '8px', padding: '5px 9px',
                      color: 'rgba(29,29,31,0.78)', fontSize: '0.68rem',
                      fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
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
              {/* Title bar */}
              <div
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(to top, rgba(255,255,255,0.9) 0%, transparent 100%)',
                  padding: '24px 24px 20px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                }}
              >
                <span style={{ color: '#1d1d1f', fontSize: '1.2rem', fontWeight: 600 }}>{modal.title}</span>
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
