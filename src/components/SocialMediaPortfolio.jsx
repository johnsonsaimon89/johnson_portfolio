import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { portfolioData } from '../data/portfolioData';
import { TrendingUp, Users, Target, Calendar, ShieldCheck, Zap } from 'lucide-react';

const SocialMediaPortfolio = ({ id }) => {
    const { socialMediaPortfolio } = portfolioData;

    return (
        <section id={id} className="section social-portfolio" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', }}
                >
                    <span style={{ color: 'var(--brand-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        Social Media Management
                    </span>
                    <h2 style={{ marginTop: '1rem' }}>
                        {socialMediaPortfolio.title.split(' ')[0]} <span style={{ color: 'var(--brand-accent)' }}>{socialMediaPortfolio.title.split(' ')[1]}</span>
                    </h2>
                    <p style={{ color: 'var(--muted-color)', maxWidth: '700px', margin: '1.5rem auto 2.5rem', }}>
                        {socialMediaPortfolio.subtitle}
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} style={{ display: 'inline-block' }}>
                        <Link to="/social-media" className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
                            View Full Case Studies
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Metrics Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(140px, 45%, 280px), 1fr))',
                    gap: '1.5rem',
                }}>
                    {socialMediaPortfolio.metrics.map((metric, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass"
                            style={{
                                padding: 'clamp(1.5rem, 5vw, 2.5rem)',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ color: 'var(--brand-accent)', fontWeight: 600, }}>{metric.trend}</div>
                            <h3 style={{ fontWeight: 800, }}>{metric.value}</h3>
                            <p style={{ color: 'var(--muted-color)', textTransform: 'uppercase', letterSpacing: '0.1em', }}>{metric.label}</p>

                            {/* Icon Background Decoration */}
                            <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.05 }}>
                                {index === 0 && <TrendingUp size={80} />}
                                {index === 1 && <Zap size={80} />}
                                {index === 2 && <Users size={80} />}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Case Studies / Results */}
                <div >
                    <h3 style={{ textAlign: 'center' }}>Strategic <span style={{ color: 'var(--brand-accent)' }}>Impact</span></h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
                        gap: '2rem'
                    }}>
                        {socialMediaPortfolio.caseStudies.map((study, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                style={{
                                    padding: 'clamp(1.5rem, 5vw, 3rem)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '2rem',
                                    background: 'transparent'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                                    {study.tags.map(tag => (
                                        <span key={tag} style={{ padding: '0.2rem 0.7rem', borderRadius: '1rem', border: '1px solid var(--brand-accent)', color: 'var(--brand-accent)', textTransform: 'uppercase' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h4 >{study.client}</h4>
                                <p style={{ color: '#fff', fontWeight: 500, }}>{study.impact}</p>
                                <p style={{ color: 'var(--muted-color)', }}>{study.strategy}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Strategy Pillars */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {socialMediaPortfolio.pillars.map((pillar, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}
                        >
                            <div style={{ color: 'var(--brand-accent)', padding: '0.6rem', borderRadius: '0.8rem', background: 'rgba(var(--brand-accent-rgb), 0.1)', flexShrink: 0 }}>
                                {index === 0 && <Calendar size={20} />}
                                {index === 1 && <ShieldCheck size={20} />}
                                {index === 2 && <Target size={20} />}
                            </div>
                            <div>
                                <h4 >{pillar.title}</h4>
                                <p style={{ color: 'var(--muted-color)', }}>{pillar.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialMediaPortfolio;
