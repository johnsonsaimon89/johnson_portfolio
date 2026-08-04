import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { portfolioData } from '../data/portfolioData';
import AnimatedCounter from './common/AnimatedCounter';

/*
 * REBUILT HOMEPAGE
 * ------------------------------------------------------------------
 * What changed vs. the original HomeSplash.jsx and why:
 *
 * 1. The full-bleed cinematic hero is KEPT AS-IS. It's a genuine
 *    strength — don't lose the visual impact.
 *
 * 2. Added a PROOF STRIP directly below the hero, pulling live data
 *    from the `performances` table (same table/shape SocialMediaPage.jsx
 *    already queries), so your real numbers (250K+ reach, 4.8%
 *    engagement, 5,000+ community) are the first thing a visitor sees
 *    after your name — not three clicks away on a subpage.
 *
 * 3. Added 2 CASE STUDY HIGHLIGHT cards pulled from `case_studies`
 *    (falls back to portfolioData.socialMediaPortfolio.caseStudies if
 *    the DB has no rows yet, exactly like CampaignSpotlight does in
 *    SocialMediaPage.jsx) — so AFRISOS / Chameleon Corridors proof is
 *    visible on page one.
 *
 * 4. Replaced the single "VIEW PROFILE" button with a FORKED CTA:
 *    "Work With Me" (-> /contact) and "Browse Templates & Guides"
 *    (-> /resources, or /shop once you rename the route — see plan).
 *    A single generic CTA forces every visitor down one path even
 *    though you have two different offers (services vs. products).
 *
 * Nothing here changes your CMS/admin — it reads the same tables your
 * admin dashboard already writes to.
 */

