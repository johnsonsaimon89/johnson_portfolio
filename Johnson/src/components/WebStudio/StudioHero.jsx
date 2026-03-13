import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Layout, Monitor, Code } from 'lucide-react';
import './StudioHero.css';

const StudioHero = () => {
    return (
        <section className="studio-section web-studio-hero">
            <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                <div className="hero-grid">
                    <div className="col-left">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="badge" style={{ background: 'var(--brand-accent)', color: '#000', border: 'none' }}>
                                Studio
                            </span>

                            <h1>
                                The Studio is where <br />
                                ideas become <span className="text-gradient">digital platforms.</span>
                            </h1>

                            <p className="lead">
                                I design modern websites using platforms like Squarespace and Webflow, creating clean and responsive sites that help brands present their work clearly online.{"\n\n"}
                                I also explore AI-assisted workflows to help speed up website creation and improve digital publishing.
                            </p>

                        </motion.div>
                    </div>

                    <div className="col-right stagger-bottom">
                        {/* Immersive Visual for Web Hero */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.4 }}
                            className="browser-mockup-wrapper"
                        >
                            {/* Simple Browser Window */}
                            <div style={{ 
                                width: '100%', 
                                background: '#111', 
                                borderRadius: '16px', 
                                overflow: 'hidden', 
                                border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {/* Browser Header */}
                                <div style={{ 
                                    background: '#1a1a1a', 
                                    padding: '12px 16px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
                                    
                                    <div style={{ 
                                        marginLeft: '12px',
                                        flex: 1,
                                        height: '20px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0 8px',
                                        fontSize: '9px',
                                        color: 'rgba(255,255,255,0.2)'
                                    }}>
                                        studio.agency
                                    </div>
                                </div>
                                
                                {/* Browser Content - Clean & Minimal */}
                                <div style={{ padding: '2rem', minHeight: '240px' }}>
                                    <div style={{ width: '40%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '1.5rem' }} />
                                    <div style={{ width: '100%', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '1.5rem' }} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={{ height: '60px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} />
                                        <div style={{ height: '60px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Subtle Gradient/Media Background */}
            <div className="hero-media-bg" style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60%',
                height: '100%',
                zIndex: 1,
                opacity: 0.15
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 60% 40%, rgba(var(--brand-accent-rgb), 0.15), transparent 70%)',
                    filter: 'blur(100px)'
                }} />
            </div>
        </section>
    );
};

export default StudioHero;

