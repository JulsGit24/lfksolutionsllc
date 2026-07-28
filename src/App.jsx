import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from '@studio-freight/react-lenis';

import Loader from './components/Loader';
import Navigation from './components/Navigation';
import FloatingButton from './components/FloatingButton';
import Background from './components/Background';
import Footer from './components/Footer';

import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ScrollToTop from './components/ScrollToTop';

import WhyUsPage from './pages/WhyUsPage';

const App = () => (
  <Router>
    <ScrollToTop />
    <Loader />
    <Navigation />
    <FloatingButton />
    <Background />
    <Lenis root>
      <main id="main-content" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/why-us" element={<WhyUsPage />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </Lenis>
  </Router>
);

export default App;
