import React from 'react';
import { useTranslation } from 'react-i18next';

const JOBBER_URL =
  'https://clienthub.getjobber.com/hubs/9c82d445-943d-4c4a-9a4d-89953811941a/public/requests/1518206/embedded_new';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="video-footer-wrapper transparent-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <video autoPlay loop muted playsInline className="footer-video-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
        <source src="/assets/hero_video.mp4" type="video/mp4" />
      </video>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1 }} />
      <div className="video-footer-content" style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>

        <section id="contact" className="sofi-section cta-section" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '800px' }}>
            <h2 style={{ color: '#1d1d1f', fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '24px', fontWeight: 700 }}>
              {t('footer.ctaTitle')}
            </h2>
            <p style={{ color: 'rgba(29,29,31,0.7)', fontSize: '1.25rem' }}>
              {t('footer.ctaSubtitle')}
            </p>
            <div style={{ marginTop: '48px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={JOBBER_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: '#1B5E35', color: 'white', padding: '16px 32px', borderRadius: '30px', textDecoration: 'none', fontWeight: 600, boxShadow: '0 0 28px rgba(27,94,53,0.3)' }}
              >
                {t('footer.ctaPrimary')}
              </a>
              <a
                href="tel:7038594908"
                style={{ border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '16px 32px', borderRadius: '30px', textDecoration: 'none', fontWeight: 600 }}
              >
                {t('footer.ctaPhone')}
              </a>
            </div>
          </div>
        </section>

        <footer style={{ padding: '64px 24px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', marginBottom: '48px' }}>

              {/* Brand — logo rendered in its natural dark mark on the light footer */}
              <div>
                <img
                  src="/assets/logo-white.svg"
                  alt="LFK Solutions"
                  style={{
                    height: '48px',
                    marginBottom: '16px',
                    display: 'block',
                  }}
                />
                <p style={{ color: 'rgba(29,29,31,0.65)', lineHeight: 1.65 }}>
                  {t('footer.tagline')}
                </p>
              </div>

              <div>
                <h4 style={{ color: '#1d1d1f', marginBottom: '24px' }}>{t('footer.company')}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <a href="#service-residential" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}>{t('footer.services')}</a>
                  <a href="#portfolio" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}>{t('footer.ourWork')}</a>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#1d1d1f', marginBottom: '24px' }}>{t('footer.contact')}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <a href="tel:7038594908" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}>{t('footer.phone')}</a>
                  <a href="mailto:lfksolutions4u@gmail.com" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}>{t('footer.email')}</a>
                  <p style={{ color: 'rgba(29,29,31,0.45)', marginTop: '16px' }}>{t('footer.established')}</p>
                </div>
              </div>

            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
              <p>{t('footer.copyright')}</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Footer;
