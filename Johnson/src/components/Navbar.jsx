import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { pathname, hash } = useLocation();

    const activePath = pathname === '/' && hash ? `/${hash}` : pathname;

    const navLinks = [
        { name: 'About', href: '/about' },
        { name: 'Work', href: '/work' },
        { name: 'Shop', href: '/resources' },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const handleNavClick = () => {
        setIsMenuOpen(false);
        window.scrollTo(0, 0);
    };

    return (
        <>
            {/* ── Full-width sticky header ── */}
            <header
                className={`site-header${scrolled ? ' scrolled' : ' at-top'}`}
                style={{ fontFamily: 'var(--font-body)' }}
            >
                <div className="container header-inner">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="header-logo"
                        onClick={handleNavClick}
                    >
                        <img src="/logo.png" alt="Johnson Logo" style={{ height: '72px', width: 'auto', objectFit: 'contain', transform: 'translateY(4px)' }} />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="header-nav" aria-label="Primary navigation">
                        {navLinks.map((link) => {
                            const isActive = activePath === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={`header-nav-link${isActive ? ' active' : ''}`}
                                    onClick={handleNavClick}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                        <Link
                            to="/contact"
                            className="header-cta"
                            onClick={handleNavClick}
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Mobile hamburger */}
                    <button
                        className="header-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        ) : (
                            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                                <rect width="18" height="2" rx="1" fill="currentColor"/>
                                <rect y="5" width="12" height="2" rx="1" fill="currentColor"/>
                                <rect y="10" width="18" height="2" rx="1" fill="currentColor"/>
                            </svg>
                        )}
                    </button>
                </div>
            </header>

            {/* ── Mobile fullscreen menu ── */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="mobile-menu-overlay"
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ fontFamily: 'var(--font-main)', paddingTop: 'calc(var(--header-height) + 1rem)' }}
                    >

                        {/* Mobile nav links */}
                        <nav className="mobile-menu-links">
                            {[{ name: 'Home', href: '/' }, ...navLinks].map((link, i) => {
                                const isActive = activePath === link.href;
                                return (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <Link
                                            to={link.href}
                                            className="mobile-menu-link"
                                            onClick={handleNavClick}
                                            style={{ color: isActive ? 'var(--brand-accent)' : 'var(--text-color)' }}
                                        >
                                            {link.name}
                                            <ArrowUpRight size={20} strokeWidth={2} />
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </nav>

                        {/* Mobile CTA */}
                        <div className="mobile-menu-cta">
                            <Link
                                to="/contact"
                                className="btn-primary"
                                onClick={handleNavClick}
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                Contact →
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
