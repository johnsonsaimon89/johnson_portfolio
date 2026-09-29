import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { supabase } from '../lib/supabaseClient';
import CTASection from '../components/common/CTASection';
import affinityLogo from '../assets/affinity-logo-white.svg';
import { formatUrl } from '../utils/urlUtils';

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

const WorkPage = () => {
    const { pathname } = useLocation();
    const [projects, setProjects] = useState(portfolioData.projects);
    const [caseStudies, setCaseStudies] = useState(portfolioData.caseStudies);
    const carouselRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => { 
        window.scrollTo(0, 0); 
        
        const fetchStudies = async () => {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('case_studies')
                .select('*')
                .eq('is_active', true)
                .eq('type', 'web')
                .order('display_order', { ascending: true });
                
            if (data && data.length > 0) {
                const mainCaseStudies = [];
                const carouselProjects = [];
                
                data.forEach(d => {
                    const rawUrl = d.content?.url || '';
                    const mappedItem = {
                        id: d.id,
                        title: d.content?.title || '',
                        organization: d.organization_name || '',
                        category: d.organization_type || '',
                        image: d.content?.image || '',
                        url: formatUrl(rawUrl),
                        upcoming: d.content?.upcoming || false,
                        context: d.content?.context || '',
                        challenge: d.content?.challenge || '',
                        role: d.content?.role || '',
                        approach: d.content?.approach || '',
                        impact: d.content?.impact || []
                    };
                    
                    if (d.content?.isProject) {
                        if (mappedItem.title && mappedItem.category) {
                            carouselProjects.push(mappedItem);
                        }
                    } else {
                        if (mappedItem.title && mappedItem.organization) {
                            mainCaseStudies.push(mappedItem);
                        }
                    }
                });
                
                if (mainCaseStudies.length > 0) {
                    setCaseStudies(mainCaseStudies);
                }
                
                if (carouselProjects.length > 0) {
                    setProjects(carouselProjects);
                }
            }
        };
        fetchStudies();
    }, [pathname]);

    // Auto-scroll logic removed as requested

    const scrollPrev = useCallback(() => {
        if (carouselRef.current) {
            const current = carouselRef.current;
            const scrollAmount = current.clientWidth > 1024 ? current.clientWidth / 3 : current.clientWidth > 768 ? current.clientWidth / 2 : current.clientWidth;
            if (current.scrollLeft <= 0) {
                current.scrollTo({ left: current.scrollWidth, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        }
    }, []);

    const scrollNext = useCallback(() => {
        if (carouselRef.current) {
            const current = carouselRef.current;
            const scrollAmount = current.clientWidth > 1024 ? current.clientWidth / 3 : current.clientWidth > 768 ? current.clientWidth / 2 : current.clientWidth;
            if (current.scrollLeft + current.clientWidth >= current.scrollWidth - 10) {
                current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    }, []);

    return (
        <div className="profile-page">

            {/* ══════════════════════════════════════
                HERO
            ══════════════════════════════════════ */}
            <section style={{
                background: 'var(--text-color)',
                paddingTop: 'calc(var(--header-height) + clamp(2rem, 5vw, 4rem))',
                paddingBottom: 'clamp(2rem, 6vw, 5rem)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'none',
                    pointerEvents: 'none',
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="reveal-parent" style={{ marginBottom: '0.1em' }}>
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
                            Real Projects
                        </motion.h1>
                    </div>
                    <div className="reveal-parent" style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
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
                            Real Impact
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        style={{
                            color: '#ffffff',
                            fontSize: 'var(--fs-p1)',
                            lineHeight: 1.65,
                            maxWidth: '50ch',
                            margin: 0,
                        }}
                    >
                        Every project starts with a question: what story needs to be told, and how can we make sure the right people hear it?
                    </motion.p>
                </div>
            </section>

            {/* ══════════════════════════════════════
                CASE STUDIES, Storytelling format
            ══════════════════════════════════════ */}
            <section className="section" style={{ background: 'var(--bg-color)' }}>
                <div className="container">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4rem, 8vw, 8rem)' }}>
                        {caseStudies.map((study, idx) => (
                            <motion.article
                                key={study.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ duration: 0.7 }}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                    gap: 'clamp(2rem, 4vw, 4rem)',
                                    alignItems: 'start',
                                    paddingBottom: idx < caseStudies.length - 1 ? 'clamp(4rem, 8vw, 8rem)' : 0,
                                    borderBottom: idx < caseStudies.length - 1 ? '1px solid var(--border-color)' : 'none',
                                }}
                            >
                                {/* Left: Visual */}
                                <div>
                                    {study.image ? (
                                        <motion.div 
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            style={{
                                            borderRadius: '20px',
                                            overflow: 'hidden',
                                            aspectRatio: '16/10',
                                            background: 'var(--surface-color)',
                                        }}>
                                            <img
                                                src={study.image}
                                                alt={study.organization}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            style={{
                                            borderRadius: '20px',
                                            aspectRatio: '16/10',
                                            background: 'var(--surface-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <span style={{
                                                fontFamily: 'var(--font-heading)',
                                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                                fontWeight: 900,
                                                color: 'var(--text-muted)',
                                                textTransform: 'uppercase',
                                            }}>
                                                {study.organization}
                                            </span>
                                        </motion.div>
                                    )}

                                    {/* Impact metrics */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '0.75rem',
                                        marginTop: '1.5rem',
                                    }}>
                                        {(study.impact || []).slice(0, 4).map((item, i) => (
                                            <div key={i} style={{
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                background: 'var(--surface-alt)',
                                                border: '1px solid var(--border-color)',
                                            }}>
                                                <p style={{
                                                    fontSize: 'var(--fs-small)',
                                                    color: 'var(--text-muted)',
                                                    margin: 0,
                                                    lineHeight: 1.5,
                                                }}>
                                                    {item}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Content */}
                                <div>
                                    <span style={{
                                        fontSize: 'var(--fs-small)',
                                        fontWeight: 700,
                                        color: 'var(--brand-accent)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                        display: 'block',
                                        marginBottom: '0.75rem',
                                    }}>
                                        {study.category}
                                    </span>

                                    <h2 style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                                        fontWeight: 800,
                                        lineHeight: 1.2,
                                        letterSpacing: '-0.02em',
                                        margin: '0 0 2rem',
                                    }}>
                                        {study.title}
                                    </h2>

                                    {/* Context */}
                                    {study.context && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{
                                                fontSize: 'var(--fs-small)',
                                                fontWeight: 700,
                                                color: 'var(--brand-accent)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                                margin: '0 0 0.5rem',
                                            }}>Context</h4>
                                            <p style={{ fontSize: 'var(--fs-p2)', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                                                {study.context}
                                            </p>
                                        </div>
                                    )}

                                    {/* Challenge */}
                                    {study.challenge && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{
                                                fontSize: 'var(--fs-small)',
                                                fontWeight: 700,
                                                color: 'var(--brand-accent)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                                margin: '0 0 0.5rem',
                                            }}>Challenge</h4>
                                            <p style={{ fontSize: 'var(--fs-p2)', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                                                {study.challenge}
                                            </p>
                                        </div>
                                    )}

                                    {/* Role */}
                                    {study.role && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{
                                                fontSize: 'var(--fs-small)',
                                                fontWeight: 700,
                                                color: 'var(--brand-accent)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                                margin: '0 0 0.5rem',
                                            }}>My Role</h4>
                                            <p style={{ fontSize: 'var(--fs-p2)', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                                                {study.role}
                                            </p>
                                        </div>
                                    )}

                                    {/* Approach */}
                                    {study.approach && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{
                                                fontSize: 'var(--fs-small)',
                                                fontWeight: 700,
                                                color: 'var(--brand-accent)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                                margin: '0 0 0.5rem',
                                            }}>Approach</h4>
                                            <p style={{ fontSize: 'var(--fs-p2)', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                                                {study.approach}
                                            </p>
                                        </div>
                                    )}

                                    {/* Link */}
                                    {study.url && (
                                        <a
                                            href={formatUrl(study.url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: 'var(--brand-accent)',
                                                fontWeight: 700,
                                                fontSize: 'var(--fs-p2)',
                                                textDecoration: 'none',
                                                marginTop: '0.5rem',
                                            }}
                                        >
                                            Visit {study.organization} <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                PROJECT GRID, All projects visual overview
            ══════════════════════════════════════ */}
            <section className="section section-subtle">
                <div className="container">
                    <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800 }}>
                                All Projects
                            </h2>
                        </div>
                        
                        {/* Carousel Navigation Buttons */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                                onClick={scrollPrev}
                                style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    border: 'none', background: 'var(--text-color)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#ffffff', cursor: 'pointer', transition: 'var(--transition-fast)'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-accent)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--text-color)'; }}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button 
                                onClick={scrollNext}
                                style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    border: 'none', background: 'var(--text-color)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#ffffff', cursor: 'pointer', transition: 'var(--transition-fast)'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-accent)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--text-color)'; }}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div 
                        ref={carouselRef}
                        className="project-carousel"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {projects.map((project, idx) => (
                            <motion.a
                                key={project.title}
                                href={formatUrl(project.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-carousel-item"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.08 }}
                                whileHover={{ y: -6 }}
                                style={{
                                    display: 'block',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    background: 'var(--surface-alt)',
                                    border: '1px solid var(--border-color)',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    position: 'relative',
                                    transition: 'box-shadow 0.3s ease',
                                }}
                            >
                                <div style={{
                                    aspectRatio: '16/10',
                                    background: project.image ? `url(${project.image}) center/cover` : 'var(--surface-color)',
                                    position: 'relative',
                                }}>
                                    {project.upcoming && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            background: 'var(--brand-accent)',
                                            color: '#000',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '100px',
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}>
                                            Coming Soon
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{
                                                fontFamily: 'var(--font-heading)',
                                                fontSize: 'var(--fs-p1)',
                                                fontWeight: 700,
                                                margin: '0 0 0.25rem',
                                            }}>
                                                {project.title}
                                            </h3>
                                            <p style={{
                                                fontSize: 'var(--fs-small)',
                                                color: 'var(--text-muted)',
                                                margin: 0,
                                            }}>
                                                {project.category}
                                            </p>
                                        </div>
                                        <ArrowUpRight size={18} color="var(--text-muted)" />
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                TOOLS, Marquee in Dark Band
            ══════════════════════════════════════ */}
            <section style={{ background: 'var(--text-color)', padding: '3rem 0 clamp(3rem, 5vw, 4rem)' }}>
                <div className="container" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <p style={{
                        fontSize: 'var(--fs-small)',
                        fontWeight: 700,
                        color: 'var(--brand-accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        margin: 0
                    }}>
                        Tools I use to bring strategies to life
                    </p>
                </div>
                
                <div className="brand-marquee-wrapper" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                    <div className="brand-marquee-track">
                        {[...TOOL_LOGOS, ...TOOL_LOGOS, ...TOOL_LOGOS, ...TOOL_LOGOS].map((tool, i) => (
                            <a key={i} href={tool.link} target="_blank" rel="noopener noreferrer" className="brand-marquee-item" style={{ border: 'none', padding: '0 3.5rem', display: 'flex', alignItems: 'center' }}>
                                <img src={tool.url} alt={tool.name} title={tool.name} style={{ height: '36px', width: 'auto' }} />
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <CTASection
                title="Have a project in mind?"
                subtitle="Whether it's a communication strategy, a digital platform, or a storytelling campaign, I'd love to hear about it."
                primaryLabel="Let's Talk"
                primaryTo="/contact"
                secondaryLabel="Email Me"
                secondaryHref="mailto:hello@johnsonsaimon.com"
            />
        </div>
    );
};

export default WorkPage;
