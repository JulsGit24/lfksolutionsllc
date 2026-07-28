import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const JOBBER_URL = 'https://clienthub.getjobber.com/hubs/9c82d445-943d-4c4a-9a4d-89953811941a/public/requests/1518206/embedded_new';

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const ServiceCard = ({ title, description, imageSrc, isCommercial }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      variants={fadeInUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '380px',
        cursor: 'default'
      }}
    >
      {/* Background Image */}
      <motion.img 
        src={imageSrc} 
        alt={title}
        initial={false}
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }}
      />
      
      {/* Gradient Overlay */}
      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 0.9 : 0.6 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Content */}
      <div style={{ position: 'absolute', inset: 0, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', zIndex: 10 }}>
        <motion.h4 
          initial={false}
          animate={{ y: isHovered ? 0 : 16 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ 
            fontSize: '1.4rem', 
            fontWeight: 700, 
            color: isCommercial ? '#D4891A' : '#fff', 
            marginBottom: '16px', 
            lineHeight: 1.3,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            margin: 0
          }}
        >
          {title}
        </motion.h4>
        
        <div style={{ overflow: 'hidden' }}>
          <motion.p 
            initial={false}
            animate={{ 
              y: isHovered ? 0 : 24, 
              opacity: isHovered ? 1 : 0, 
              height: isHovered ? 'auto' : 0,
              marginTop: isHovered ? '16px' : 0
            }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ 
              fontSize: '1.05rem', 
              lineHeight: 1.6, 
              color: 'rgba(255,255,255,0.9)', 
              margin: 0,
              textShadow: '0 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

const DiagonalCut = ({ topColor, bottomColor, direction = 'right', height = '80px' }) => (
  <div style={{ width: '100%', height, background: bottomColor, position: 'relative', marginTop: '-1px' }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'block' }}>
      {direction === 'right' ? (
        <polygon points="0,0 100,0 100,100" fill={topColor} />
      ) : (
        <polygon points="0,0 100,0 0,100" fill={topColor} />
      )}
    </svg>
  </div>
);

const ServicesPage = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const residentialServices = t('servicesPage.residential', { returnObjects: true });
  const resImgs = [
    "/assets/val_emergency_v2_1783372946804.png",
    "/assets/val_bathroom_1783372199640.png",
    "/assets/val_kitchen_v2_1783372966245.png",
    "/assets/val_water_heater_1783372221255.png",
    "/assets/val_fixture_1783372228133.png",
    "/assets/val_full_home_1783372235872.png"
  ];
  if (Array.isArray(residentialServices)) {
    residentialServices.forEach((svc, i) => svc.img = resImgs[i]);
  }

  const commercialServices = t('servicesPage.commercial', { returnObjects: true });
  const comImgs = [
    "/assets/val_commercial_v2_1783372952873.png",
    "/assets/val_new_construction_v2_1783372959439.png"
  ];
  if (Array.isArray(commercialServices)) {
    commercialServices.forEach((svc, i) => svc.img = comImgs[i]);
  }

  const remodelingServices = t('servicesPage.remodeling', { returnObjects: true });
  const remodelingImgs = [
    "/assets/val_kitchen_v2_1783372966245.png",
    "/assets/val_bathroom_1783372199640.png",
    "/assets/val_full_home_1783372235872.png",
    "/assets/val_new_construction_v2_1783372959439.png"
  ];
  if (Array.isArray(remodelingServices)) {
    remodelingServices.forEach((svc, i) => svc.img = remodelingImgs[i]);
  }

  return (
    <div style={{ paddingTop: 'clamp(80px, 10vw, 120px)', background: '#fbfbf9' }}>

      {/* Page Headline */}
      <section style={{ padding: 'clamp(40px, 8vw, 80px) 24px 0', textAlign: 'center', background: '#fbfbf9' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', fontSize: '0.85rem', fontWeight: 600 }}>
              {t('nav.services')}
            </motion.div>
            <motion.h1 variants={fadeInUp} style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#1d1d1f', marginBottom: '32px' }}>
              {t('aboutPageFull.introTitle')}
            </motion.h1>
            <motion.p variants={fadeInUp} style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'rgba(29,29,31,0.7)', maxWidth: '800px', margin: '0 auto' }}>
              At LFK Solutions, plumbing isn't just a trade—it's an exact science. We bring precision, transparency, and a commitment to doing things right the first time to every home and business in the DMV.
            </motion.p>
          </motion.div>
        </div>
      </section>
      
      {/* 1. Residential Services */}
      <section id="residential" style={{ padding: 'clamp(40px, 8vw, 80px) 24px', background: '#fbfbf9' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
            style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 80px)' }}
          >
            <motion.div variants={fadeInUp} style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
              {t('servicesPage.section1Label')}
            </motion.div>
            <motion.h2 variants={fadeInUp} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#1d1d1f', marginBottom: '24px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {t('servicesPage.section1Title')}
            </motion.h2>
            <motion.p variants={fadeInUp} style={{ fontSize: '1.25rem', color: 'rgba(29,29,31,0.6)', fontWeight: 500 }}>
              {t('servicesPage.section1Desc')}
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}
          >
            {Array.isArray(residentialServices) && residentialServices.map((svc) => (
              <ServiceCard key={svc.title} title={svc.title} description={svc.desc} imageSrc={svc.img} isCommercial={false} />
            ))}
          </motion.div>
        </div>
      </section>

      <DiagonalCut topColor="#fbfbf9" bottomColor="#1B5E35" direction="right" height="120px" />

      {/* 2. Commercial & Construction */}
      <section id="commercial" style={{ padding: 'clamp(40px, 10vw, 80px) 24px', background: '#1B5E35', color: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
            style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 80px)' }}
          >
            <motion.div variants={fadeInUp} style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
              {t('servicesPage.section2Label')}
            </motion.div>
            <motion.h2 variants={fadeInUp} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#fff', marginBottom: '24px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {t('servicesPage.section2Title')}
            </motion.h2>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}
          >
            {Array.isArray(commercialServices) && commercialServices.map((svc) => (
              <ServiceCard key={svc.title} title={svc.title} description={svc.desc} imageSrc={svc.img} isCommercial={true} />
            ))}
          </motion.div>
        </div>
      </section>

      <DiagonalCut topColor="#1B5E35" bottomColor="#fff" direction="left" height="120px" />

      {/* 3. Remodeling Services */}
      <section id="remodeling" style={{ padding: 'clamp(40px, 10vw, 80px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
            style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 80px)' }}
          >
            <motion.div variants={fadeInUp} style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
              {t('servicesPage.section3Label')}
            </motion.div>
            <motion.h2 variants={fadeInUp} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#1d1d1f', marginBottom: '24px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {t('servicesPage.section3Title')}
            </motion.h2>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(320px, 40%, 600px), 1fr))', gap: '32px' }}
          >
            {Array.isArray(remodelingServices) && remodelingServices.map((svc) => (
              <ServiceCard key={svc.title} title={svc.title} description={svc.desc} imageSrc={svc.img} isCommercial={false} />
            ))}
          </motion.div>
        </div>
      </section>

      <DiagonalCut topColor="#fff" bottomColor="#fbfbf9" direction="right" height="80px" />


      {/* 5. Global CTA */}
      <section style={{ padding: 'clamp(60px, 10vw, 120px) 24px', textAlign: 'center', background: '#fff' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
          <motion.h2 variants={fadeInUp} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#1d1d1f', marginBottom: '32px', letterSpacing: '-0.02em' }}>
            {t('servicesPage.globalCtaTitle')}
          </motion.h2>
          <motion.a
            variants={fadeInUp}
            href={JOBBER_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '18px 40px',
              background: '#D4891A',
              color: '#fff',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.15rem',
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
            {t('servicesPage.globalCtaButton')}
          </motion.a>
        </motion.div>
      </section>

    </div>
  );
};

export default ServicesPage;
