import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import { supabase } from '../lib/supabaseClient';

const About = ({ id }) => {
    const { about } = portfolioData;
    const [stats, setStats] = useState(about.stats); // fallback
    const [bio, setBio] = useState(about.bio); // fallback

    useEffect(() => {
        const fetchData = async () => {
            if (!supabase) return;

            // Fetch Stats
            const { data: statsData, error: statsError } = await supabase
                .from('performances')
                .select('*')
                .order('display_order', { ascending: true })
                .limit(3);

            if (!statsError && statsData && statsData.length > 0) {
                const mappedStats = statsData.map(item => ({
                    label: item.metric_name,
                    value: item.metric_value
                }));
                setStats(mappedStats);
            }

            // Fetch Bio
            const { data: settingsData } = await supabase
                .from('site_settings')
                .select('about_bio_array')
                .eq('id', 1)
                .single();

            if (settingsData && settingsData.about_bio_array && settingsData.about_bio_array.length > 0) {
                setBio(settingsData.about_bio_array);
            }
        };
        fetchData();
    }, []);

    return (
        <section id="profile" className="section about">
            <div className="container">
                <div className="distributed-grid" style={{ marginBottom: '6rem' }}>
                    <div className="col-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <span style={{ color: 'var(--brand-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '1rem' }}>
                                Profile
                            </span>
                            <h2 style={{ fontSize: 'var(--fs-h2)' }}>
                                {about.title}
                            </h2>
                        </motion.div>
                    </div>
                </div>

                {/* Distributed Bio and Stats */}
                <div className="distributed-grid" style={{ gap: '4rem' }}>
                    {/* Main Bio - Center/Left Spacing */}
                    <div className="col-left" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <h3 style={{ color: '#fff', marginBottom: '2rem', fontSize: 'var(--fs-h2)', textTransform: 'none', letterSpacing: '-0.02em' }}>
                                The Vision
                            </h3>
                            <div className="text-max-width" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {bio.map((paragraph, index) => (
                                    <p key={index} className="lead" style={{ color: 'var(--muted-color)', lineHeight: 1.8 }}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats - Staggered Right */}
                    <div className="col-right stagger-bottom">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.2 }}
                                    style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '2rem' }}
                                >
                                    <h4 style={{
                                        fontWeight: 800,
                                        fontSize: 'clamp(3rem, 8vw, 5rem)',
                                        color: index === 0 ? 'var(--brand-accent)' : 'var(--text-color)',
                                        margin: 0,
                                        lineHeight: 1
                                    }}>
                                        {stat.value}
                                    </h4>
                                    <p style={{
                                        color: 'var(--muted-color)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2em',
                                        fontWeight: 600,
                                        fontSize: 'var(--fs-p2)',
                                        marginTop: '1rem'
                                    }}>
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
