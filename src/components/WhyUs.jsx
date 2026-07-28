import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const JOBBER_URL = 'https://clienthub.getjobber.com/hubs/9c82d445-943d-4c4a-9a4d-89953811941a/public/requests/1518206/embedded_new';


const listVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariant = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

const WhyUs = () => {
  const { t } = useTranslation();
  const items = t('whyUs.items', { returnObjects: true });

  return (
    <section id="why-us" style={{ padding: '160px 0', position: 'relative' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          style={{ textAlign: 'center', marginBottom: '80px' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px', fontSize: '0.8rem', fontWeight: 500 }}>
            {t('whyUs.sectionLabel')}
          </div>
          <h2 style={{ color: '#1d1d1f', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 600, lineHeight: 1.1 }}>
            {t('whyUs.title')}
          </h2>
        </motion.div>

        <motion.div
          variants={listVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          style={{ maxWidth: '900px', margin: '0 auto' }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              variants={itemVariant}
              style={{
                display: 'flex',
                gap: '24px',
                padding: '32px 0',
                borderBottom: i === items.length - 1 ? 'none' : '1px solid rgba(29,29,31,0.08)',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ color: '#D4891A', fontSize: '1.4rem', fontWeight: 300, minWidth: '40px', paddingTop: '2px' }}>
                0{i + 1}
              </div>
              <div>
                <h3 style={{ fontSize: '1.45rem', marginBottom: '8px', fontWeight: 600, color: '#1d1d1f' }}>{item.title}</h3>
                <p style={{ color: 'rgba(29,29,31,0.62)', fontSize: '1.05rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

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
              background: '#D4891A',
              color: '#fff',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.05rem',
              boxShadow: '0 4px 14px rgba(212, 137, 26, 0.3)',
              transition: 'transform 0.2s, background 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = '#b87514';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = '#D4891A';
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