const HomeSplash = () => {
    const [settings, setSettings] = useState({
        title: 'Johnson Saimon',
        subtitle: 'Social Media Strategy • Digital Storytelling • Web Design',
    });
    const [metrics, setMetrics] = useState([
        { label: 'Total Reach', value: '250K+', target: 250, suffix: 'K+' },
        { label: 'Avg. Engagement', value: '4.8%', target: 4.8, suffix: '%' },
        { label: 'Community Size', value: '5,000+', target: 5000, suffix: '+' },
    ]);
    const [caseStudies, setCaseStudies] = useState(
        portfolioData.socialMediaPortfolio.caseStudies.slice(0, 2)
    );

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
                    title: data.hero_title || 'Johnson Saimon',
                    subtitle: data.hero_subtitle || 'Social Media Strategy • Digital Storytelling • Web Design',
                });
            }
        };

        const fetchMetrics = async () => {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('performances')
                .select('*')
                .order('display_order', { ascending: true });

            if (!error && data && data.length > 0) {
                const socialStats = data.filter(
                    (s) => s.category?.toLowerCase() === 'social' || s.category?.toLowerCase() === 'social_media'
                );
                const top3 = (socialStats.length > 0 ? socialStats : data).slice(0, 3);

                setMetrics(
                    top3.map((s) => {
                        const valStr = s.metric_value || '';
                        const numMatch = valStr.match(/(\d+(?:\.\d+)?)/);
                        const parsedNum = numMatch ? parseFloat(numMatch[1]) : 0;
                        const suffix = valStr.substring(valStr.indexOf(numMatch ? numMatch[1] : '') + (numMatch ? numMatch[1].length : 0));
                        return { label: s.metric_name, value: s.metric_value, target: parsedNum, suffix: suffix.trim() };
                    })
                );
            }
        };

        const fetchCaseStudies = async () => {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('case_studies')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true })
                .limit(2);

            if (!error && data && data.length > 0) {
                setCaseStudies(
                    data.map((c) => ({
                        client: c.organization_name,
                        impact: c.content?.paragraphs?.[0] || c.content?.challenges || '',
                        tags: c.content_types_mapped || [],
                    }))
                );
            }
        };

        fetchSettings();
        fetchMetrics();
        fetchCaseStudies();
    }, []);

    return (
        <div>
            {/* ============ HERO (unchanged) ============ */}
            <section
                className="home-splash"
                style={{
                    position: 'relative',
                    height: '100dvh',
                    width: '100vw',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.5, 0.3],
                            x: ['-50%', '-45%', '-50%'],
                            y: ['-50%', '-55%', '-50%'],
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
                    <motion.div
                        animate={{
                            scale: [1, 0.8, 1],
                            opacity: [0.15, 0.3, 0.15],
                            x: ['-20%', '-25%', '-20%'],
                            y: ['-60%', '-50%', '-60%'],
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
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'radial-gradient(ellipse at center, transparent 0%, var(--bg-color) 80%)',
                        }}
                    />
                </div>

                <div
                    className="container"
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: '2rem',
                    }}
                >
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                        <h1
                            style={{
                                fontSize: 'clamp(3rem, 10vw, 8rem)',
                                fontWeight: 900,
                                lineHeight: 0.9,
                                letterSpacing: '-0.04em',
                                color: '#fff',
                                margin: 0,
                                textTransform: 'uppercase',
                                cursor: 'default',
                            }}
                        >
                            {settings.title}
                        </h1>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ marginTop: '1.5rem' }}>
                            <span
                                className="home-subtitle"
                                style={{
                                    display: 'block',
                                    color: 'var(--muted-color)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em',
                                    fontSize: 'calc(var(--fs-small) * 1.2)',
                                    fontWeight: 500,
                                    transition: 'all 0.4s ease',
                                }}
                            >
                                {settings.subtitle}
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* ============ FORKED CTA (was a single "VIEW PROFILE" button) ============ */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        style={{ marginTop: '4rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}
                    >
                        <Link
                            to="/contact"
                            className="studio-btn studio-btn-primary"
                            style={{ padding: '1.2rem 3rem', fontSize: 'var(--fs-p2)', letterSpacing: '0.1em', fontWeight: 800 }}
                        >
                            WORK WITH ME <ArrowRight size={18} />
                        </Link>
                        <Link
                            to="/resources"
                            className="studio-btn studio-btn-outline"
                            style={{ padding: '1.2rem 3rem', fontSize: 'var(--fs-p2)', letterSpacing: '0.1em', fontWeight: 800 }}
                        >
                            BROWSE TEMPLATES & GUIDES <ShoppingBag size={18} />
                        </Link>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                        <Link
                            to="/profile"
                            style={{
                                color: 'var(--muted-color)',
                                fontSize: 'var(--fs-p2)',
                                textDecoration: 'underline',
                                textUnderlineOffset: '4px',
                            }}
                        >
                            or see the full profile <ArrowUpRight size={14} style={{ verticalAlign: 'middle' }} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ============ PROOF STRIP (new) ============ */}
            <section className="studio-section" style={{ padding: '6rem 0 4rem' }}>
                <div className="container">
                    <div
                        className="results-grid"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', textAlign: 'center' }}
                    >
                        {metrics.map((metric, idx) => (
                            <motion.div
                                key={idx}
                                className="result-stat"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <span className="result-val" style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, display: 'block' }}>
                                    <AnimatedCounter value={metric.value} target={metric.target} suffix={metric.suffix} />
                                </span>
                                <span className="result-label" style={{ color: 'var(--muted-color)' }}>{metric.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CASE STUDY HIGHLIGHTS (new) ============ */}
            <section className="studio-section" style={{ padding: '2rem 0 6rem' }}>
                <div className="container">
                    <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <span className="badge">Recent Work</span>
                        <h2 style={{ fontSize: 'var(--fs-h2)', marginTop: '1rem' }}>Real Results, Not Just Promises</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                        {caseStudies.map((cs, idx) => (
                            <motion.div
                                key={idx}
                                className="glass"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                style={{ padding: '2.5rem', borderRadius: '24px' }}
                            >
                                <h3 style={{ marginTop: 0 }}>{cs.client}</h3>
                                <p style={{ color: 'var(--muted-color)' }}>{cs.impact}</p>
                                <Link
                                    to="/social-media"
                                    style={{ color: 'var(--brand-accent)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                                >
                                    See the strategy <ArrowUpRight size={16} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeSplash;
