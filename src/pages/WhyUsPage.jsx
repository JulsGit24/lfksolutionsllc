import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import { PAGE_META } from '../seo/pageMeta';
import { breadcrumbSchema } from '../seo/schema';

// Shared animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const JOBBER_URL = "https://clienthub.getjobber.com/client_hubs/7a1db3da-bd72-4d40-9e5c-7888ff593a2e/login/new?source=share_login";

const WhyUsPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ paddingTop: 'clamp(80px, 10vw, 120px)', background: '#fbfbf9' }}>
      <Seo
        {...PAGE_META.whyUs}
        image="/assets/why-us/honesty.png"
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Why Us', path: '/why-us' },
          ]),
        ]}
      />

      {/* 1. Hero / Intro Section */}
      <section style={{ padding: 'clamp(40px, 8vw, 80px) 24px 0', textAlign: 'center', background: '#fbfbf9' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
            <motion.div variants={fadeInUp} style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', fontSize: '0.85rem', fontWeight: 600 }}>
              {t('nav.whyUs')}
            </motion.div>
            <motion.h1 variants={fadeInUp} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#1d1d1f', marginBottom: '32px' }}>
              {t('whyUsPageFull.pillarsTitle')}
            </motion.h1>
            <motion.p variants={fadeInUp} style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'rgba(29,29,31,0.7)', maxWidth: '800px', margin: '0 auto' }}>
              {t('whyUsPageFull.heroBody')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2. Core Pillars Section */}
      <section style={{ padding: 'clamp(60px, 10vw, 120px) 24px', background: '#fbfbf9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Pillar 1 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', alignItems: 'center', marginBottom: '120px' }}
          >
            <motion.div variants={fadeInUp} style={{ flex: '1 1 400px' }}>
              <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600, color: '#1d1d1f', marginBottom: '24px', lineHeight: 1.1 }}>
                {t('whyUsPageFull.pillar1Title')}
              </h3>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.75, color: 'rgba(29,29,31,0.7)' }}>
                {t('whyUsPageFull.pillar1Body')}
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} style={{ flex: '1 1 400px', borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3' }}>
              <img src="/assets/about/values/trust.png" alt="Trust and Expertise" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', alignItems: 'center', flexDirection: 'row-reverse', marginBottom: '120px' }}
          >
            <motion.div variants={fadeInUp} style={{ flex: '1 1 400px' }}>
              <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600, color: '#1d1d1f', marginBottom: '24px', lineHeight: 1.1 }}>
                {t('whyUsPageFull.pillar2Title')}
              </h3>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.75, color: 'rgba(29,29,31,0.7)' }}>
                {t('whyUsPageFull.pillar2Body')}
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} style={{ flex: '1 1 400px', borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3' }}>
              <img src="/assets/services/residential/residential-plumbing.png" alt="Respect for Your Home" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', alignItems: 'center' }}
          >
            <motion.div variants={fadeInUp} style={{ flex: '1 1 400px' }}>
              <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600, color: '#1d1d1f', marginBottom: '24px', lineHeight: 1.1 }}>
                {t('whyUsPageFull.pillar3Title')}
              </h3>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.75, color: 'rgba(29,29,31,0.7)' }}>
                {t('whyUsPageFull.pillar3Body')}
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} style={{ flex: '1 1 400px', borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3' }}>
              <img src="/assets/why-us/honesty.png" alt="Code Compliance and Safety" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* 3. Final CTA Section */}
      <section style={{ padding: 'clamp(60px, 10vw, 120px) 24px', background: '#fff', color: '#1d1d1f', textAlign: 'center' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer} style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.h2 variants={fadeInUp} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '24px', letterSpacing: '-0.02em', color: '#1d1d1f' }}>
            {t('whyUsPageFull.ctaTitle')}
          </motion.h2>
          <motion.p variants={fadeInUp} style={{ fontSize: '1.15rem', lineHeight: 1.75, color: 'rgba(29,29,31,0.7)', marginBottom: '32px' }}>
            {t('whyUsPageFull.ctaBody')}
          </motion.p>
          <motion.h4 variants={fadeInUp} style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '32px', color: '#FAA747' }}>
            {t('whyUsPageFull.ctaSub')}
          </motion.h4>
          
          <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="tel:7038594908"
              style={{
                display: 'inline-block',
                padding: '16px 36px',
                background: '#e63946',
                color: '#fff',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1.05rem',
                boxShadow: '0 4px 14px rgba(230, 57, 70, 0.3)',
                transition: 'background 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d62828'; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#e63946'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {t('whyUsPageFull.btnService')}
            </a>
            <a
              href={JOBBER_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '16px 36px',
                background: '#1d1d1f',
                color: '#fff',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1.05rem',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {t('whyUsPageFull.btnEstimate')}
            </a>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
};

export default WhyUsPage;
