import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const IMG_SRCS = [
  '/assets/services/residential/residential-plumbing.png',
  '/assets/services/commercial/commercial-plumbing.png',
];
const IMG_ALTS = ['Residential Plumbing', 'Commercial Plumbing'];
const REVERSE = [false, true];
// Anchor ids (ServicesPage.jsx §residential/§commercial) and the CTA i18n keys
// (services.ctaResidential/ctaCommercial), by index. These must stay in English
// regardless of locale — deriving them from svc.label instead broke on Spanish,
// where label is "Residencial"/"Comercial": the built key ("ctaResidencial")
// matched nothing in either locale file (raw key rendered as visible text), and
// the built anchor ("#residencial") matched no element id on the services page.
const SLUGS = ['residential', 'commercial'];
const CTA_KEYS = ['ctaResidential', 'ctaCommercial'];

const cardVariant = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.25, 0.1, 0.25, 1] } },
};

const imageVariant = (reverse) => ({
  hidden: { opacity: 0, x: reverse ? -48 : 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] } },
});

const Services = () => {
  const { t } = useTranslation();
  const items = t('services.items', { returnObjects: true });

  return (
    <section id="services" style={{ padding: 'clamp(40px, 5vw, 80px) 0 clamp(80px, 10vw, 160px) 0', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        {Array.isArray(items) && items.map((svc, idx) => (
          <motion.div
            // SLUGS[idx] ('residential'/'commercial'), not svc.title: the title
            // is translated, so keying on it changes the key when the language
            // toggle is clicked. React then remounts the row, resetting this
            // motion.div and its clipPath image reveal to their `hidden`
            // initial state — and since the reveal is `whileInView` +
            // `once: true`, a row the visitor has already scrolled past never
            // re-fires and stays invisible until a reload.
            key={SLUGS[idx]}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '64px',
              alignItems: 'center',
              flexDirection: REVERSE[idx] ? 'row-reverse' : 'row',
              marginBottom: idx === items.length - 1 ? '64px' : '160px',
            }}
          >
            {/* Text */}
            <motion.div variants={cardVariant} style={{ flex: '1 1 400px' }}>
              <div style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px', fontSize: '0.8rem', fontWeight: 500 }}>
                {svc.label}
              </div>
              <h3 style={{ color: '#1d1d1f', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '24px', fontWeight: 600, lineHeight: 1.1 }}>
                {svc.title}
              </h3>
              <p style={{ color: 'rgba(29,29,31,0.68)', fontSize: '1.1rem', lineHeight: 1.75 }}>
                {svc.body}
              </p>
              {svc.label ? (
                <Link
                  to={`/services#${SLUGS[idx]}`}
                  style={{
                    display: 'inline-block',
                    marginTop: '24px',
                    padding: '12px 24px',
                    background: '#1d1d1f',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {t(`services.${CTA_KEYS[idx]}`)}
                </Link>
              ) : null}
            </motion.div>

            {/* Image — valve-open clipPath reveal; amount:0 fires as soon as any edge enters viewport */}
            <motion.div
              variants={imageVariant(REVERSE[idx])}
              style={{ flex: '1 1 400px', borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3' }}
            >
              <motion.div
                initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                whileInView={{ clipPath: 'circle(150% at 50% 50%)' }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 1.1, delay: 0.2, ease: [0, 0, 0.2, 1] }}
                style={{ width: '100%', height: '100%' }}
              >
                <img
                  src={IMG_SRCS[idx]}
                  alt={IMG_ALTS[idx]}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
        
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '32px' }}
        >
          <Link
            to="/services"
            style={{
              display: 'inline-block',
              padding: '16px 36px',
              background: '#1d1d1f',
              color: '#fff',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: '0 4px 14px rgba(29, 29, 31, 0.15)',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {t('servicesSection.ctaMore')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
