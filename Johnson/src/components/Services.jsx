import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { portfolioData } from '../data/portfolioData';

const ServiceItem = ({ service, isOpen, toggleOpen, index }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.05 * index }}
            onClick={toggleOpen}
            className="glass"
            style={{
                padding: '0',
                cursor: 'pointer',
                overflow: 'hidden',
                background: isOpen ? 'rgba(20, 20, 20, 0.8)' : 'var(--glass-bg)',
                borderColor: isOpen ? 'var(--brand-accent)' : 'var(--glass-border)',
                transformOrigin: 'top center'
            }}
            whileHover={{ scale: 1.01, borderColor: 'rgba(255,255,255,0.2)' }}
        >
            <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1.5rem, 4vw, 3rem)' }}>
                    <span style={{
                        color: isOpen ? 'var(--brand-accent)' : 'var(--muted-color)',
                        fontWeight: 700,
                        fontFamily: 'monospace'
                    }}>
                        {service.number}
                    </span>
                    <h3 style={{
                        margin: 0,
                        transition: '0.3s',
                        color: isOpen ? '#fff' : 'rgba(255,255,255,0.8)'
                    }}>
                        {service.title}
                    </h3>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: isOpen ? 'var(--brand-accent)' : 'rgba(255,255,255,0.05)',
                        display: 'grid',
                        placeItems: 'center',
                        color: isOpen ? '#000' : '#fff',
                        flexShrink: 0,
                        transition: 'background 0.3s'
                    }}
                >
                    +
                </motion.div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div style={{ padding: '0 clamp(1.5rem, 4vw, 2.5rem) 2.5rem clamp(4rem, 8vw, 6.5rem)' }}>
                            <p style={{ color: 'var(--muted-color)', maxWidth: '650px', }}>
                                {service.description}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                                {service.details.map((detail, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '0.75rem',
                                            color: '#eee',
                                            background: 'rgba(255,255,255,0.02)',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-accent)', marginTop: '0.45rem', flexShrink: 0 }} />
                                        {detail}
                                    </motion.div>
                                ))}
                            </div>
                            {service.title === "Strategic Social Media" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ marginTop: '2.5rem' }}
                                >
                                    <Link to="/social-media" style={{
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: '#000',
                                        background: 'var(--brand-accent)',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '100px'
                                    }}>
                                        View Case Studies →
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Services = ({ id }) => {
    const { services } = portfolioData;
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section id="solutions" className="section services" style={{ paddingTop: '8rem' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}

                >
                    <span style={{ color: 'var(--brand-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        Expertise
                    </span>
                    <h2 style={{ marginTop: '1rem', }}>
                        Strategic <span style={{ color: 'var(--brand-accent)' }}>Solutions</span>
                    </h2>
                </motion.div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {services.map((service, index) => (
                        <ServiceItem
                            key={index}
                            index={index}
                            service={service}
                            isOpen={openIndex === index}
                            toggleOpen={() => setOpenIndex(openIndex === index ? -1 : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;

