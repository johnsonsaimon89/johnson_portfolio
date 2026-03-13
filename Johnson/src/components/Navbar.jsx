import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { pathname, hash } = useLocation();

    // Determine current active link (combining path and hash for anchors)
    const activePath = pathname === '/' && hash ? `/${hash}` : pathname;

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const navLinks = [
        { name: 'Home', href: '/', isPage: true },
        { name: 'Profile', href: '/profile', isPage: true },
        { name: 'Social', href: '/social-media', isPage: true },
        { name: 'Studio', href: '/web-portfolio', isPage: true },
        { name: 'Resources', href: '/resources', isPage: true },
        { name: 'Talk', href: '/contact', isPage: true },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 50);

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleAnchorClick = (e, href) => {
        if (href === '/') {
            if (pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMenuOpen(false);
            }
        } else {
            setIsMenuOpen(false);
        }
    };

    const menuVariants = {
        closed: { opacity: 0, scale: 0.95, y: 20, pointerEvents: 'none' },
        open: { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto' }
    };

    return (
        <>
            {/* Top Logo - Fixed */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 11000,
                    pointerEvents: 'none' // Let clicks pass through empty space
                }}
            >
                <Link to="/" onClick={(e) => handleAnchorClick(e, '/')} style={{ pointerEvents: 'auto', fontWeight: 800, letterSpacing: '-1px' }}>
                    JOHNSON<span style={{ color: 'var(--brand-accent)' }}>.</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-only"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        pointerEvents: 'auto',
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid var(--glass-border)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 11000
                    }}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </motion.div>

            {/* Floating Dock (Desktop) */}
            <motion.div
                className="desktop-only floating-nav"
                initial={{ y: 100, opacity: 0, x: '-50%' }}
                animate={{
                    y: isVisible ? 0 : 150,
                    opacity: isVisible ? 1 : 0,
                    x: '-50%'
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                {navLinks.map((link) => {
                    const isActive = activePath === link.href || (activePath === '/' && link.href === '/');
                    return (
                        <Link
                            key={link.name}
                            to={link.href}
                            onClick={(e) => handleAnchorClick(e, link.href)}
                            className={`nav-pill ${isActive ? 'active' : ''}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill-active"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'var(--brand-accent)',
                                        borderRadius: '100px',
                                        zIndex: -1
                                    }}
                                />
                            )}
                            {link.name}
                        </Link>
                    );
                })}
            </motion.div>

            {/* Mobile Fullscreen Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(5, 5, 5, 0.95)',
                            backdropFilter: 'blur(20px)',
                            zIndex: 10500,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '2rem'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'center' }}>
                            {navLinks.map((link, index) => {
                                const isActive = activePath === link.href || (activePath === '/' && link.href === '/');
                                return (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + (0.05 * index) }}
                                    >
                                        <Link
                                            to={link.href}
                                            onClick={(e) => {
                                                handleAnchorClick(e, link.href);
                                                setIsMenuOpen(false);
                                            }}
                                            style={{
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                color: isActive ? 'var(--brand-accent)' : '#fff',
                                                WebkitTextStroke: isActive ? 'none' : '1px rgba(255,255,255,0.2)',
                                            }}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
