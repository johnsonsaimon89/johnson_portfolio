import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, BookOpen, Clock, ArrowRight, Mic, Globe, Users, Palette, Leaf, Camera, ShieldCheck } from 'lucide-react';
import CTASection from './common/CTASection';
import { supabase } from '../lib/supabaseClient';

const maskUp = {
    hidden: { y: '110%', opacity: 0 },
    show: (delay = 0) => ({
        y: '0%', opacity: 1,
        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay },
    }),
};

const HomeSplash = () => {
    const [heroData, setHeroData] = useState({
        title: "Helping Ideas\nReach People",
        subtitle: "I help organizations communicate with clarity through strategy, thoughtful design, and digital experiences that build trust, spark action, and create lasting impact."
    });

    useEffect(() => {
        const fetchHeroData = async () => {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('app_config')
                .select('key, value')
                .in('key', ['home_hero_title', 'home_hero_subtitle']);
            if (data && !error) {
                const newData = { ...heroData };
                data.forEach(item => {
                    if (item.key === 'home_hero_title' && item.value) newData.title = item.value;
                    if (item.key === 'home_hero_subtitle' && item.value) newData.subtitle = item.value;
                });
                setHeroData(newData);
            }
        };
        fetchHeroData();
    }, []);
    // Brand Trust Strip Marquee
    const brands = [
        "AFRISOS",
        "Ulumbi Podcast",
        "Chameleon Corridors",
        "Jigar Ganatra",
        "Hadzabe Media Center",
        "Ardhi University Tech Community",
        "Ardhi University Ai and Multimedia Studio"
    ];

    const projects = [
        {
            org: "AFRISOS",
            tagline: "Building a stronger digital home for African storytelling",
            metric: "3,000+",
            metricLabel: "Newsletter subscribers grown in 12 months",
            image: "/projects/afrisos.png",
        },
        {
            org: "Chameleon Corridors",
            tagline: "Translating conservation into stories people share",
            metric: "50K+",
            metricLabel: "Targeted viewers through strategic video content",
            image: "/projects/chameleon.png",
        }
    ];

    const [activeProjectIdx, setActiveProjectIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveProjectIdx((prev) => (prev + 1) % projects.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [projects.length]);

    return (
        <div className="home-splash-wrapper">
            {/* ═══════════════════════════════════════
                1. HERO, Identity: Who is Johnson?
            ═══════════════════════════════════════ */}
            <section className="hero-splash">
                {/* Decorative background arc */}
                <div className="hero-bg-arc" aria-hidden="true" />

                {/* Subtle warm blob for depth */}
                <div aria-hidden="true" style={{
                    position: 'absolute', top: '10%', right: '-5%',
                    width: 'clamp(300px, 40vw, 560px)', height: 'clamp(300px, 40vw, 560px)',
                    background: 'none',
                    borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
                    filter: 'blur(40px)'
                }} />

                <div className="container hero-splash-inner">

                    <div className="reveal-parent" style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
                        <motion.h1
                            variants={maskUp} initial="hidden" animate="show" custom={0.1}
                            className="hero-headline"
                            style={{ whiteSpace: 'pre-wrap' }}
                        >
                            {heroData.title}
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                        className="hero-subline"
                    >
                        {heroData.subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
                        className="hero-cta-group"
                    >
                        <Link to="/work" className="btn-hero-primary">
                            See My Work
                        </Link>
                        <Link to="/about" className="btn-hero-outline">
                            About Me
                        </Link>
                    </motion.div>

                    {/* Floating stats pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85 }}
                        style={{ display: 'flex', gap: '1rem', marginTop: '3.5rem', flexWrap: 'wrap', justifyContent: 'center' }}
                    >
                        {[
                            { val: '250K+', label: 'Monthly Reach' },
                            { val: '4.8%', label: 'Avg Engagement' },
                            { val: '6+', label: 'Projects Delivered' },
                        ].map(stat => (
                            <div key={stat.label} style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                background: 'rgba(255,255,255,0.75)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(224,90,61,0.15)',
                                borderRadius: '14px',
                                padding: '1rem 1.75rem',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                minWidth: '110px'
                            }}>
                                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800, color: 'var(--brand-accent)', lineHeight: 1 }}>{stat.val}</span>
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-color)', marginTop: '0.35rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 2. TRUST STRIP (Marquee) */}
            <div className="brand-marquee-wrapper" style={{ background: 'var(--text-color)', paddingTop: '4rem', paddingBottom: '3rem' }}>
                <div className="container" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ 
                        fontFamily: 'var(--font-body)', 
                        color: 'var(--brand-accent)', 
                        fontSize: 'var(--fs-small)', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.08em', 
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}>
                        Trusted By <ShieldCheck size={16} color="#FFFFFF" strokeWidth={2} />
                    </h3>
                </div>
                <div className="brand-marquee-track">
                    {[...brands, ...brands, ...brands].map((brand, i) => (
                        <div key={i} className="brand-marquee-item brand-logo-block">
                            <span className="brand-logo-text" style={{ color: '#FFFFFF' }}>{brand}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════
                3. PHILOSOPHY, How does Johnson think?
            ═══════════════════════════════════════ */}
            <section className="section" style={{ background: 'var(--bg-color)' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        style={{
                            maxWidth: '760px',
                            margin: '0 auto',
                            textAlign: 'center',
                        }}
                    >
                        <p style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                            fontWeight: 600,
                            lineHeight: 1.5,
                            color: 'var(--text-color)',
                            letterSpacing: '-0.01em',
                            margin: 0,
                        }}>
                            "Good communication isn't about publishing more. It's about helping people understand, trust, and act."
                        </p>
                        <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--fs-small)',
                            color: 'var(--text-muted)',
                            marginTop: '1.5rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                        }}>
                            <span style={{ color: 'var(--brand-accent)' }}>JOHNSON KILASI</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                4. HOW I CREATE VALUE, Outcome-focused
            ═══════════════════════════════════════ */}
            <section className="section section-subtle">
                <div className="container">
                    <div className="section-header-center">
                        <h2 className="section-headline">
                            What I <span style={{ color: 'var(--brand-accent)' }}>do</span>
                        </h2>
                        <p className="section-subline">
                            I bring together strategy, storytelling, and technology to help organizations communicate clearly and build lasting connections.
                        </p>
                    </div>

                    <div className="lp-card-grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                        {[
                            {
                                icon: <Target size={28} />,
                                title: "Strategic Communication",
                                body: "Every successful project starts with a clear strategy. I help organizations understand their audiences, define their message, and communicate with purpose.",
                                link: "/about"
                            },
                            {
                                icon: <BookOpen size={28} />,
                                title: "Brand Storytelling",
                                body: "Every organization has a story. I help uncover it and turn it into content that people understand, remember, and care about.",
                                link: "/work"
                            },
                            {
                                icon: <Globe size={28} />,
                                title: "Digital Experiences",
                                body: "I design websites and digital platforms that do more than look good. They guide people, answer questions, and encourage meaningful action.",
                                link: "/work"
                            },
                            {
                                icon: <Users size={28} />,
                                title: "Community Engagement",
                                body: "Strong communities aren't built through constant posting. They're built through meaningful conversations. I help organizations create digital spaces where people feel connected and involved.",
                                link: "/work"
                            },
                        ].map((card, idx) => (
                            <motion.div key={card.title} className="lp-feat-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
                                <div className="lp-feat-icon">{card.icon}</div>
                                <h3 className="lp-feat-title">{card.title}</h3>
                                <p className="lp-feat-body">{card.body}</p>
                                <Link to={card.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-accent)', fontWeight: 700, fontSize: 'var(--fs-small)', marginTop: '0.75rem', textDecoration: 'none' }}>
                                    Learn more <ArrowRight size={14} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                5. SELECTED WORK, Storytelling case studies
            ═══════════════════════════════════════ */}
            <section className="section">
                <div className="container">
                    <div className="section-header-center">
                        <h2 className="section-headline">
                            Selected <span style={{ color: 'var(--brand-accent)' }}>Work</span>
                        </h2>
                        <p className="section-subline">
                            Work that made a difference. Here's how strategic communication creates measurable change.
                        </p>
                    </div>

                    <div style={{ margin: '3rem auto 0', width: '100%', maxWidth: '1200px', minHeight: '400px', overflow: 'hidden', borderRadius: '24px', background: 'var(--surface-alt)', border: '1px solid var(--border-color)', boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProjectIdx}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', width: '100%', minHeight: '400px' }}
                            >
                                {/* Left Side: Centered Visual Area */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '2rem',
                                    background: 'var(--bg-subtle)',
                                    position: 'relative'
                                }}>
                                    {projects[activeProjectIdx].image ? (
                                        <img 
                                            src={projects[activeProjectIdx].image} 
                                            alt={projects[activeProjectIdx].org} 
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '280px',
                                                objectFit: 'contain',
                                                borderRadius: '8px',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '280px', background: 'var(--border-color)', borderRadius: '8px' }} />
                                    )}
                                </div>

                                {/* Right Side: Strategic Text Area */}
                                <div style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h3 style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                                        fontWeight: 700,
                                        margin: '0 0 1.5rem',
                                        lineHeight: 1.2,
                                    }}>
                                        {projects[activeProjectIdx].tagline}
                                    </h3>
                                    
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <span style={{ color: 'var(--brand-accent)', fontWeight: 700, fontSize: 'var(--fs-small)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                            {projects[activeProjectIdx].org}
                                        </span>
                                    </div>

                                    <div style={{
                                        padding: '1.5rem 0 0 0',
                                        borderTop: '1px solid var(--border-color)',
                                        marginTop: 'auto'
                                    }}>
                                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--brand-accent)', lineHeight: 1 }}>
                                            {projects[activeProjectIdx].metric}
                                        </div>
                                        <div style={{ fontSize: 'var(--fs-small)', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.5rem' }}>
                                            {projects[activeProjectIdx].metricLabel}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        
                        {/* Carousel Indicators */}
                        <div style={{ position: 'absolute', bottom: '1.5rem', right: '2rem', display: 'flex', gap: '0.5rem' }}>
                            {projects.map((_, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveProjectIdx(idx)}
                                    style={{
                                        width: '10px', height: '10px', borderRadius: '50%',
                                        background: idx === activeProjectIdx ? 'var(--brand-accent)' : 'var(--border-color)',
                                        cursor: 'pointer', transition: 'background 0.3s ease'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginTop: '3rem' }}
                    >
                        <Link to="/work" className="btn-primary" style={{ display: 'inline-flex' }}>
                            View All Work <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                6. PROCESS, How we work together
            ═══════════════════════════════════════ */}
            <section className="section section-subtle">
                <div className="container">
                    <div className="section-header-center">
                        <h2 className="section-headline">
                            Your partner, <span style={{ color: 'var(--brand-accent)' }}>from message to audience</span>
                        </h2>
                    </div>

                    <div className="lp-card-grid-3">
                        <motion.div className="lp-step-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <div className="lp-step-num">01</div>
                            <h3 className="lp-step-title">Discover</h3>
                            <p className="lp-step-body">We begin by understanding your goals, your audience, and the challenges you're trying to solve before making any creative decisions.</p>
                        </motion.div>
                        <motion.div className="lp-step-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                            <div className="lp-step-num">02</div>
                            <h3 className="lp-step-title">Craft</h3>
                            <p className="lp-step-body">Together we shape the strategy, refine the message, and build the digital experience that brings your ideas to life.</p>
                        </motion.div>
                        <motion.div className="lp-step-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                            <div className="lp-step-num">03</div>
                            <h3 className="lp-step-title">Grow</h3>
                            <p className="lp-step-body">Launch is only the beginning. We measure, refine, and improve what's working so your communication continues to grow.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                7. ULUMBI, Personal Differentiator
            ═══════════════════════════════════════ */}
            <section className="lp-dark-band">
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                            Building Conversations Through <span style={{ color: 'var(--brand-accent)' }}>Independent Media</span>
                        </h2>
                        <p style={{ fontSize: 'var(--fs-small)', opacity: 0.8, lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '500px' }}>
                            Ulumbi Podcast is where I explore education, society, creativity, and personal growth through honest conversations. It's my space to learn, question ideas, and share perspectives beyond client work.
                        </p>
                        <Link to="/about#podcast" className="btn-primary" style={{ background: 'var(--brand-accent)', color: '#000' }}>
                            Listen to Ulumbi <Mic size={18} />
                        </Link>
                    </div>
                    <div style={{ borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', aspectRatio: '1/1', maxWidth: '400px', margin: '0 auto', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                        <img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80" alt="Ulumbi Podcast" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
            </section>

            {/* 8. CLOSING CTA */}
            <CTASection
                title="Let's build something people will remember."
                subtitle="Whether you're refining a brand, launching a website, or shaping a communication strategy, I'd love to hear what you're working on."
                primaryLabel="Let's Talk"
                primaryTo="/contact"
                secondaryLabel="Email Me"
                secondaryHref="mailto:johnsonsaimon111@gmail.com"
            />
        </div>
    );
};

export default HomeSplash;
