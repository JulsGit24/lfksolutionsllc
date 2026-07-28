import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ padding: '28px 0', borderBottom: '1px solid rgba(29,29,31,0.08)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', color: '#1d1d1f',
          fontSize: '1.15rem', fontWeight: 600, cursor: 'pointer',
          textAlign: 'left', padding: 0, gap: '16px',
        }}
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ color: '#D4891A', fontSize: '1.5rem', flexShrink: 0, lineHeight: 1 }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ paddingTop: '14px', margin: 0, color: 'rgba(29,29,31,0.65)', lineHeight: 1.75, fontSize: '1rem' }}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

FAQItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};

const Faq = () => {
  const { t } = useTranslation();
  const items = t('faq.items', { returnObjects: true });

  return (
    <section id="faq" style={{ padding: '160px 0', position: 'relative' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <div style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px', fontSize: '0.8rem', fontWeight: 500 }}>
            {t('faq.sectionLabel')}
          </div>
          <h2 style={{ color: '#1d1d1f', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 600, lineHeight: 1.1 }}>
            {t('faq.title')}
          </h2>
        </motion.div>

        <div>
          {items.map((item) => (
            <FAQItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Faq;
