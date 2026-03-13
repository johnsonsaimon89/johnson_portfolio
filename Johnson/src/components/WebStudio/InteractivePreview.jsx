import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const InteractivePreview = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Translate the inner "website content" upwards as the user scrolls down the page
    const yTransform = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

    return (
        <section ref={containerRef} className="section" style={{ position: 'relative', zIndex: 1 }}>
            <div className="container">
                <div style={{ textAlign: 'center', }}>
                    <h2 >
                        Immersive <span style={{ color: 'var(--accent-color)' }}>Experiences</span>
                    </h2>
                    <p className="lead" style={{ color: 'var(--muted-color)', maxWidth: '600px', margin: '0 auto' }}>
                        Scroll to see the website mockup animate, simulating a live browsing experience.
                    </p>
                </div>

                <div style={{ maxWidth: '900px', margin: '0 auto', perspective: '1000px' }}>
                    <motion.div
                        style={{
                            rotateX: useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -5]),
                            scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]),
                        }}
                    >
                        <div style={{
                            background: '#0d0d0d',
                            borderRadius: '16px',
                            border: '1px solid var(--glass-border)',
                            overflow: 'hidden',
                            boxShadow: '0 30px 60px rgba(0,242,255,0.1)',
                        }}>
                            <div style={{
                                background: '#1a1a1a',
                                padding: '12px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                borderBottom: '1px solid var(--glass-border)'
                            }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ display: 'inline-block', background: '#0a0a0a', padding: '6px 30px', borderRadius: '6px', color: '#888' }}>
                                        interactive-preview.local
                                    </div>
                                </div>
                            </div>

                            {/* Inner scrolling container */}
                            <div style={{ height: '500px', overflow: 'hidden', position: 'relative', background: 'var(--bg-color)' }}>
                                <motion.div
                                    style={{
                                        y: yTransform,
                                        width: '100%',
                                        padding: '2rem'
                                    }}
                                >
                                    {/* Mock Website Content */}
                                    <div style={{ height: '300px', background: 'transparent', opacity: 0.8 }} />

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', }}>
                                        <div style={{ height: '200px', background: 'var(--surface-color)', borderRadius: '12px' }} />
                                        <div style={{ height: '200px', background: 'var(--surface-color)', borderRadius: '12px' }} />
                                    </div>

                                    <div style={{ height: '400px', background: 'var(--surface-color)', borderRadius: '12px', }} />

                                    <div style={{ display: 'grid', gridTemplateColumns: 'reapeat(3, 1fr)', gap: '2rem' }}>
                                        <div style={{ height: '150px', background: 'rgba(255,107,0,0.2)', borderRadius: '12px' }} />
                                        <div style={{ height: '150px', background: 'rgba(189,255,0,0.2)', borderRadius: '12px' }} />
                                        <div style={{ height: '150px', background: 'rgba(0,242,255,0.2)', borderRadius: '12px' }} />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default InteractivePreview;
