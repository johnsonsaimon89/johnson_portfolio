import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';
import EmbeddableSignup from './EmbeddableSignup';

const NewsletterPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasSeenPopup, setHasSeenPopup] = useState(false);

    useEffect(() => {
        // Check if the user has already seen the popup or is already subscribed
        const popUpStatus = localStorage.getItem('hasSeenNewsletterPopup');
        const isSubscribed = localStorage.getItem('newsletter_subscribed');

        if (popUpStatus === 'true' || isSubscribed === 'true') {
            setHasSeenPopup(true);
            return;
        }

        // Show popup after 5 seconds
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsOpen(false);
        // Save to local storage so they aren't bothered again in this session/browser
        localStorage.setItem('hasSeenNewsletterPopup', 'true');
        setHasSeenPopup(true);
    };

    if (hasSeenPopup) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 12000,
                        padding: '1rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)'
                    }}
                    onClick={closePopup}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '450px',
                            backgroundColor: 'var(--surface-color, #0a0a0a)',
                            border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={closePopup}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                color: 'var(--muted-color, #888)',
                                zIndex: 10,
                                padding: '0.5rem',
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                borderRadius: '50%',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = 'white'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-color, #888)'}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ padding: '2.5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            {/* Decorative Background Elements */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '300px',
                                height: '300px',
                                background: 'var(--brand-accent, #BDFF00)',
                                opacity: 0.1,
                                borderRadius: '50%',
                                filter: 'blur(80px)',
                                zIndex: -1,
                                pointerEvents: 'none'
                            }}></div>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                style={{
                                    display: 'inline-flex',
                                    padding: '1rem',
                                    borderRadius: '50%',
                                    marginBottom: '1.5rem',
                                    position: 'relative',
                                    background: 'rgba(189, 255, 0, 0.1)',
                                    border: '1px solid rgba(189, 255, 0, 0.2)'
                                }}
                            >
                                <Mail size={32} color="var(--brand-accent, #BDFF00)" />
                            </motion.div>

                            <h3 style={{ fontSize: 'var(--fs-p1)', fontWeight: 800, color: 'white', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Let’s keep in touch</h3>
                            <p style={{ color: 'var(--muted-color, #888)', fontSize: 'var(--fs-p2)', marginBottom: '2rem', lineHeight: 1.6 }}>
                                I share periodic updates on my latest projects, digital strategy tips, and behind-the-scenes thoughts on creation.
                            </p>

                            <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
                                <EmbeddableSignup source="website_popup" buttonText="Subscribe Now" />
                            </div>

                            <button
                                onClick={closePopup}
                                style={{
                                    marginTop: '1.5rem',
                                    fontSize: 'var(--fs-p2)',
                                    color: 'var(--muted-color, #888)',
                                    background: 'none',
                                    border: 'none',
                                    textDecoration: 'underline',
                                    textUnderlineOffset: '4px',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-color, #888)'}
                            >
                                Maybe later
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NewsletterPopup;
