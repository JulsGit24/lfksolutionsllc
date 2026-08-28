import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const JOBBER_URL =
  'https://clienthub.getjobber.com/hubs/9c82d445-943d-4c4a-9a4d-89953811941a/public/requests/1518206/embedded_new';

const Footer = () => {
  const { t } = useTranslation();
  const footerVideoRef = useRef(null);

  /* ── Force-play footer video on tablets ──
     Same fix as Hero: programmatic .play() + IntersectionObserver
     so the video plays when visible and pauses off-screen. */
  useEffect(() => {
    const vid = footerVideoRef.current;
    if (!vid) return;

    const tryPlay = () => {
      vid.muted = true;
      const p = vid.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          const kick = () => {
            vid.play().catch(() => {});
            document.removeEventListener('touchstart', kick, true);
            document.removeEventListener('scroll', kick, true);
          };
          document.addEventListener('touchstart', kick, { once: true, capture: true, passive: true });
          document.addEventListener('scroll', kick, { once: true, capture: true, passive: true });
        });
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryPlay();
        } else {
          vid.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(vid);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="video-footer-wrapper transparent-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <video
        ref={footerVideoRef}
        src="/assets/home/hero/hero-video.mp4"
        poster="/assets/home/hero/hero-poster.jpg"
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
        className="footer-video-bg"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      />
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
                style={{ background: '#003E1E', color: 'white', padding: '16px 32px', borderRadius: '30px', textDecoration: 'none', fontWeight: 600, boxShadow: '0 0 28px rgba(0,62,30,0.3)' }}
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
            {/* Brand mark + tagline */}
            <div style={{ marginBottom: '40px' }}>
              <img
                src="/assets/brand/logo-badge-white.svg"
                alt="LFK Solutions"
                style={{ height: '56px', width: '56px', objectFit: 'contain', marginBottom: '16px', display: 'block' }}
              />
              <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, maxWidth: '46ch' }}>
                {t('footer.tagline')}
              </p>
            </div>

            <div className="ft-layout" style={{ marginBottom: '48px' }}>

              {/* Business fact sheet */}
              <div>
                <div className="ft-row">
                  <div className="ft-label">{t('footer.servicesLabel')}</div>
                  <div className="ft-value">{t('footer.servicesValue')}</div>
                </div>
                <div className="ft-row">
                  <div className="ft-label">{t('footer.basedInLabel')}</div>
                  <div className="ft-value">{t('footer.basedInValue')}</div>
                </div>
                <div className="ft-row">
                  <div className="ft-label">{t('footer.servingLabel')}</div>
                  <div className="ft-value">{t('footer.servingValue')}</div>
                </div>
                <div className="ft-row">
                  <div className="ft-label">{t('footer.contactLabel')}</div>
                  <div className="ft-value">
                    <a href="tel:+17038594908">{t('footer.phone')}</a>
                    <br />
                    <a href="mailto:lfksolutions4u@gmail.com">{t('footer.email')}</a>
                  </div>
                </div>
              </div>

              {/* Credential card */}
              <div className="ft-card">
                <h3 className="ft-card-title">{t('footer.licenseTitle')}</h3>
                <ul className="ft-licenses">
                  {(t('footer.licenses', { returnObjects: true }) || []).map((l) => (
                    <li key={l} className="ft-license">{l}</li>
                  ))}
                </ul>
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
