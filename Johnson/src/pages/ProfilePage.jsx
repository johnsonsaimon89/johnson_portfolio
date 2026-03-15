import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, CheckCircle, ChevronDown, Play, Layout, Smartphone } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import '../styles/StudioStyles.css'; // Shared premium studio styles
import './ProfilePage.css';
const ProfilePage = () => {
    const { pathname } = useLocation();
    const { about, services } = portfolioData;
    const [activeService, setActiveService] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="profile-page" style={{ background: '#050505', minHeight: '100vh', color: '#fff' }}>
            <div className="studio-noise" />

            {/* Premium Hero Section */}
            <section className="section studio-section profile-hero-section" style={{ paddingTop: '15vh', minHeight: 'auto' }}>
                <div className="container">
                    <div className="profile-hero-grid">
                        <motion.div
                            className="hero-text-content"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="badge">{about.subtitle}</span>
                            <h1 style={{ fontSize: 'var(--fs-h1)', margin: '2rem 0', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                                {about.title}
                            </h1>
                            <div className="lead" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {about.intro.map((paragraph, index) => (
                                    <p key={index} style={{ color: 'var(--muted-color)', margin: 0 }}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div 
                            className="hero-image-container"
                            initial={{ opacity: 0, scale: 0.95, x: 30 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="profile-image-wrapper">
                                <img src={about.profileImage} alt="Johnson Saimon" className="profile-main-image" />
                                <div className="image-overlay-glow" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Specialized Services */}
            <section className="studio-section" style={{ padding: '6rem 0' }}>
                <div className="container">
                    <div style={{ marginBottom: '4rem' }}>
                        <span className="badge">Focus Areas</span>
                        <h2 style={{ fontSize: 'var(--fs-h2)', marginTop: '1rem' }}>Strategic Solutions</h2>
                    </div>

                    {/* Services Accordion-style list ... (remains unchanged) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                className={`profile-service-card ${activeService === index ? 'is-active' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.07 }}
                                onClick={() => setActiveService(activeService === index ? null : index)}
                                style={{ cursor: 'pointer', overflow: 'hidden' }}
                            >
                                {/* Top row: number + title + optional link */}
                                <div className="profile-service-header" style={{ margin: 0 }}>
                                    <span className="profile-service-number">{service.number}</span>
                                    <h3 className="profile-service-title">{service.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <motion.div
                                            animate={{ rotate: activeService === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            style={{ color: 'rgba(255,255,255,0.3)' }}
                                        >
                                            <ChevronDown size={20} />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Bottom row: description + details list (Accordion Body) */}
                                <AnimatePresence>
                                    {activeService === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <div className="profile-service-body" style={{ paddingTop: '2.5rem' }}>
                                                <p className="profile-service-desc">{service.description}</p>
                                                <ul className="profile-service-details">
                                                    {service.details.map((detail, idx) => (
                                                        <li key={idx} className="profile-service-detail-item">
                                                            <span className="profile-detail-dot" />
                                                            {detail}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Approach section */}
            <section className="studio-section" style={{ padding: '6rem 0' }}>
                <div className="container">
                    <div className="profile-approach-content">

                        {/* Bio Text & Horizontal Stats */}
                        <div className="vision-content" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <h2 style={{ fontSize: 'var(--fs-h2)', marginBottom: '0.5rem' }}>Approach</h2>
                                {about.approach.map((paragraph, index) => (
                                    <p key={index} style={{ color: 'var(--muted-color)', lineHeight: 1.8, margin: 0 }}>
                                        {paragraph}
                                    </p>
                                ))}

                                {about.philosophy && (
                                    <p style={{ 
                                        color: 'var(--brand-accent)', 
                                        fontSize: '1.1rem', 
                                        fontWeight: 600, 
                                        borderLeft: '2px solid var(--brand-accent)',
                                        paddingLeft: '1.5rem',
                                        marginTop: '1rem'
                                    }}>
                                        {about.philosophy}
                                    </p>
                                )}
                            </div>

                        </div>


                    </div>
                </div>
            </section>

        </div>
    );
};

export default ProfilePage;
