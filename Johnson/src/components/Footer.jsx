import React from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';

const Footer = () => {
    const { socials } = portfolioData;

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
                        <h2 style={{ fontWeight: 800 }}>JOHNSON<span style={{ color: 'var(--accent-color)' }}>.</span></h2>
                        <p style={{ color: 'var(--muted-color)', marginTop: '0.5rem', }}>
                            © 2026 Johnson Saimon. All rights reserved.
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: 'clamp(1.5rem, 5vw, 3rem)',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        {socials.map((social) => (
                            <motion.a
                                key={social.name}
                                href={social.url}
                                style={{ color: 'var(--muted-color)' }}
                                whileHover={{ color: 'white' }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {social.name}
                            </motion.a>
                        ))}
                    </div>

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                        <a href="/resources" style={{ color: 'var(--muted-color)', }}>Resources</a>
                        <a href="#home" style={{ color: 'var(--muted-color)', }}>Back to top ↑</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

