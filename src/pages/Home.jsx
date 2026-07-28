import React from 'react';
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
  return (
    <>
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
