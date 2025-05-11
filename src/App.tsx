import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Kompare from './pages/Kompare';
import Facts from './pages/Facts';
import Quiz from './pages/Quiz';
import Success from './pages/checkout/Success';
import Cancel from './pages/checkout/Cancel';
import NotFound from './pages/NotFound';

// Components
import DoggoBot from './components/chatbot/DoggoBot';
import { SplashScreen } from './components/animations/SplashScreen';
import { LoadingScreen } from './components/animations/LoadingScreen';
import { NewsletterPopup } from './components/newsletter/NewsletterPopup';
import PageTransition from './components/PageTransition';

// Context
import { DogProvider } from './context/DogContext';

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPath, setNextPath] = useState('');

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

  const handleNavigation = (path: string) => {
    setIsTransitioning(true);
    setNextPath(path);
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    if (nextPath) {
      navigate(nextPath);
      setNextPath('');
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <DogProvider>
      {isTransitioning ? (
        <PageTransition onTransitionComplete={handleTransitionComplete}>
          <Layout>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/kompare" element={<Kompare />} />
                <Route path="/facts" element={<Facts />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/checkout/success" element={<Success />} />
                <Route path="/checkout/cancel" element={<Cancel />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
            <DoggoBot />
            <NewsletterPopup />
          </Layout>
        </PageTransition>
      ) : (
        <Layout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/kompare" element={<Kompare />} />
              <Route path="/facts" element={<Facts />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/checkout/success" element={<Success />} />
              <Route path="/checkout/cancel" element={<Cancel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <DoggoBot />
          <NewsletterPopup />
        </Layout>
      )}
    </DogProvider>
  );
}

export default App;
