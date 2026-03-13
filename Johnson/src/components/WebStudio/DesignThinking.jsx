import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Compass, MousePointerClick } from 'lucide-react';

const DesignThinking = () => {
    return (
        <section className="section">
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 >
                            Creative <br /> <span style={{ color: 'var(--accent-lime)' }}>Approach</span>
                        </h2>
                        <p className="lead" style={{ color: 'var(--muted-color)', }}>
                            I approach website design from a strategic perspective. To me, a website is not just a digital brochure; it is an interactive environment I build to help guide your visitors toward taking action.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Compass color="var(--accent-lime)" size={24} style={{ flexShrink: 0, marginTop: '4px' }} />
                                <div>
                                    <h4 >Clear User Journeys</h4>
                                    <p style={{ color: 'var(--muted-color)', }}>Mapping intuitive pathways from landing to conversion.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Lightbulb color="var(--accent-lime)" size={24} style={{ flexShrink: 0, marginTop: '4px' }} />
                                <div>
                                    <h4 >Storytelling with Usability</h4>
                                    <p style={{ color: 'var(--muted-color)', }}>Balancing emotional narrative with frictionless navigation.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <MousePointerClick color="var(--accent-lime)" size={24} style={{ flexShrink: 0, marginTop: '4px' }} />
                                <div>
                                    <h4 >Action-Oriented Structure</h4>
                                    <p style={{ color: 'var(--muted-color)', }}>Strategically placing elements to encourage user engagement.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        style={{ position: 'relative' }}
                    >
                        {/* Abstract Strategy Visualization */}
                        <div style={{ background: 'var(--surface-color)', borderRadius: '24px', padding: '3rem', border: '1px solid var(--glass-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', overflow: 'hidden', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px dashed var(--muted-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: '10px', height: '10px', background: 'var(--accent-lime)', borderRadius: '50%' }} />
                                </div>
                            </div>

                            <svg viewBox="0 0 200 100" style={{ width: '100%', stroke: 'var(--accent-lime)', strokeWidth: 2, fill: 'none', strokeDasharray: '4 4' }}>
                                <path d="M 100 0 C 100 50, 20 50, 20 100" />
                                <path d="M 100 0 C 100 50, 100 50, 100 100" />
                                <path d="M 100 0 C 100 50, 180 50, 180 100" />
                            </svg>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-10px' }}>
                                <div className="glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: '12px', width: '30%', zIndex: 1 }}>
                                    <span className="caption" style={{ fontWeight: 600 }}>DISCOVER</span>
                                </div>
                                <div className="glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: '12px', width: '30%', zIndex: 1, borderColor: 'var(--accent-lime)' }}>
                                    <span className="caption" style={{ fontWeight: 600, color: 'var(--accent-lime)' }}>ENGAGE</span>
                                </div>
                                <div className="glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: '12px', width: '30%', zIndex: 1 }}>
                                    <span className="caption" style={{ fontWeight: 600 }}>CONVERT</span>
                                </div>
                            </div>

                            {/* Decorative background glow */}
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', background: 'transparent' }} />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DesignThinking;
