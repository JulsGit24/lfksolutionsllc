import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

// `author` is stored as "Maria S., Arlington, VA" — split the name off the first
// comma so the card can show name and location on separate lines.
const splitAuthor = (author = '') => {
  const at = author.indexOf(',');
  return at === -1
    ? { name: author.trim(), meta: '' }
    : { name: author.slice(0, at).trim(), meta: author.slice(at + 1).trim() };
};

const initials = (name) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

const Arrow = ({ dir }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"
       style={{ transform: dir === 'prev' ? 'scaleX(-1)' : 'none' }}>
    <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Reviews = () => {
  const { t } = useTranslation();
  const items = t('reviews.items', { returnObjects: true });
  const list = Array.isArray(items) ? items : [];

  const scrollerRef = useRef(null);
  const [progress, setProgress] = useState(0);   // 0–1 across the scrollable width
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const readScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max <= 0 ? 1 : el.scrollLeft / max);
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(max <= 0 || el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    readScroll();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', readScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', readScroll);
    };
  }, [readScroll, list.length]);

  const step = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector('.rv-item');
    // fall back to ~80% of the viewport width if the card isn't measurable yet
    const delta = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'next' ? delta : -delta, behavior: 'smooth' });
  };

  return (
    <section id="reviews" style={{ padding: 'clamp(100px, 12vw, 160px) 0', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Headline + rating */}
        <motion.div
          className="rv-head"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="rv-title">{t('reviews.title')}</h2>

          <div className="rv-rating">
            <span className="rv-rating-score">{t('reviews.ratingScore')}</span>
            <span className="rv-rating-source">
              <span className="rv-stars" aria-hidden="true" style={{ letterSpacing: 0 }}>★</span>
              {t('reviews.ratingSourceLabel')}
            </span>
            <span>{t('reviews.ratingCountLabel', { count: list.length })}</span>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="rv-carousel">

          {/* Left ── quote mark, heading, controls */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="rv-quotemark" aria-hidden="true">&ldquo;</div>
            <h3 className="rv-carousel-heading">{t('reviews.carouselHeading')}</h3>

            <div className="rv-controls">
              <button
                type="button"
                className="rv-arrow"
                onClick={() => step('prev')}
                disabled={atStart}
                aria-label={t('reviews.prev')}
                aria-controls="rv-scroller"
              >
                <Arrow dir="prev" />
              </button>

              <div className="rv-track">
                <div
                  className="rv-track-fill"
                  style={{ width: `${Math.max(progress * 100, 12)}%` }}
                />
              </div>

              <button
                type="button"
                className="rv-arrow"
                onClick={() => step('next')}
                disabled={atEnd}
                aria-label={t('reviews.next')}
                aria-controls="rv-scroller"
              >
                <Arrow dir="next" />
              </button>
            </div>
          </motion.div>

          {/* Right ── scrolling cards */}
          <div
            id="rv-scroller"
            className="rv-scroller"
            ref={scrollerRef}
            tabIndex={0}
            role="group"
            aria-label={t('reviews.carouselHeading')}
          >
            {list.map((item, i) => {
              const { name, meta } = splitAuthor(item.author);
              return (
                <motion.div
                  key={item.author}
                  className="rv-item"
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <div className="rv-card">
                    <p className="rv-quote">{item.quote}</p>
                    <div className="rv-stars" aria-label="5 out of 5">
                      <span aria-hidden="true">★★★★★</span>
                    </div>
                  </div>

                  <div className="rv-author">
                    <div className="rv-avatar" aria-hidden="true">{initials(name)}</div>
                    <div>
                      <div className="rv-author-name">{name}</div>
                      {meta && <div className="rv-author-meta">{meta}</div>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Reviews;
