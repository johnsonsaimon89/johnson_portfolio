import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight, Globe, Layers, Mic, Zap, BarChart2, Users } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import PodcastHighlights from '../components/PodcastHighlights';
import CTASection from '../components/common/CTASection';
import { supabase } from '../lib/supabaseClient';
import '../styles/StudioStyles.css';
import './ProfilePage.css';
import affinityLogo from '../assets/affinity-logo-white.svg';

/* Service icon map */
const SERVICE_ICONS = {
    0: Globe,
    1: Layers,
    2: Mic,
    3: Zap,
    4: BarChart2,
};

/* Image key map, matches page_images table keys */
const SERVICE_IMAGE_KEYS = [
    'profile_service_social',
    'profile_service_web',
    'profile_service_podcast',
    'profile_service_brand',
    'profile_service_digital',
];

const TOOL_LOGOS = [
    { name: "Figma", url: "https://cdn.simpleicons.org/figma/FFFFFF", link: "https://www.figma.com" },
    { name: "Canva", url: "https://api.iconify.design/cib:canva.svg?color=white", link: "https://www.canva.com" },
    { name: "Adobe CC", url: "https://api.iconify.design/cib:adobe.svg?color=white", link: "https://www.adobe.com" },
    { name: "Illustrator", url: "https://api.iconify.design/cib:adobe-illustrator.svg?color=white", link: "https://www.adobe.com/products/illustrator.html" },
    { name: "Premiere Pro", url: "https://api.iconify.design/devicon-plain:premierepro.svg?color=white", link: "https://www.adobe.com/products/premiere.html" },
    { name: "Audition", url: "https://api.iconify.design/cib:adobe-audition.svg?color=white", link: "https://www.adobe.com/products/audition.html" },
    { name: "Affinity", url: affinityLogo, link: "https://www.affinity.studio/" },
    { name: "CapCut", url: "https://api.iconify.design/selfhst:capcut-light.svg?color=white", link: "https://www.capcut.com" },
    { name: "Webflow", url: "https://cdn.simpleicons.org/webflow/FFFFFF", link: "https://webflow.com" },
    { name: "React", url: "https://cdn.simpleicons.org/react/FFFFFF", link: "https://react.dev" },
    { name: "Meta", url: "https://cdn.simpleicons.org/meta/FFFFFF", link: "https://www.meta.com" },
    { name: "Google Sheets", url: "https://cdn.simpleicons.org/googlesheets/FFFFFF", link: "https://www.google.com/sheets/about/" },
    { name: "Notion", url: "https://cdn.simpleicons.org/notion/FFFFFF", link: "https://www.notion.so" }
];

const maskUp = {
    hidden: { y: '110%', opacity: 0 },
    show: (delay = 0) => ({
        y: '0%', opacity: 1,
        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay },
    }),
};

const fadeIn = {
    hidden: { opacity: 0, y: 16 },
    show: (delay = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
    }),
};

