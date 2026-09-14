import React from 'react';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import { PAGE_META } from '../seo/pageMeta';
import { faqSchema } from '../seo/schema';
import Hero from '../components/Hero';
import WhyUs from '../components/WhyUs';
import Services from '../components/Services';
import About from '../components/About';
import Portfolio from '../components/Portfolio';
import Reviews from '../components/Reviews';
import Areas from '../components/Areas';
import Faq from '../components/FAQ';
import PipeConnector from '../components/PipeConnector';

const Home = () => {
  const { t } = useTranslation();
  const faqItems = t('faq.items', { returnObjects: true });

  return (
    <>
      {/* LocalBusiness + WebSite ship statically in index.html so non-JS crawlers
          get them, and are deliberately not repeated here — duplicate @id nodes
          add weight without adding information. Pages emit only page-specific
          schema, which references the business by @id. */}
      <Seo
        {...PAGE_META.home}
        schemas={[faqSchema(Array.isArray(faqItems) ? faqItems : [])]}
      />

      <Hero />

      <PipeConnector variant="tee" topPadding="160px" />
      <WhyUs />

      <PipeConnector variant="elbow" />
      <Services />

      <PipeConnector variant="straight" />
      <About />

      <PipeConnector variant="tee" />
      <Portfolio />

      <PipeConnector variant="straight" />
      <Reviews />

      <PipeConnector variant="elbow" />
      <Areas />

      <PipeConnector variant="straight" />
      <Faq />
    </>
  );
};

export default Home;
