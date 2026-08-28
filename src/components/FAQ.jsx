import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FAQItem = ({ question, answer, open, onToggle, id }) => (
  <div className={`fq-item${open ? ' is-open' : ''}`}>
    <button
      type="button"
      className="fq-q"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`${id}-answer`}
      id={`${id}-question`}
    >
      <span>{question}</span>
      {/* Literal + / − rather than a rotated glyph: rotating a "+" by 45°
          produces an "×", which reads as dismiss, not collapse. */}
      <span className="fq-icon" aria-hidden="true">{open ? '−' : '+'}</span>
    </button>

    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="answer"
          id={`${id}-answer`}
          role="region"
          aria-labelledby={`${id}-question`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <p className="fq-a">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

FAQItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

const Faq = () => {
  const { t } = useTranslation();
  const items = t('faq.items', { returnObjects: true });
  const list = Array.isArray(items) ? items : [];

  // First question opens by default, matching the reference layout. Clicking an
  // open question closes it, so the group can also be fully collapsed.
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" style={{ padding: 'clamp(100px, 12vw, 160px) 0', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div className="fq-layout">

          {/* Left — headline, lead, link */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="fq-title">{t('faq.title')}</h2>
            <p className="fq-lead">{t('faq.lead')}</p>
            {/* Points at the contact block rather than a FAQ archive, because no
                such page exists yet. Repoint this when Tier 1 ships one. */}
            <a className="fq-more" href="#contact">
              {t('faq.moreLabel')}
              <span aria-hidden="true">→</span>
            </a>
          </motion.div>

          {/* Right — accordion */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {list.map((item, i) => (
              <FAQItem
                key={item.q}
                id={`faq-${i}`}
                question={item.q}
                answer={item.a}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Faq;
