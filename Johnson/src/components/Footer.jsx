import React from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import { Instagram, Linkedin, Facebook, Podcast } from 'lucide-react';

const Footer = () => {
    const { socials } = portfolioData;

    const getIcon = (name) => {
        switch (name.toLowerCase()) {
            case 'instagram': return <Instagram size={20} strokeWidth={1.5} />;
            case 'linkedin': return <Linkedin size={20} strokeWidth={1.5} />;
            case 'facebook': return <Facebook size={20} strokeWidth={1.5} />;
            case 'podcast': return <Podcast size={20} strokeWidth={1.5} />;
            default: return null;
        }
    };

    return (
        <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--glass-border)' }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3rem',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    <div>
                        <h2 style={{ fontWeight: 800 }}>JOHNSON<span style={{ color: 'var(--brand-accent)' }}>.</span></h2>
                        <p style={{ color: 'var(--muted-color)', marginTop: '0.5rem', }}>
                            © 2026 Johnson Saimon. All rights reserved.
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        {socials.map((social) => (
                            <motion.a
                                key={social.name}
                                href={social.url}
                                style={{ 
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '45px',
                                    height: '45px',
                                    borderRadius: '50%',
                                    border: '1px solid transparent',
                                    background: 'rgba(255, 255, 255, 0.03)' // subtle background
                                }}
                                whileHover={{ 
                                    color: 'var(--brand-accent)',
                                    borderColor: 'var(--brand-accent)',
                                    background: 'rgba(189, 255, 0, 0.05)'
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.name}
                                title={social.name}
                            >
                                {getIcon(social.name)}
                            </motion.a>
                        ))}
                    </div>

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                        <a href="/resources" style={{ color: 'var(--muted-color)', }}>Resources</a>
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                            style={{ 
                                color: 'var(--muted-color)', 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer',
                                fontSize: 'inherit',
                                padding: 0
                            }}
                        >
                            Back to top ↑
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