const AboutPage = () => {
    const { pathname, hash } = useLocation();
    const { about, services } = portfolioData;
    const [activeService, setActiveService] = useState(null);
    const [pageImages, setPageImages] = useState({});

    useEffect(() => { 
        if (hash) {
            const element = document.getElementById(hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }
        window.scrollTo(0, 0); 
    }, [pathname, hash]);

    useEffect(() => {
        const fetchPageImages = async () => {
            if (!supabase) return;
            const { data } = await supabase
                .from('page_images')
                .select('page_key, image_url')
                .in('page_key', SERVICE_IMAGE_KEYS);
            if (data) {
                const map = {};
                data.forEach(row => { map[row.page_key] = row.image_url; });
                setPageImages(map);
            }
        };
        fetchPageImages();
    }, []);

    const activeImageUrl = activeService !== null
        ? pageImages[SERVICE_IMAGE_KEYS[activeService]]
        : null;

    const ActiveIcon = activeService !== null ? SERVICE_ICONS[activeService] : null;

    return (
        <div className="profile-page">

            {/* ══════════════════════════════════════
                HERO, Dark band with identity statement
            ══════════════════════════════════════ */}
            <section style={{
                background: 'var(--text-color)',
                color: 'var(--text-light)',
                paddingTop: 'calc(var(--header-height) + clamp(2rem, 5vw, 4rem))',
                paddingBottom: 'clamp(2rem, 6vw, 5rem)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Subtle warm glow */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'none',
                    pointerEvents: 'none',
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="profile-hero-grid">
                        {/* Left: Text */}
                        <div>
                            <div className="mask-parent" style={{ marginBottom: '0.1em' }}>
                                <motion.h1
                                    variants={maskUp} initial="hidden" animate="show" custom={0.1}
                                    style={{
                                        fontSize: 'var(--fs-h1)',
                                        fontWeight: 900, lineHeight: 0.95,
                                        letterSpacing: '-0.05em',
                                        color: 'var(--text-light)',
                                        textTransform: 'uppercase', margin: 0,
                                    }}
                                >
                                    Johnson
                                </motion.h1>
                            </div>
                            <div className="mask-parent" style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
                                <motion.h1
                                    variants={maskUp} initial="hidden" animate="show" custom={0.2}
                                    style={{
                                        fontSize: 'var(--fs-h1)',
                                        fontWeight: 900, lineHeight: 0.95,
                                        letterSpacing: '-0.05em',
                                        color: 'var(--brand-accent)',
                                        textTransform: 'uppercase', margin: 0,
                                    }}
                                >
                                    Kilasi
                                </motion.h1>
                            </div>

                            <motion.p
                                variants={fadeIn} initial="hidden" animate="show" custom={0.45}
                                style={{
                                    color: '#ffffff', fontSize: 'var(--fs-p1)',
                                    lineHeight: 1.65, maxWidth: '42ch', margin: '0 0 2.5rem',
                                    fontWeight: 500,
                                }}
                            >
                                {about.identityStatement}
                            </motion.p>


                        </div>

                        {/* Right: Profile image */}
                        <motion.div
                            className="hero-image-container"
                            initial={{ opacity: 0, scale: 0.95, x: 30 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.9, delay: 0.25 }}
                        >
                            <div className="profile-image-wrapper">
                                <img src={about.profileImage} alt="Johnson Kilasi" className="profile-main-image" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                COMMUNICATION PHILOSOPHY
            ══════════════════════════════════════ */}
            <section className="section about-section section-light">
                <div className="container">
                    <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
                        <div className="mask-parent" style={{ marginBottom: '2rem' }}>
                            <motion.h2
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                            >
                                How I Think About Communication
                            </motion.h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {about.approach.map((paragraph, index) => (
                                <motion.p
                                    key={index}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    {paragraph}
                                </motion.p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                JOURNEY TIMELINE, Career storytelling
            ══════════════════════════════════════ */}
            <section className="section about-section" style={{ background: 'var(--bg-color)' }}>
                <div className="container">
                    <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
                        <div className="mask-parent">
                            <motion.h2
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                            >
                                The Journey
                            </motion.h2>
                        </div>
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            style={{ color: 'var(--text-muted)', maxWidth: '560px', marginTop: '1rem' }}
                        >
                            From science and critical thinking to communications strategy, every step built on the last.
                        </motion.p>
                    </div>

                    <div className="journey-grid">
                        {about.journey.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.08 }}
                                whileHover={{ y: -6, scale: 1.01, boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)' }}
                                style={{
                                    padding: '2rem',
                                    borderRadius: '16px',
                                    background: 'var(--text-color)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    position: 'relative',
                                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                                }}
                            >
                                <span style={{
                                    fontSize: 'var(--fs-small)',
                                    fontWeight: 700,
                                    color: 'var(--brand-accent)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    display: 'block',
                                    marginBottom: '0.75rem',
                                }}>
                                    {step.period}
                                </span>
                                <h3 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--fs-p1)',
                                    fontWeight: 700,
                                    color: 'var(--text-light)',
                                    margin: '0 0 0.75rem',
                                    lineHeight: 1.3,
                                }}>
                                    {step.title}
                                </h3>
                                <p style={{
                                    fontSize: 'var(--fs-p2)',
                                    color: '#ffffff',
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}>
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                HOW I CREATE VALUE, Accordion + sticky visual
            ══════════════════════════════════════ */}
            <section className="section about-section section-subtle">
                <div className="container">
                    <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
                        <div className="mask-parent">
                            <motion.h2
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                            >
                                How I Help
                            </motion.h2>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '2rem',
                    }}>
                        {services.map((service, index) => {
                            const Icon = SERVICE_ICONS[index];
                            return (
                                <motion.div
                                    key={index}
                                    className="profile-service-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <div className="profile-service-header" style={{ marginBottom: '1.5rem', flexWrap: 'nowrap' }}>
                                        {Icon && <Icon size={28} color="var(--brand-accent)" strokeWidth={1.5} style={{ flexShrink: 0 }} />}
                                        <h3 className="profile-service-title" style={{ fontSize: 'var(--fs-h4)', marginBottom: 0 }}>
                                            {service.title}
                                        </h3>
                                    </div>
                                    <p className="profile-service-desc" style={{ marginBottom: '1.5rem', color: 'var(--text-color)' }}>
                                        {service.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </section>

            {/* Removed TOOLS and old PHILOSOPHY */}

            <div id="podcast" style={{ background: 'var(--bg-subtle)' }}>
                <PodcastHighlights />
            </div>

            {/* Closing CTA, dark band */}
            <CTASection
                title="Have an idea worth communicating?"
                subtitle="Whether you are building a brand, launching a project, or trying to connect with your audience more effectively, let's explore how we can bring your ideas to life."
                primaryLabel="Let's Talk"
                primaryTo="/contact"
                secondaryLabel="Email Me"
                secondaryHref="mailto:johnsonsaimon111@gmail.com"
            />
        </div>
    );
};

export default AboutPage;
