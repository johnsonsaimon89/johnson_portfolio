import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Check, X } from 'lucide-react';
import './CookieBanner.css';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Small delay so it doesn't appear instantly on load
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setIsVisible(false);
        
        // Notify Google Analytics that consent was granted
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="cookie-banner-wrapper"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                    <div className="cookie-banner">
                        <div className="cookie-content">
                            <div className="cookie-icon">
                                <ShieldAlert size={20} />
                            </div>
                            <div className="cookie-text">
                                <h4>We value your privacy</h4>
                                <p>We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. <br />By clicking "Accept", you consent to our use of cookies.</p>
                            </div>
                        </div>
                        <div className="cookie-actions">
                            <button className="cookie-btn cookie-decline" onClick={handleDecline}>
                                Decline
                            </button>
                            <button className="cookie-btn cookie-accept" onClick={handleAccept}>
                                Accept
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
