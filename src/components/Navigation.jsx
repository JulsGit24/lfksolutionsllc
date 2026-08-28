import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const JOBBER_URL = 'https://clienthub.getjobber.com/hubs/9c82d445-943d-4c4a-9a4d-89953811941a/public/requests/1518206/embedded_new';

/* ─── Desktop Nav Link (IntegratedBio style) ─── */
const NavLink = ({ link, closeMenu }) => {
  if (link.isRouterLink) {
    return (
      <Link
        to={link.href}
        onClick={closeMenu}
        className="ib-nav-link"
      >
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.href} onClick={closeMenu} className="ib-nav-link">
      {link.label}
    </a>
  );
};

/* ─── Desktop NavItem with dropdown ─── */
const NavItem = ({ link }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="ib-nav-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NavLink link={link} />

      {link.dropdown && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="ib-dropdown"
            >
              <div className="ib-dropdown-inner">
                {link.dropdown.map(dItem => (
                  <a
                    key={dItem.href}
                    href={dItem.href}
                    className="ib-dropdown-link"
                  >
                    {dItem.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

/* ─── Main Navigation ─── */
const Navigation = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [mobileSubOpen, setMobileSubOpen] = useState(null);

  const isHome = location.pathname === '/';
  // Only switch to white/dark-text when past the hero section (dark bg) on home, or always on other pages
  const heroThreshold = typeof window !== 'undefined' ? window.innerHeight * 3 : 800;
  const isScrolled = !isHome || scrollPos > heroThreshold;

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setScrollPos(currentY);
        if (currentY > 200 && currentY > lastScrollY.current) {
          setHidden(true);
        } else if (currentY < lastScrollY.current || currentY <= 50) {
          setHidden(false);
        }
        lastScrollY.current = currentY;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const currentLang = i18n.language.startsWith('es') ? 'es' : 'en';
  const toggleLang = () => i18n.changeLanguage(currentLang === 'en' ? 'es' : 'en');

  const links = [
    { id: 'home', href: '/#hero', label: t('nav.home'), isRouterLink: false },
    {
      id: 'services',
      href: '/services',
      label: t('nav.services'),
      isRouterLink: true,
      dropdown: [
        { href: '/services#residential', label: t('hero.residential') },
        { href: '/services#commercial', label: t('hero.commercial') },
      ]
    },
    { id: 'whyUs', href: '/why-us', label: t('nav.whyUs'), isRouterLink: true },
    { id: 'portfolio', href: '/#portfolio', label: t('nav.ourWork'), isRouterLink: false },
    { id: 'about', href: '/about', label: t('nav.aboutUs'), isRouterLink: true },
  ];

  return (
    <>
      {/* ──── IntegratedBio-style CSS ──── */}
      <style>{`
        /* ── Floating header container ── */
        .ib-header {
          position: fixed;
          top: 20px;
          left: 0; right: 0;
          width: calc(100% - 40px);
          margin: 0 auto;
          height: 64px;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 8px 0 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          transition: opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1),
                      transform 0.6s cubic-bezier(0.25, 1, 0.5, 1),
                      background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1);
          pointer-events: auto;
        }
        .ib-header.is-scrolled {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(34, 47, 48, 0.08);
        }
        .ib-header.is-hidden {
          transform: translateY(-140%);
          pointer-events: none;
        }

        /* ── Desktop: transparent header, menu pill is separate ── */
        @media (min-width: 1025px) {
          .ib-header, .ib-header.is-scrolled {
            height: 54px;
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border: none !important;
            top: 30px;
            width: 100%;
            padding-left: clamp(30px, 5vw, 50px);
            padding-right: clamp(30px, 5vw, 50px);
          }
        }

        /* When NOT scrolled (over hero video): menu pill is more transparent */
        @media (min-width: 1025px) {
          .ib-menu {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.1);
          }
          .ib-header.is-scrolled .ib-menu {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid rgba(34,47,48,0.08);
          }
          
          /* Emergency button */
          .ib-emergency { background: #E63946; color: #fff; display: inline-flex; align-items: center; padding: 8px 17px; border-radius: 8px; font-size: clamp(0.75rem, calc(0.75rem + 0.002 * (100vw - 440px)), 0.875rem); font-weight: 600; text-transform: uppercase; text-decoration: none; letter-spacing: 0; line-height: 1; height: 39px; transition: background 0.3s ease; white-space: nowrap; cursor: pointer; }
          .ib-emergency:hover { background: #C1121F; }
        }

        /* ── Logo ── */
        .ib-logo {
          display: inline-flex;
          align-items: center;
          position: relative;
          z-index: 2;
          text-decoration: none;
        }
        /* Logo: white lockup over the hero, green lockup once the white bar shows.
           The two brand variants are cross-faded rather than inverted with a filter —
           inverting would push the orange chevron off-brand (it would read blue). */
        .ib-logo-stack {
          position: relative;
          display: block;
        }
        .ib-logo img {
          height: 42px;
          width: 42px;
          object-fit: contain;
          display: block;
          transition: opacity 0.4s ease;
        }
        .ib-logo-stack .ib-logo-dark {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
        .ib-header.is-scrolled .ib-logo-stack .ib-logo-light { opacity: 0; }
        .ib-header.is-scrolled .ib-logo-stack .ib-logo-dark { opacity: 1; }
        .ib-logo-pill {
          position: absolute;
          top: 50%; left: 50%;
          width: 54px;
          height: 54px;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(34,47,48,0.05);
          border-radius: 12px;
          transform: translate(-50%,-50%) scale(0.975, 0.75);
          opacity: 0;
          transition: opacity 0.6s cubic-bezier(0.25,1,0.5,1),
                      transform 0.6s cubic-bezier(0.25,1,0.5,1);
          z-index: -1;
          display: none;
        }
        @media (min-width: 1025px) {
          .ib-logo-pill { display: block; }
        }
        .ib-header.is-scrolled .ib-logo-pill {
          opacity: 1;
          transform: translate(-50%,-50%) scale(1);
        }

        /* ── Menu container (desktop pill) ── */
        .ib-menu {
          display: none;
          align-items: center;
          column-gap: 1px;
        }
        @media (min-width: 1025px) {
          .ib-menu {
            display: inline-flex;
            border-radius: 12px;
            padding: 4px 4px 4px 12px;
            column-gap: 1px;
          }
        }

        /* ── Nav link styling ── */
        .ib-nav-item {
          position: relative;
        }
        .ib-nav-link {
          display: inline-flex;
          align-items: center;
          padding: 8px 17px;
          border-radius: 8px;
          color: #222F30;
          font-family: inherit;
          font-size: clamp(0.75rem, calc(0.75rem + 0.002 * (100vw - 440px)), 0.875rem);
          font-weight: 400;
          text-transform: uppercase;
          text-decoration: none;
          letter-spacing: 0;
          line-height: 1;
          height: 39px;
          transition: background-color 0.3s ease, color 0.3s ease;
          white-space: nowrap;
          cursor: pointer;
        }
        .ib-nav-link:hover {
          background: rgba(0,0,0,0.05);
        }

        /* ── CTA button in the menu ── */
        .ib-cta {
          display: inline-flex;
          align-items: center;
          padding: 8px 17px;
          border-radius: 8px;
          background: var(--primary);
          color: #fff;
          font-size: clamp(0.75rem, calc(0.75rem + 0.002 * (100vw - 440px)), 0.875rem);
          font-weight: 400;
          text-transform: uppercase;
          text-decoration: none;
          letter-spacing: 0;
          line-height: 1;
          height: 39px;
          transition: background 0.3s ease;
          white-space: nowrap;
          cursor: pointer;
        }
        .ib-cta:hover {
          background: var(--primary-hover);
        }

        /* ── Language toggle ── */
        .ib-lang {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 12px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid rgba(34,47,48,0.15);
          color: #222F30;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s ease;
          height: 32px;
        }
        .ib-lang:hover {
          background: rgba(0,0,0,0.05);
        }

        /* ── Dropdown: frosted pill matching navbar ── */
        .ib-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          padding-top: 8px;
          z-index: 200;
        }
        .ib-dropdown-inner {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(34,47,48,0.08);
          border-radius: 12px;
          padding: 4px;
          min-width: 180px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .ib-dropdown-link {
          padding: 8px 17px;
          color: #222F30;
          text-decoration: none;
          font-size: clamp(0.75rem, calc(0.75rem + 0.002 * (100vw - 440px)), 0.875rem);
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0;
          line-height: 1;
          height: 39px;
          display: inline-flex;
          align-items: center;
          border-radius: 8px;
          transition: background 0.3s ease, color 0.3s ease;
          white-space: nowrap;
        }
        .ib-dropdown-link:hover {
          background: rgba(0,0,0,0.05);
          color: #FAA747;
        }
        /* Dropdown glass mode (when navbar is glass / not scrolled) */
        @media (min-width: 1025px) {
          .ib-header:not(.is-scrolled) .ib-dropdown-inner {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
          }
          .ib-header:not(.is-scrolled) .ib-dropdown-link {
            color: #fff;
          }
          .ib-header:not(.is-scrolled) .ib-dropdown-link:hover {
            background: rgba(255,255,255,0.15);
            color: #FAA747;
          }
        }

        /* ── Mobile hamburger ── */
        .ib-hamburger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: #222F30;
          border: 1px solid #222F30;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.3s ease;
          z-index: 101;
        }

        /* ── Dynamic Colors (White over hero, Dark when scrolled) ── */
        @media (min-width: 1025px) {
          /* Nav links */
          .ib-nav-link { color: #fff; }
          .ib-nav-link:hover { background: rgba(255,255,255,0.15); }
          .ib-header.is-scrolled .ib-nav-link { color: #222F30; }
          .ib-header.is-scrolled .ib-nav-link:hover { background: rgba(0,0,0,0.05); }
          
          /* Lang button */
          .ib-lang { color: #fff; border-color: rgba(255,255,255,0.3); }
          .ib-lang:hover { background: rgba(255,255,255,0.15); }
          .ib-header.is-scrolled .ib-lang { color: #222F30; border-color: rgba(34,47,48,0.15); }
          .ib-header.is-scrolled .ib-lang:hover { background: rgba(0,0,0,0.05); }
          
          /* CTA */
          .ib-cta { background: var(--primary); color: #fff; }
          .ib-cta:hover { background: var(--primary-hover); }
          .ib-header.is-scrolled .ib-cta { background: var(--primary); color: #fff; }
          .ib-header.is-scrolled .ib-cta:hover { background: var(--primary-hover); }
        }
        @media (min-width: 1025px) {
          .ib-hamburger { display: none; }
        }
        .ib-hamburger:hover {
          background: #333;
        }
        .ib-header:not(.is-scrolled) .ib-hamburger {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .ib-header:not(.is-scrolled) .ib-hamburger:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .ib-hamburger-bars {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          position: relative;
        }
        .ib-bar {
          display: block;
          width: 100%;
          height: 1px;
          background: #fff;
          position: absolute;
          transition: transform 0.4s cubic-bezier(0.25,1,0.5,1);
        }
        .ib-bar:nth-child(1) {
          transform: translateY(-3px);
        }
        .ib-bar:nth-child(2) {
          transform: translateY(3px);
        }
        .ib-bar.open:nth-child(1) {
          transform: translateY(0) rotate(45deg);
        }
        .ib-bar.open:nth-child(2) {
          transform: translateY(0) rotate(-45deg);
        }

        /* ── Mobile overlay ── */
        .ib-mobile-overlay {
          position: fixed;
          top: 20px;
          left: 20px;
          right: 20px;
          width: calc(100% - 40px);
          height: 64px;
          background: #222F30;
          border-radius: 16px;
          z-index: 99;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: height 0.6s cubic-bezier(0.25,1,0.5,1),
                      opacity 0.6s cubic-bezier(0.25,1,0.5,1);
          pointer-events: none;
          opacity: 0;
        }
        .ib-mobile-overlay.open {
          height: calc(100vh - 40px);
          opacity: 1;
          pointer-events: auto;
        }
        .ib-mobile-overlay .ib-mobile-links {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding-top: 76px;
        }
        .ib-mobile-link {
          color: #fff;
          font-size: 2.5rem;
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.1;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .ib-mobile-link:hover { color: #FAA747; }
        .ib-mobile-sub {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }
        .ib-mobile-sub a {
          color: rgba(255,255,255,0.5);
          font-size: 1.1rem;
          text-decoration: none;
        }
        .ib-mobile-sub a:hover { color: #fff; }
        .ib-mobile-cta {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .ib-mobile-cta a {
          color: #fff;
          font-size: 1.1rem;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        /* Free Estimate in the mobile menu — solid brand green, matching the
           desktop header CTA rather than reading as a plain text link. */
        .ib-mobile-cta a.ib-mobile-estimate {
          background: var(--primary);
          color: #fff;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          width: 100%;
          max-width: 200px;
          transition: background 0.3s ease;
        }
        .ib-mobile-cta a.ib-mobile-estimate:hover { background: var(--primary-hover); }
      `}</style>

      {/* ──── Header bar ──── */}
      <header
        className={`ib-header${isScrolled ? ' is-scrolled' : ''}${hidden ? ' is-hidden' : ''}`}
      >
        {/* Logo with frosted pill behind on scroll */}
        <Link to="/" className="ib-logo">
          <div className="ib-logo-pill" />
          <span className="ib-logo-stack">
            <img className="ib-logo-light" src="/assets/brand/logo-badge-white.svg" alt="LFK Solutions LLC" />
            <img className="ib-logo-dark" src="/assets/brand/logo-badge.svg" alt="" aria-hidden="true" />
          </span>
        </Link>

        {/* Desktop menu pill */}
        <div className="ib-menu">
          {links.map(link => (
            <NavItem key={link.id} link={link} />
          ))}

          <button onClick={toggleLang} className="ib-lang">
            {currentLang === 'en' ? 'ES' : 'EN'}
          </button>

          <a
            href="tel:7038594908"
            className="ib-emergency"
          >
            Emergency Plumbing
          </a>

          <a
            href={JOBBER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ib-cta"
          >
            {t('nav.freeEstimate')}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="ib-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="ib-hamburger-bars">
            <span className={`ib-bar${menuOpen ? ' open' : ''}`} />
            <span className={`ib-bar${menuOpen ? ' open' : ''}`} />
          </div>
        </button>
      </header>

      {/* ──── Mobile full-screen overlay ──── */}
      <div className={`ib-mobile-overlay${menuOpen ? ' open' : ''}`}>
        <div className="ib-mobile-links">
          {links.map(link => (
            <div key={link.id} style={{ textAlign: 'center' }}>
              {link.dropdown ? (
                <>
                  <button
                    className="ib-mobile-link"
                    onClick={() => setMobileSubOpen(mobileSubOpen === link.id ? null : link.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                  >
                    {link.label}
                    <span style={{
                      display: 'inline-block',
                      marginLeft: '8px',
                      transition: 'transform 0.3s ease',
                      transform: mobileSubOpen === link.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      fontSize: '0.6em'
                    }}>▼</span>
                  </button>
                  <AnimatePresence>
                    {mobileSubOpen === link.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                        style={{ overflow: 'hidden' }}
                        className="ib-mobile-sub"
                      >
                        {link.dropdown.map(d => (
                          <a key={d.href} href={d.href} onClick={() => setMenuOpen(false)}>{d.label}</a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                link.isRouterLink ? (
                  <Link to={link.href} className="ib-mobile-link" onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </Link>
                ) : (
                  <a href={link.href} className="ib-mobile-link" onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </a>
                )
              )}
            </div>
          ))}
        </div>

        <div className="ib-mobile-cta">
          <button
            onClick={() => { toggleLang(); setMenuOpen(false); }}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
              borderRadius: '8px', padding: '10px 24px', cursor: 'pointer',
              fontSize: '0.9rem', textTransform: 'uppercase'
            }}
          >
            {currentLang === 'en' ? 'Español' : 'English'}
          </button>
          <a href="tel:7038594908" onClick={() => setMenuOpen(false)} style={{
              background: '#E63946', color: '#fff',
              borderRadius: '8px', padding: '12px 24px', cursor: 'pointer',
              fontSize: '1.1rem', textTransform: 'uppercase', textDecoration: 'none',
              fontWeight: 600, textAlign: 'center', width: '100%', maxWidth: '200px'
            }}>
            Emergency Plumbing
          </a>
          <a
            href={JOBBER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ib-mobile-estimate"
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.freeEstimate')}
          </a>
        </div>
      </div>
    </>
  );
};

export default Navigation;
