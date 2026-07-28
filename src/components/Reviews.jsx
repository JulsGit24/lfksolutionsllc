import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, delay: i * 0.14, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const Reviews = () => {
  const { t } = useTranslation();
  const items = t('reviews.items', { returnObjects: true });

  return (
    <section id="reviews" style={{ padding: '160px 0', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <div style={{ color: 'rgba(29,29,31,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px', fontSize: '0.8rem', fontWeight: 500 }}>
            {t('reviews.sectionLabel')}
          </div>
          <h2 style={{ color: '#1d1d1f', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 600, lineHeight: 1.1 }}>
            {t('reviews.title')}
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {items.map((item, i) => (
            <motion.div
              key={item.author}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              style={{
                background: '#fbfbf9',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(27,94,53,0.16)',
                boxShadow: '0 10px 40px rgba(29,29,31,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <div style={{ color: '#D4891A', fontSize: '1.15rem', letterSpacing: '4px' }}>★★★★★</div>
              <p style={{ fontSize: '1.05rem', fontStyle: 'italic', lineHeight: 1.75, color: 'rgba(29,29,31,0.74)', flexGrow: 1 }}>
                &ldquo;{item.quote}&rdquo;
              </p>
              <p style={{ color: 'rgba(29,29,31,0.45)', fontWeight: 600, fontSize: '0.85rem', marginTop: 'auto' }}>
                — {item.author}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Reviews;
