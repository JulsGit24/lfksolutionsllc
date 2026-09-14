import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FloatingButton = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const threshold = location.pathname === '/' ? window.innerHeight * 3 : window.innerHeight * 0.5;
          setIsScrolled(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: '100px', right: '40px', zIndex: 90 }}>
      <AnimatePresence mode="wait">
        {!isScrolled ? (
            <motion.button
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate('/services')}
              style={{
                display: 'flex',
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              whileHover="hover"
            >
              <div style={{ display: 'flex', height: '48px' }}>
                <div style={{
                  background: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                  backdropFilter: location.pathname === '/' ? 'blur(12px)' : 'none',
                  WebkitBackdropFilter: location.pathname === '/' ? 'blur(12px)' : 'none',
                  color: location.pathname === '/' ? '#fff' : '#222F30',
                  padding: '0 8px 0 24px',
                  borderTopLeftRadius: '24px',
                  borderBottomLeftRadius: '24px',
                  border: location.pathname === '/' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  borderRight: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  {t('hero.discoverServices')}
                </div>
                <div style={{ display: 'flex' }}>
                  <svg width="18" height="48" fill="none" viewBox="0 0 18 48">
                    <path fill={location.pathname === '/' ? "rgba(255, 255, 255, 0.1)" : "#fff"} d="M0 0h5.63c7.808 0 13.536 7.337 11.642 14.91l-6.09 24.359A11.527 11.527 0 0 1 0 48V0Z"/>
                  </svg>
                </div>
              </div>

              <motion.div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '51px',
                  height: '48px',
                  marginLeft: '-2px'
                }}
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.05 }
                }}
              >
                <svg width="51" height="48" fill="none" viewBox="0 0 51 48" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <path fill={location.pathname === '/' ? "rgba(255, 255, 255, 0.1)" : "#fff"} d="M6.728 9.09A12 12 0 0 1 18.369 0H39c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H12.37C4.561 48-1.167 40.663.727 33.09l6-24Z"/>
                </svg>
                {location.pathname === '/' && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    clipPath: 'path("M6.728 9.09A12 12 0 0 1 18.369 0H39c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H12.37C4.561 48-1.167 40.663.727 33.09l6-24Z")',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }} />
                )}
                <motion.div
                  style={{ position: 'relative', zIndex: 1, color: location.pathname === '/' ? '#fff' : '#222F30', display: 'flex' }}
                  variants={{
                    rest: { x: 0, y: 0 },
                    hover: { x: 4, y: 0 }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </motion.div>
              </motion.div>
            </motion.button>
        ) : (
          <motion.button
            key="backToTop"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              display: 'flex',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
            }}
            whileHover="hover"
          >
            <motion.div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '51px',
                height: '48px',
              }}
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.05 }
              }}
            >
              <svg width="51" height="48" fill="none" viewBox="0 0 51 48" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path fill="#1d1d1f" d="M6.728 9.09A12 12 0 0 1 18.369 0H39c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H12.37C4.561 48-1.167 40.663.727 33.09l6-24Z"/>
              </svg>
              <motion.div
                style={{ position: 'relative', zIndex: 1, color: '#fff', display: 'flex' }}
                variants={{
                  rest: { x: 0, y: 0 },
                  hover: { x: 0, y: -4 }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </motion.div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingButton;
