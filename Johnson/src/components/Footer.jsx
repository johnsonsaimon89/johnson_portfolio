import React from 'react';
import { Link } from 'react-router-dom';
import { portfolioData } from '../data/portfolioData';
import { Instagram, Linkedin, Facebook, Podcast } from 'lucide-react';
import { formatUrl } from '../utils/urlUtils';

const Footer = () => {
    const { socials, contact } = portfolioData;

    const getIcon = (name) => {
        switch (name.toLowerCase()) {
            case 'instagram': return <Instagram size={16} strokeWidth={1.75} />;
            case 'linkedin':  return <Linkedin  size={16} strokeWidth={1.75} />;
            case 'facebook':  return <Facebook  size={16} strokeWidth={1.75} />;
            case 'podcast':   return <Podcast   size={16} strokeWidth={1.75} />;
            default: return null;
        }
    };

    const navColumns = [
        {
            title: 'How I Create Value',
            links: [
                { label: 'Communication Strategy',  href: '/about' },
                { label: 'Brand Storytelling',       href: '/work' },
                { label: 'Digital Experiences',      href: '/work' },
                { label: 'Community Engagement',     href: '/work' },
                { label: 'Creative Production',      href: '/work' },
            ],
        },
        {
            title: 'Explore',
            links: [
                { label: 'About',           href: '/about' },
                { label: 'Selected Work',   href: '/work' },
                { label: 'Shop',            href: '/resources' },
                { label: 'Contact',         href: '/contact' },
            ],
        },
        {
            title: 'Connect',
            links: [
                { label: 'Email',     href: `mailto:${contact?.email || 'hello@johnsonsaimon.com'}` },
                { label: `Instagram`, href: socials.find(s => s.name === 'Instagram')?.url || '#', external: true },
                { label: 'LinkedIn',  href: socials.find(s => s.name === 'LinkedIn')?.url  || '#', external: true },
                { label: 'Podcast',   href: '/about#podcast', external: false },
            ],
        },
    ];

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-grid">

                    {/* Brand column */}
                    <div className="footer-brand-col">
                        <div style={{ marginTop: '-24px' }}>
                            <Link to="/" className="footer-logo">
                                <img src="/footer-logo.svg" alt="Johnson Logo" style={{ height: '96px', width: 'auto', objectFit: 'contain' }} />
                            </Link>
                            <p className="footer-tagline">
                                Helping people and organizations communicate with clarity through strategy, design, and thoughtful digital experiences.
                            </p>
                        </div>
                        <div className="footer-socials">
                            {socials.map((social) => (
                                <a
                                    key={social.name}
                                    href={formatUrl(social.url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    title={social.name}
                                    className="footer-social-btn"
                                >
                                    {getIcon(social.name)}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {navColumns.map((col) => (
                        <div key={col.title}>
                            <div className="footer-col-title">{col.title}</div>
                            <ul className="footer-links">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        {link.external ? (
                                            <a
                                                href={formatUrl(link.href)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="footer-link"
                                            >
                                                {link.label}
                                            </a>
                                        ) : (
                                            <Link to={link.href} className="footer-link">
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="footer-bottom">
                    <span className="footer-legal">
                        © {new Date().getFullYear()} Johnson Saimon. All rights reserved. · Dar es Salaam, Tanzania
                    </span>
                    <button
                        className="footer-back-top"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        Back to top ↑
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
