import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const AboutSection = () => {
  const { t } = useTranslation();
  return (
    <section id="about" style={{ padding: 'clamp(80px, 10vw, 160px) 0', background: '#fff', color: '#1d1d1f' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', fontSize: '0.85rem', fontWeight: 600 }}>
            {t('nav.aboutUs')}
          </motion.div>
          <motion.h2 variants={fadeInUp} style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '32px' }}>
            {t('aboutSection.title')}
          </motion.h2>
          <motion.p variants={fadeInUp} style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'rgba(29,29,31,0.7)', maxWidth: '800px', margin: '0 auto', marginBottom: '48px' }}>
            {t('aboutSection.desc')}
          </motion.p>
          
          <motion.div variants={fadeInUp}>
            <Link
              to="/about"
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
              {t('aboutSection.cta')}
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;
