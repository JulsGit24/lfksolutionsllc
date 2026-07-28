import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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

const SectionHeader = ({ title, light = false }) => (
  <motion.h3 
    variants={fadeInUp}
    style={{ 
      fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', 
      fontWeight: 600, 
      marginBottom: '24px', 
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: light ? '#fff' : '#1d1d1f'
    }}
  >
    {title}
  </motion.h3>
);

const ParallaxSection = ({ children, bgImage, topColor = '#fff', bottomColor = '#fff', topDirection = 'right', bottomDirection = 'left' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden', color: '#fff' }}>
      <motion.img 
        src={bgImage} 
        alt="Background"
        style={{ y, position: 'absolute', top: 0, left: 0, width: '100%', height: '130%', objectFit: 'cover', zIndex: 0 }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,12,10,0.85)', zIndex: 1 }} />
      
      {/* Top SVG Cut */}
      <div style={{ width: '100%', height: 'clamp(60px, 8vw, 120px)', position: 'absolute', top: 0, left: 0, zIndex: 2 }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          {topDirection === 'right' ? (
            <polygon points="0,0 100,0 100,100" fill={topColor} />
          ) : (
            <polygon points="0,0 100,0 0,100" fill={topColor} />
          )}
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 3, padding: 'clamp(140px, 15vw, 200px) 0' }}>
        {children}
      </div>

      {/* Bottom SVG Cut */}
      <div style={{ width: '100%', height: 'clamp(60px, 8vw, 120px)', position: 'absolute', bottom: 0, left: 0, zIndex: 2 }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          {bottomDirection === 'right' ? (
            <polygon points="0,100 100,100 100,0" fill={bottomColor} />
          ) : (
            <polygon points="0,100 100,100 0,0" fill={bottomColor} />
          )}
        </svg>
      </div>
    </div>
  );
};



/* ─── Horizontal Scroll Cards (Culture & Values) ─── */
const CULTURE_CARDS = [
  {
    index: '01',
    title: 'Commitment',
    text: 'We respect deadlines, expectations and the promises we make to our clients and partners.',
    bg: '#1d1d1f',
    accent: '#D4891A',
    image: '/assets/val_commitment_1783286211095.png'
  },
  {
    index: '02',
    title: 'Strength',
    text: 'We approach challenges with confidence, discipline and determination without losing respect for the people around us.',
    bg: '#1B5E35',
    accent: '#fff',
    image: '/assets/val_strength_1783286722383.png'
  },
  {
    index: '03',
    title: 'Trust',
    text: 'Our clients know that when a task is assigned to LFK Solutions, it will be handled professionally and completed with care.',
    bg: '#D4891A',
    accent: '#fff',
    image: '/assets/val_trust_1783286217181.png'
  },
  {
    index: '04',
    title: 'Wisdom',
    text: 'We make thoughtful decisions, remain focused under pressure and avoid reacting emotionally to difficult circumstances.',
    bg: '#222F30',
    accent: '#D4891A',
    image: '/assets/val_wisdom_1783286223376.png'
  },
  {
    index: '05',
    title: 'Respect',
    text: 'We respect our clients, our team, our profession, our commitments and the standards that guide our work.',
    bg: '#1B5E35',
    accent: '#fff',
    image: '/assets/val_respect_1783286716370.png'
  }
];

