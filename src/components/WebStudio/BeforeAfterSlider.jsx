import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BeforeAfterSlider = () => {
    const [sliderValue, setSliderValue] = useState(50);

    return (
        <section className="section">
            <div className="container" style={{ textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}

                >
                    <h2 >
                        Transforming <span style={{ color: 'var(--brand-accent)' }}>Structures</span>
                    </h2>
                    <p className="lead" style={{ color: 'var(--muted-color)', maxWidth: '600px', margin: '0 auto' }}>
                        See how messy architectures turn into clear, storytelling-driven web experiences.
                    </p>
                </motion.div>

                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '900px',
                        margin: '0 auto',
                        aspectRatio: '16/9',
                        overflow: 'hidden',
                        borderRadius: '16px',
                        border: '1px solid var(--glass-border)'
                    }}
                >
                    {/* Before Image (underneath) */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '4px' }} />
                                <div style={{ width: '100px', height: '40px', background: '#333', borderRadius: '4px' }} />
                            </div>
                            <div style={{ width: '80%', height: '200px', background: '#333', margin: '0 auto', borderRadius: '4px' }} />
                            <h3 style={{ marginTop: '1rem', color: '#555' }}>Cluttered, Unclear Layout</h3>
                        </div>
                    </div>

                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '4px', zIndex: 10, fontWeight: 600 }}>BEFORE</div>

                    {/* After Image (on top, clipped) */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'var(--surface-color)',
                            clipPath: `polygon(0 0, ${sliderValue}% 0, ${sliderValue}% 100%, 0 100%)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                        }}
                    >
                        <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2rem', }}>
                                <div style={{ width: '120px', height: '30px', background: 'var(--accent-lime)', borderRadius: '15px' }} />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '80px', height: '30px', background: 'var(--glass-bg)', borderRadius: '15px' }} />
                                    <div style={{ width: '80px', height: '30px', background: 'var(--glass-bg)', borderRadius: '15px' }} />
                                </div>
                            </div>
                            <div style={{ width: '90%', height: '250px', background: 'transparent' }} />
                            <h3 style={{ marginTop: '1rem', color: 'var(--accent-lime)' }}>Modern, Story-Driven Structure</h3>
                        </div>
                        <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--accent-lime)', color: '#000', padding: '4px 12px', borderRadius: '4px', zIndex: 10, fontWeight: 600 }}>AFTER</div>
                    </div>

                    {/* Slider Handle & Input */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValue}
                        onChange={(e) => setSliderValue(e.target.value)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'ew-resize',
                            zIndex: 20
                        }}
                    />

                    {/* Visual Divider Line */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: `${sliderValue}%`,
                            width: '2px',
                            background: 'white',
                            transform: 'translateX(-50%)',
                            pointerEvents: 'none',
                            zIndex: 15,
                            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '40px',
                            height: '40px',
                            background: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }} >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                                <polyline points="9 18 15 12 9 6" style={{ transform: 'translateX(6px)' }}></polyline>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default BeforeAfterSlider;
