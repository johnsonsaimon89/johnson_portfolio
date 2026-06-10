import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const HomeSplash = () => {
    const [settings, setSettings] = useState({
        title: 'Johnson',
        subtitle: 'Digital Strategist & Creator'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            if (!supabase) return;
            const { data } = await supabase
                .from('site_settings')
                .select('hero_title, hero_subtitle')
                .eq('id', 1)
                .single();

            if (data) {
                setSettings({
                    title: data.hero_title || 'Johnson',
                    subtitle: data.hero_subtitle || 'Digital Specialist'
                });
            }
        };
        fetchSettings();
    }, []);
    return (
        <section className="home-splash" style={{
            position: 'relative',
            height: '100dvh',
            width: '100vw',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {/* Cinematic Animated Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden'
            }}>
                {/* Animated gradient orb */}
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: ['-50%', '-45%', '-50%'],
                        y: ['-50%', '-55%', '-50%']
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '80vw',
                        height: '80vh',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(var(--brand-accent-rgb), 0.15) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                    }}
                />
                {/* Second orb offset for depth */}
                <motion.div
                    animate={{
                        scale: [1, 0.8, 1],
                        opacity: [0.15, 0.3, 0.15],
                        x: ['-20%', '-25%', '-20%'],
                        y: ['-60%', '-50%', '-60%']
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '80%',
                        width: '50vw',
                        height: '50vh',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                        filter: 'blur(100px)',
                    }}
                />
                {/* Dark vignette overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at center, transparent 0%, var(--bg-color) 80%)'
                }} />
            </div>


            {/* Content Foreground */}
            <div className="container" style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '2rem'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 style={{
                        fontSize: 'clamp(3rem, 10vw, 8rem)',
                        fontWeight: 900,
                        lineHeight: 0.9,
                        letterSpacing: '-0.04em',
                        color: '#fff',
                        margin: 0,
                        textTransform: 'uppercase',
                        cursor: 'default'
                    }}>
                        Johnson Saimon
                    </h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        style={{ marginTop: '1.5rem' }}
                    >
                        <span className="home-subtitle" style={{
                            display: 'block',
                            color: 'var(--muted-color)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            fontSize: 'calc(var(--fs-small) * 1.2)',
                            fontWeight: 500,
                            transition: 'all 0.4s ease'
                        }}>
                            Social Media Strategy • Digital Storytelling • Web Design
                        </span>
                    </motion.div>
                </motion.div>

                {/* Primary Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    style={{ marginTop: '4rem' }}
                >
                    <Link
                        to="/profile"
                        className="studio-btn studio-btn-primary"
                        style={{
                            padding: '1.2rem 3rem',
                            fontSize: 'var(--fs-p2)',
                            letterSpacing: '0.1em',
                            fontWeight: 800
                        }}
                    >
                        VIEW PROFILE
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeSplash;
