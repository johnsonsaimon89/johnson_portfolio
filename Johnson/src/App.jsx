import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';


import HomeSplash from './components/HomeSplash';
import Footer from './components/Footer';

import NewsletterPopup from './components/common/NewsletterPopup';
import CookieBanner from './components/common/CookieBanner';

// Page Components
import AboutPage from './pages/AboutPage';
import WorkPage from './pages/WorkPage';
import SocialMediaPage from './pages/SocialMediaPage';
import WebPortfolioPage from './pages/WebPortfolioPage';
import ResourcesPage from './pages/ResourcesPage';
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



  return (
    <div className="app">
      {!pathname.startsWith('/admin') && <Navbar />}


      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            {/* Public pages, hero handles its own top padding */}
            <Route path="/" element={<HomeSplash />} />
            {/* Primary pages */}
            <Route path="/about"          element={<div className="page-content"><AboutPage /></div>} />
            <Route path="/work"           element={<div className="page-content"><WorkPage /></div>} />
            <Route path="/resources"      element={<div className="page-content"><ResourcesPage /></div>} />
            <Route path="/contact"        element={<div className="page-content"><ContactPage /></div>} />
            {/* Redirects from old routes */}
            <Route path="/profile"        element={<Navigate to="/about" replace />} />
            <Route path="/social-media"   element={<Navigate to="/work" replace />} />
            <Route path="/web-portfolio"  element={<Navigate to="/work" replace />} />
            {/* Admin */}
            <Route path="/admin/login"   element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/:slug" element={<div className="page-content"><DynamicPage /></div>} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {!pathname.startsWith('/admin') && <Footer />}



      {/* Global Newsletter Popup (only shows for non-subscribers after 5s) */}
      {!pathname.startsWith('/admin') && pathname !== '/' && <NewsletterPopup />}
      
      {/* Cookie Banner */}
      {!pathname.startsWith('/admin') && <CookieBanner />}
    </div>
  );
}

export default App;
