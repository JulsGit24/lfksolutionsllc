import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Areas = () => {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState('va');

  const dcData = t('areas.dc', { returnObjects: true });
  const mdData = t('areas.md', { returnObjects: true });
  const vaData = t('areas.va', { returnObjects: true });

  const areaMap = { dc: dcData, md: mdData, va: vaData };
  const active = hovered ? areaMap[hovered] : null;

  const activeFill = 'rgba(29,29,31,0.78)';
  const activeStroke = 'rgba(29,29,31,0.95)';
  const idleFill = 'rgba(29,29,31,0.05)';
  const idleStroke = 'rgba(29,29,31,0.15)';

  const pathProps = (key) => ({
    fill: hovered === key ? activeFill : idleFill,
    stroke: hovered === key ? activeStroke : idleStroke,
    strokeWidth: '2',
    style: { cursor: 'pointer', transition: 'all 0.3s ease' },
    onMouseEnter: () => setHovered(key),
    onMouseLeave: () => setHovered('va'),
  });

  return (
    <section style={{ padding: '160px 0', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <div style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px', fontSize: '0.8rem', fontWeight: 500 }}>
            {t('areas.sectionLabel')}
          </div>
          <h2 style={{ color: '#1d1d1f', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 600, lineHeight: 1.1 }}>
            {t('areas.title')}
          </h2>
          <p style={{ color: 'rgba(29,29,31,0.5)', fontSize: '1.1rem', marginTop: '16px' }}>
            {t('areas.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', alignItems: 'center', justifyContent: 'center' }}
        >

          <div style={{ flex: '1 1 400px', maxWidth: '500px', position: 'relative' }}>
            <svg viewBox="0 0 400 400" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))' }}>
              <path
                d="M 50 150 L 150 50 L 350 80 L 380 250 L 250 250 L 220 180 L 180 180 L 180 220 L 100 200 Z"
                {...pathProps('md')}
              />
              <text x="250" y="120" fill={hovered === 'md' ? 'white' : '#1d1d1f'} fontSize="16" fontWeight="bold" pointerEvents="none" opacity={hovered === 'md' ? 1 : 0.45}>MARYLAND</text>

              <path
                d="M 20 300 L 100 200 L 180 220 L 180 260 L 250 320 L 150 380 L 50 350 Z"
                {...pathProps('va')}
              />
              <text x="80" y="300" fill={hovered === 'va' ? 'white' : '#1d1d1f'} fontSize="16" fontWeight="bold" pointerEvents="none" opacity={hovered === 'va' ? 1 : 0.45}>VIRGINIA</text>

              <path
                d="M 180 180 L 220 180 L 220 220 L 180 220 Z"
                {...pathProps('dc')}
              />
              <text x="230" y="210" fill={hovered === 'dc' ? 'white' : '#1d1d1f'} fontSize="14" fontWeight="bold" pointerEvents="none" opacity={hovered === 'dc' ? 1 : 0.7}>D.C.</text>
            </svg>
          </div>

          <div style={{ flex: '1 1 400px', maxWidth: '500px', minHeight: '220px', display: 'flex', alignItems: 'center' }}>
            <motion.div
              key={hovered ?? 'empty'}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ color: '#1d1d1f' }}
            >
              {active ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1B5E35', flexShrink: 0 }} />
                    <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: 600 }}>{active.title}</h3>
                  </div>
                  <p style={{ color: '#1d1d1f', fontSize: '1.1rem', lineHeight: 1.75 }}>{active.desc}</p>
                </>
              ) : (
                <div style={{ color: 'rgba(29,29,31,0.35)' }}>
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '14px' }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <p style={{ fontSize: '1.05rem' }}>{t('areas.placeholder')}</p>
                </div>
              )}
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default Areas;