const HorizontalScrollCards = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-62%']);

  return (
    <div ref={containerRef} style={{ height: '200vh', position: 'relative' }}>
      <div style={{
        position: 'sticky',
        top: '15vh',
        height: '70vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 0,
        paddingBottom: 0
      }}>
        <motion.div style={{
          x,
          display: 'flex',
          gap: '32px',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: '120px',
          willChange: 'transform'
        }}>
          {CULTURE_CARDS.map((card) => (
            <div
              key={card.index}
              style={{
                flex: '0 0 auto',
                width: 'clamp(320px, 30vw, 450px)',
                height: 'clamp(280px, 25vw, 380px)',
                borderRadius: '24px',
                padding: 'clamp(20px, 2vw, 28px) clamp(32px, 3vw, 48px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Image */}
              <img
                src={card.image}
                alt={card.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 0
                }}
              />
              {/* Dark overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                zIndex: 1
              }} />
              {/* Index number */}
              <div style={{
                fontSize: 'clamp(4rem, 6vw, 6rem)',
                fontWeight: 800,
                color: card.accent,
                opacity: 0.25,
                position: 'absolute',
                top: '-10px',
                right: '20px',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                zIndex: 2
              }}>
                {card.index}
              </div>
              {/* Title */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{
                  color: card.accent,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  marginBottom: '12px'
                }}>
                  {card.index}
                </div>
                <h4 style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  margin: 0
                }}>
                  {card.title}
                </h4>
              </div>
              {/* Description */}
              <p style={{
                fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.85)',
                margin: 0,
                position: 'relative',
                zIndex: 2
              }}>
                {card.text}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const { t } = useTranslation();

  const expList = t('aboutPageFull.expList', { returnObjects: true });

  return (
    <div style={{ background: '#fff', color: '#1d1d1f' }}>
      <section id="about" style={{ padding: 'clamp(80px, 10vw, 160px) 0 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* 1. Intro */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
            style={{ marginBottom: 'clamp(80px, 10vw, 140px)', textAlign: 'center' }}
          >
            <motion.div variants={fadeInUp} style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', fontSize: '0.85rem', fontWeight: 600 }}>
              {t('aboutPageFull.introLabel')}
            </motion.div>
            <motion.h2 variants={fadeInUp} style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '32px' }}>
              {t('aboutPageFull.introTitle')}
            </motion.h2>
            <motion.p variants={fadeInUp} style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'rgba(29,29,31,0.7)', maxWidth: '800px', margin: '0 auto' }}>
              {t('aboutPageFull.introText')}
            </motion.p>
          </motion.div>

          {/* 2. Firm Title */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
            style={{ 
              marginBottom: 'clamp(80px, 10vw, 140px)', 
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px'
            }}
          >
            <div>
              <SectionHeader title={t('aboutPageFull.firmTitle')} />
            </div>
            <div>
              <motion.p variants={fadeInUp} style={{ fontSize: '1.1rem', lineHeight: 1.75, color: 'rgba(29,29,31,0.75)' }}>
                {t('aboutPageFull.firmText')}
              </motion.p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2b. Meet Fernando */}
      <section style={{ padding: 'clamp(60px, 8vw, 120px) 0', background: '#fbfbf9' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '64px',
              alignItems: 'center'
            }}
          >
            {/* Photo */}
            <motion.div variants={fadeInUp} style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src="/assets/fernando.jpg"
                alt="Fernando — Owner & Licensed Master Plumber"
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  objectFit: 'cover',
                  aspectRatio: '4/5'
                }}
              />
            </motion.div>
            {/* Text */}
            <motion.div variants={fadeInUp}>
              <div style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
                {t('aboutPageFull.meetLabel')}
              </div>
              <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600, marginBottom: '8px', color: '#1d1d1f', letterSpacing: '-0.02em' }}>
                {t('aboutPageFull.meetTitle')}
              </h3>
              <div style={{ color: '#D4891A', fontWeight: 600, fontSize: '1rem', marginBottom: '24px' }}>
                {t('aboutPageFull.meetRole')}
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.75, color: 'rgba(29,29,31,0.75)' }}>
                {t('aboutPageFull.meetText')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. The Client Experience (Parallax) */}
      <ParallaxSection 
        bgImage="/assets/val_trust_1783286217181.png" 
        topColor="#fbfbf9" 
        bottomColor="#fff"
        topDirection="right"
        bottomDirection="left"
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
          >
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <SectionHeader title={t('aboutPageFull.expTitle')} light />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {Array.isArray(expList) && expList.map((text, i) => (
                <motion.div key={i} variants={fadeInUp} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ color: '#D4891A', fontSize: '1.2rem', marginTop: '-2px' }}>✦</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>{text}</div>
                </motion.div>
              ))}
            </div>
            <motion.p variants={fadeInUp} style={{ textAlign: 'center', marginTop: '64px', fontSize: '1.2rem', fontWeight: 500, color: '#D4891A' }}>
              {t('aboutPageFull.expText')}
            </motion.p>
          </motion.div>
        </div>
      </ParallaxSection>

      <section style={{ padding: 'clamp(40px, 6vw, 80px) 0 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          {/* 4. The Technical Benchmark */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}
            style={{ marginBottom: 'clamp(40px, 6vw, 80px)', textAlign: 'center' }}
          >
            <SectionHeader title={t('aboutPageFull.techTitle')} />
            <motion.p variants={fadeInUp} style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'rgba(29,29,31,0.7)', maxWidth: '750px', margin: '0 auto' }}>
              {t('aboutPageFull.techText')}
            </motion.p>
          </motion.div>

          {/* 5. Culture & Values - title & intro */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}
            style={{ textAlign: 'center', marginBottom: '0' }}
          >
            <motion.h3 variants={fadeInUp} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600, marginBottom: '24px', color: '#1d1d1f' }}>
              {t('aboutPageFull.cultureTitle')}
            </motion.h3>
            <motion.p variants={fadeInUp} style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'rgba(29,29,31,0.7)', maxWidth: '700px', margin: '0 auto' }}>
              {t('aboutPageFull.cultureText1')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 5b. Horizontal Scroll Cards */}
      <HorizontalScrollCards />

      <section style={{ padding: 'clamp(40px, 6vw, 80px) 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeInUp}
            style={{ textAlign: 'center', fontSize: '1.1rem', lineHeight: 1.7, color: 'rgba(29,29,31,0.75)', maxWidth: '750px', margin: '0 auto' }}
          >
            {t('aboutPageFull.cultureText2')}
          </motion.p>
        </div>
      </section>

      {/* 6. Operations, Growth & Vision (Parallax) */}
      <ParallaxSection 
        bgImage="/assets/commercial_pipelines.png" 
        topColor="#fff" 
        bottomColor="#fff"
        topDirection="left"
        bottomDirection="right"
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
          >
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <SectionHeader title={t('aboutPageFull.opsTitle')} light />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <motion.div variants={fadeInUp} style={{ 
                maxWidth: '800px',
                width: '100%',
                padding: '40px', 
                background: 'rgba(255,255,255,0.06)', 
                backdropFilter: 'blur(16px)', 
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                textAlign: 'center'
              }}>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '16px', color: '#D4891A' }}>{t('aboutPageFull.opsHowTitle')}</h4>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
                  {t('aboutPageFull.opsHowText')}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </ParallaxSection>

      <section style={{ padding: 'clamp(80px, 10vw, 160px) 0 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>

          {/* Conclusion / Final Call to Action */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={staggerContainer}
            style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 64px) 0', borderTop: '1px solid rgba(29,29,31,0.1)' }}
          >
            <motion.h4 variants={fadeInUp} style={{ fontSize: 'clamp(1.5rem, 3vw, 1.8rem)', fontWeight: 700, color: '#1d1d1f', marginBottom: '32px' }}>
              {t('aboutPageFull.resultsText')}
            </motion.h4>
            <motion.a
              variants={fadeInUp}
              href={JOBBER_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '16px 36px',
                background: '#D4891A',
                color: '#fff',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
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
              {t('aboutPageFull.cta')}
            </motion.a>
          </motion.div>

        </div>
      </section>

    </div>
  );
};

export default AboutPage;
