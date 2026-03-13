import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HomeSplash from './components/HomeSplash';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import NewsletterPopup from './components/common/NewsletterPopup';

// Page Components (to be created)
import SocialMediaPage from './pages/SocialMediaPage';
import WebPortfolioPage from './pages/WebPortfolioPage';
import ResourcesPage from './pages/ResourcesPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';

// Admin Components
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DynamicPage from './DynamicPage';
import { supabase } from './lib/supabaseClient';

function App() {
  const location = useLocation();
  const { pathname, hash } = location;

  // Optimized mouse tracking using Framer Motion
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Outer ring (spring physics)
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothCursorX = useSpring(cursorX, springConfig);
  const smoothCursorY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Fetch global theme settings and inject them as CSS variables
    const applyGlobalSettings = async () => {
      if (!supabase) return;
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (data) {
        if (data.theme_color_primary) {
          document.documentElement.style.setProperty('--primary-color', data.theme_color_primary);
        }
        if (data.theme_color_secondary && data.theme_color_secondary !== '#ffffff') {
          document.documentElement.style.setProperty('--bg-color', data.theme_color_secondary);
        }
        if (data.typography_heading) {
          document.documentElement.style.setProperty('--heading-font', `"${data.typography_heading}", sans-serif`);
        }
        if (data.typography_body) {
          document.documentElement.style.setProperty('--body-font', `"${data.typography_body}", sans-serif`);
        }
      }
    };
    applyGlobalSettings();

    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseEnter = () => {
      document.querySelector('.cursor-spotlight')?.classList.add('hovering');
    };

    const handleMouseLeave = () => {
      document.querySelector('.cursor-spotlight')?.classList.remove('hovering');
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Add hover listeners to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [pathname]); // Re-run when page changes to catch new elements

  return (
    <div className="app">
      {/* Background Blobs - Deeper, more abstract */}
      <motion.div
        className="bg-blob"
        animate={{ x: [0, 80, -40, 0], y: [0, -100, 60, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          top: '-10%', left: '-10%',
          width: '600px', height: '600px',
          background: 'transparent'
        }}
      />
      <motion.div
        className="bg-blob"
        animate={{ x: [0, -90, 60, 0], y: [0, 80, -70, 0], scale: [1, 0.8, 1.15, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{
          bottom: '-10%', right: '-10%',
          width: '700px', height: '700px',
          background: 'transparent'
        }}
      />

      {/* Dual Ring + Dot Cursor Effect */}
      <motion.div
        className="cursor-spotlight"
        style={{
          x: smoothCursorX,
          y: smoothCursorY,
        }}
      />
      <motion.div
        className="cursor-dot"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />

      {!pathname.startsWith('/admin') && <Navbar />}


      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomeSplash />} />
            <Route path="/social-media" element={<SocialMediaPage />} />
            <Route path="/web-portfolio" element={<WebPortfolioPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/:slug" element={<DynamicPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {!pathname.startsWith('/admin') && pathname !== '/' && <Footer />}

      {/* Global WhatsApp floating button */}
      {!pathname.startsWith('/admin') && <WhatsAppButton />}


      {/* Global Newsletter Popup (only shows for non-subscribers after 5s) */}
      {!pathname.startsWith('/admin') && pathname !== '/' && <NewsletterPopup />}
    </div>
  );
}

export default App;
