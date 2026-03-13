import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

const ResponsiveShowcase = () => {
    const [activeDevice, setActiveDevice] = useState('desktop');

    const devices = [
        { id: 'desktop', icon: <Monitor size={20} />, label: 'Desktop', width: '900px', height: '560px', radius: '12px' },
        { id: 'tablet', icon: <Tablet size={20} />, label: 'Tablet', width: '600px', height: '800px', radius: '24px' },
        { id: 'mobile', icon: <Smartphone size={20} />, label: 'Mobile', width: '320px', height: '650px', radius: '36px' },
    ];

    const currentDevice = devices.find(d => d.id === activeDevice);

    return (
        <section className="section" style={{ background: 'var(--surface-color)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', }}>
                    <h2 >
                        Flawless on <span style={{ color: 'var(--accent-lime)' }}>Every Device</span>
                    </h2>

                    <div style={{ display: 'inline-flex', background: 'var(--glass-bg)', padding: '0.5rem', borderRadius: '100px', gap: '0.5rem', border: '1px solid var(--glass-border)' }}>
                        {devices.map(device => (
                            <button
                                key={device.id}
                                onClick={() => setActiveDevice(device.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '100px',
                                    border: 'none',
                                    background: activeDevice === device.id ? 'var(--text-color)' : 'transparent',
                                    color: activeDevice === device.id ? 'var(--bg-color)' : 'var(--muted-color)',
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                            >
                                {device.icon}
                                <span className={activeDevice === device.id ? '' : 'desktop-only'}>{device.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', minHeight: '850px', alignItems: 'center' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeDevice}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            style={{
                                width: '100%',
                                maxWidth: currentDevice.width,
                                height: currentDevice.height,
                                background: '#111',
                                border: '8px solid #222',
                                borderRadius: currentDevice.radius,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* Content Mockup Inside Frame */}
                            <div style={{ background: 'transparent' }}>
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                                    {activeDevice !== 'mobile' && (
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                                            <div style={{ width: '40px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                                            <div style={{ width: '40px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                                        </div>
                                    )}
                                </div>

                                {/* Hero Section Mockup */}
                                <div style={{ textAlign: activeDevice === 'desktop' ? 'left' : 'center', }}>
                                    <div style={{ height: '30px', background: 'var(--accent-lime)', borderRadius: '4px', opacity: 0.8, width: activeDevice === 'desktop' ? '60%' : '100%' }} />
                                    <div style={{ height: '30px', background: 'rgba(255,255,255,0.5)', borderRadius: '4px', width: activeDevice === 'desktop' ? '40%' : '80%', margin: activeDevice === 'desktop' ? '0' : '0 auto' }} />
                                </div>

                                {/* Image/Video Banner */}
                                <div style={{ width: '100%', height: activeDevice === 'desktop' ? '250px' : '180px', background: 'rgba(0,242,255,0.2)', borderRadius: '12px', }} />

                                {/* Grid Content */}
                                <div style={{ display: 'grid', gridTemplateColumns: activeDevice === 'mobile' ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ height: '100px', background: 'rgba(255,107,0,0.1)', borderRadius: '8px' }} />
                                    <div style={{ height: '100px', background: 'rgba(255,107,0,0.1)', borderRadius: '8px' }} />
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default ResponsiveShowcase;
