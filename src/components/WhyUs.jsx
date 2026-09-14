import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const JOBBER_URL = 'https://clienthub.getjobber.com/hubs/9c82d445-943d-4c4a-9a4d-89953811941a/public/requests/1518206/embedded_new';


// Which item gets the brand-green number. Mirrors the single accented tile in the
// reference layout; change the index to move the emphasis.
const FEATURED_INDEX = 1;

const listVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const WhyUs = () => {
  const { t } = useTranslation();
  const items = t('whyUs.items', { returnObjects: true });

  return (
    <section id="why-us" style={{ padding: 'clamp(100px, 12vw, 160px) 0', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        <div className="wcu-layout">

          {/* Left ── label, accent rule, headline */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="wcu-eyebrow">{t('whyUs.sectionLabel')}</div>
            <div className="wcu-rule" />
            <h2 className="wcu-title">{t('whyUs.title')}</h2>
          </motion.div>

          {/* Right ── numbered reasons */}
          <motion.div
            className="wcu-grid"
            variants={listVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {items.map((item, i) => (
              <motion.div
                // Index, not item.title: the title is translated, so keying on
                // it changes every key when the language toggle is clicked.
                // React then unmounts and remounts each card, which resets this
                // motion.div to its `hidden` initial state (opacity 0) — and
                // because the reveal is `whileInView` + `once: true`, anything
                // the visitor has already scrolled past never re-fires and
                // stays invisible until a reload. The list is fixed-length and
                // never reordered, so the index is the stable identity here.
                key={i}
                variants={itemVariant}
                className={`wcu-item${i === FEATURED_INDEX ? ' is-featured' : ''}`}
              >
                <div className="wcu-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="wcu-item-title">{item.title}</h3>
                  <p className="wcu-item-desc">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ textAlign: 'center', marginTop: '64px' }}
        >
          <a
            href={JOBBER_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.05rem',
              boxShadow: '0 4px 14px rgba(0, 62, 30, 0.25)',
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
        </motion.div>

      </div>
    </section>
  );
};

export default WhyUs;
