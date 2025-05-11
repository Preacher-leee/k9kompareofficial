import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import Layout from '../../components/layout/Layout';

// Pages
import Home from '../../pages/Home';
import About from '../../pages/About';
import Kompare from '../../pages/Kompare';
import Facts from '../../pages/Facts';
import Success from '../../pages/checkout/Success';
import Cancel from '../../pages/checkout/Cancel';
import NotFound from '../../pages/NotFound';

// Components
import DoggoBot from '../../components/chatbot/DoggoBot';
import { SplashScreen } from '../../components/animations/SplashScreen';
import { LoadingScreen } from '../../components/animations/LoadingScreen';
import { NewsletterPopup } from '../../components/newsletter/NewsletterPopup';

// Context
import { DogProvider } from '../../context/DogContext';

export function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Handle animation sequence
    if (!showSplash && !showLoading && !showContent) {
      setShowLoading(true);
    }
  }, [showSplash, showLoading, showContent]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setShowContent(true);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <DogProvider>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/kompare" element={<Kompare />} />
            <Route path="/facts" element={<Facts />} />
            <Route path="/checkout/success" element={<Success />} />
            <Route path="/checkout/cancel" element={<Cancel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        <DoggoBot />
        <NewsletterPopup />
      </Layout>
    </DogProvider>
  );
}

export default App;
