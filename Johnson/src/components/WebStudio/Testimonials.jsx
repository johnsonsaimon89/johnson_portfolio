import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { supabase } from '../../lib/supabaseClient';
import { webData } from '../../data/webData';
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (!error && data) {
                setTestimonials(data);
            }
            setLoading(false);
        };
        fetchTestimonials();
    }, []);

    const [displayTestimonials, setDisplayTestimonials] = useState([]);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

    useEffect(() => {
        if (!loading) {
            const filtered = testimonials.filter(t => t.category === 'web_design' || t.category === 'general');
            setDisplayTestimonials(filtered);
            setHasAttemptedFetch(true);
        }
    }, [testimonials, loading]);

    if (hasAttemptedFetch && displayTestimonials.length === 0) return null;

    if (loading && testimonials.length === 0) return null;
    return (
        <section className="studio-section" style={{ paddingBottom: '12rem' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                    <span className="badge">Proof</span>
                    <h2 style={{ fontSize: 'var(--fs-h1)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1 }}>Client Perspectives</h2>
                    <p style={{ color: 'var(--muted-color)', fontSize: 'var(--fs-p1)', marginTop: '1.5rem', marginInline: 'auto', maxWidth: '540px' }}>
                        The results and relationships that define my studio.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '0 1rem' }}>
                    {displayTestimonials.map((test, i) => {
                        const isEven = i % 2 === 0;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: isEven ? -30 : 30, scale: 0.9 }}
                                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                                style={{
                                    alignSelf: isEven ? 'flex-start' : 'flex-end',
                                    maxWidth: '85%',
                                    padding: '1.5rem 2rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#fff',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '24px',
                                    borderBottomLeftRadius: isEven ? '4px' : '24px',
                                    borderBottomRightRadius: !isEven ? '4px' : '24px',
                                    position: 'relative',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                }}
                            >
                                <p style={{ margin: '0 0 0.8rem 0', fontSize: 'var(--fs-p2)', lineHeight: 1.5, fontStyle: 'italic', fontWeight: 400 }}>"{test.quote}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: isEven ? 'flex-start' : 'flex-end' }}>
                                    <span style={{
                                        fontWeight: 800,
                                        color: 'var(--brand-accent)',
                                        fontSize: 'var(--fs-p2)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {test.author}
                                        {test.role ? ` - ${test.role}` : ''}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
