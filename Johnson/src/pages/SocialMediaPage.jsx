import React, { useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, Play, Layout, Smartphone, Heart } from 'lucide-react';
import { smData } from '../data/socialMediaData';
import { supabase } from '../lib/supabaseClient';
import './SocialMediaPage.css';
import MiniBrowser from '../components/common/MiniBrowser';

/* ── Animated Counter ─────────────────────────────── */
const AnimatedCounter = ({ value, target, suffix }) => {
    const [count, setCount] = useState(0);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            const end = parseFloat(target);
            if (isNaN(end)) return;
            const duration = 2000;
            const startTime = performance.now();
            const animate = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                setCount(Math.floor(ease * end));
                if (progress < 1) requestAnimationFrame(animate);
                else setCount(value);
            };
            requestAnimationFrame(animate);
        }
    }, [isInView, target, value]);

    return <span ref={ref}>{typeof count === 'number' ? count + suffix : value}</span>;
};

/* ── Hero ──────────────────────────────────────────── */
const SMHero = () => {
    const { hero } = smData;

    return (
        <section className="studio-section sm-hero-section" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '15vh',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 0.8fr',
                    gap: '6rem',
                    alignItems: 'center'
                }}>

                    {/* Left Column: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ textAlign: 'left' }}
                    >
                        <span className="badge" style={{ background: 'var(--brand-accent)', color: '#000', border: 'none' }}>Social</span>
                        <h1 style={{
                            fontSize: 'var(--fs-h1)',
                            marginTop: '2rem',
                            lineHeight: 1.1,
                            fontWeight: 900,
                            letterSpacing: '-0.04em'
                        }}>
                            {hero.title}
                        </h1>
                        <p className="lead" style={{
                            color: 'var(--muted-color)',
                            marginTop: '2.5rem',
                            fontSize: 'var(--fs-p1)',
                            lineHeight: 1.6,
                            maxWidth: '540px',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {hero.content}
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            style={{ marginTop: '3.5rem' }}
                        >
                            <Link to="/contact" className="studio-btn studio-btn-primary" style={{ padding: '1rem 2.5rem' }}>
                                Book a Growth Session
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: High-End Minimal Visual */}
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} className="desktop-only">
                        <motion.div
                            style={{
                                width: '280px',
                                height: '560px',
                                borderRadius: '40px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                                rotate: 2
                            }}
                            initial={{ opacity: 0, scale: 0.9, x: 30 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                        >
                            {/* Visual Content Placeholder (Minimal) */}
                            <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Play size={18} color="#000" fill="#000" />
                                </div>
                                <div style={{ width: '80%', height: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '5px' }}></div>
                                <div style={{ width: '50%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px' }}></div>
                            </div>

                            {/* Floating "Like" micro-interaction */}
                            <motion.div
                                style={{ position: 'absolute', top: '20%', right: '-10px', width: '60px', height: '60px', borderRadius: '50%', background: '#ff4b2b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 10px 20px rgba(255,75,43,0.3)' }}
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Heart size={24} fill="#fff" />
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>

            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                <div style={{ width: '100%', height: '100%' }}>
                    <motion.div animate={{ opacity: [0.05, 0.1, 0.05], scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity }} style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at 70% 30%, rgba(var(--brand-accent-rgb), 0.1), transparent 70%)' }} />
                </div>
            </div>
        </section>
    );
};

/* ── Client Logos ──────────────────────────────────── */
const ClientLogos = () => (
    <div style={{ padding: '6rem 0', overflow: 'hidden' }}>
        <div className="marquee-track">
            <div className="marquee-set">
                {smData.clients.map(client => (
                    <div key={client.name} className="client-logo">{client.name}</div>
                ))}
            </div>
            <div className="marquee-set" aria-hidden="true">
                {smData.clients.map(client => (
                    <div key={`dup-${client.name}`} className="client-logo">{client.name}</div>
                ))}
            </div>
        </div>
    </div>
);

/* ── Analytics Dashboard ──────────────────────────── */
const AnalyticsDash = () => {
    const [metrics, setMetrics] = useState(smData.analytics.metrics); // Fallback

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!supabase) return;
            // Fetch performances where category matches social or similar, Or just order by display order
            const { data, error } = await supabase
                .from('performances')
                .select('*')
                .order('display_order', { ascending: true });

            if (!error && data && data.length > 0) {
                // Filter specifically for social if you set category to 'social' in Admin
                const socialStats = data.filter(s => s.category?.toLowerCase() === 'social' || s.category?.toLowerCase() === 'social_media');

                // If there are social stats, use them, otherwise use the first 5 generic ones
                const displayStats = socialStats.length > 0 ? socialStats : data.slice(0, 5);

                const mappedMetrics = displayStats.map(s => {
                    // Try to parse number and suffix for animation
                    const valStr = s.metric_value;
                    const numMatch = valStr.match(/(\d+(?:\.\d+)?)/);
                    const parsedNum = numMatch ? parseFloat(numMatch[1]) : 0;

                    // The suffix is what comes after the number (e.g., K+, M, %)
                    const suffixMatch = valStr.substring(valStr.indexOf(numMatch ? numMatch[1] : '') + (numMatch ? numMatch[1].length : 0));

                    return {
                        label: s.metric_name,
                        value: s.metric_value, // string fallback
                        target: parsedNum,
                        suffix: suffixMatch.trim()
                    };
                });
                setMetrics(mappedMetrics);
            }
        };
        fetchAnalytics();
    }, []);

    return (
        <section className="studio-section">
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <span className="badge">Growth</span>
                    <h2 style={{ fontSize: 'var(--fs-h2)' }}>{smData.analytics.title}</h2>
                </div>
                <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                    {metrics.map((metric, idx) => (
                        <motion.div key={idx} className="result-stat" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                            <span className="result-val"><AnimatedCounter value={metric.value} target={metric.target} suffix={metric.suffix} /></span>
                            <span className="result-label">{metric.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ── Strategy (Process Cards) ─────────────────────── */
const OurStrategy = () => (
    <section className="studio-section">
        <div className="container">
            <div style={{ textAlign: 'left', marginBottom: '6rem' }}>
                <span className="badge">How I Work</span>
                <h2 style={{ fontSize: 'var(--fs-h2)' }}>Strategic Approach</h2>
            </div>
            <div className="process-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '1.5rem',
                marginTop: '4rem'
            }}>
                {smData.strategy.map((item, idx) => (
                    <motion.div key={idx} className="process-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} style={{ padding: '2rem' }}>
                        <div className="process-num">{(idx + 1).toString().padStart(2, '0')}</div>
                        <h4 style={{ fontSize: '1.2rem', marginTop: '1rem' }}>{item.title}</h4>
                        <p style={{ fontSize: 'var(--fs-p3)', marginBottom: 0, opacity: 0.7 }}>{item.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

/* ── Campaign Spotlight (Project-Card Style) ──────── */
const CampaignSpotlight = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);

        const fetchCampaigns = async () => {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('case_studies')
                .select('*')
                .eq('type', 'social')
                .order('display_order', { ascending: true });

            if (!error && data && data.length > 0) {
                setCampaigns(data);
            } else {
                // Fallback to static data if no DB data exists yet
                setCampaigns(smData.campaigns.map((c, i) => ({
                    id: `static-${i}`,
                    organization_name: c.goal.split(':')[0],
                    organization_type: c.industry,
                    content: {
                        challenges: c.struggles,
                        paragraphs: [c.challenge, c.strategy],
                        tool_stack: c.tools.join(', '),
                        website_url: c.socialLink,
                        media_items: [], // static data doesn't have carousels yet
                        before_after: c.beforeAfter
                    },
                    industry_mapped: c.industry,
                    content_types_mapped: c.contentTypes
                })));
            }
            setLoading(false);
        };
        fetchCampaigns();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) return null;

    return (
    <section className="studio-section">
        <div className="container">
            <div style={{ textAlign: 'left', marginBottom: '8rem' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <span className="badge">Case Studies</span>
                    <h2 style={{ fontSize: 'var(--fs-h1)' }}>Real Growth for Real Brands.</h2>
                    <p style={{ maxWidth: '600px' }}>
                        I help brands grow by combining data-driven strategy with creative storytelling.
                    </p>
                </motion.div>
            </div>

            <div className="project-card-grid" style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
                {campaigns.map((campaign, idx) => {
                    const isEven = idx % 2 === 0;
                    const content = campaign.content || {};
                    const metrics = content.before_after?.after || {};
                    const struggles = content.challenges || [];
                    const tools = content.tool_stack ? content.tool_stack.split(',') : [];

                    return (
                        <motion.div 
                            key={campaign.id || idx} 
                            className="web-project-card sm-campaign-card" 
                            initial={{ opacity: 0, y: 50 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true, margin: "-100px" }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : 'minmax(300px, 1.2fr) minmax(300px, 1fr)',
                                gap: isMobile ? '2rem' : '4rem',
                                alignItems: 'start',
                                direction: (!isMobile && !isEven) ? 'rtl' : 'ltr'
                            }}
                        >
                            {/* Content Side */}
                            <div className="campaign-content" style={{ direction: 'ltr', textAlign: 'left' }}>
                                <span style={{ 
                                    color: 'var(--brand-accent)', 
                                    fontWeight: 900, 
                                    fontSize: '0.75rem', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.15em',
                                    display: 'block',
                                    marginBottom: '0.5rem'
                                }}>
                                    {campaign.organization_type}
                                </span>
                                <h3 style={{ 
                                    fontSize: 'var(--fs-h3)', 
                                    fontWeight: 900, 
                                    textTransform: 'uppercase',
                                    lineHeight: 1.1,
                                    margin: '0.5rem 0 2rem 0',
                                    letterSpacing: '-0.02em'
                                }}>
                                    {campaign.organization_name}
                                </h3>
                                
                                <div className="project-description">
                                    <p style={{ fontSize: 'var(--fs-p2)', color: 'var(--muted-color)', lineHeight: 1.6 }}>{content.paragraphs?.[0]}</p>
                                    <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        {struggles.map((s, i) => s && (
                                            <span key={i} style={{ color: '#ff5f56', fontSize: 'var(--fs-p3)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                                                <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>×</span> {s}
                                            </span>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 'var(--fs-p2)', color: 'var(--muted-color)', lineHeight: 1.6 }}>{content.paragraphs?.[1]}</p>
                                </div>
                            </div>

                            {/* Phone Mockup Side */}
                            <div className="project-card-visual" style={{ direction: 'ltr' }}>
                                <div className="mockup-container">
                                    <MiniBrowser 
                                        type="mobile"
                                        clientName={campaign.organization_name}
                                        url={content.website_url || '#'}
                                        mediaItems={content.media_items || []}
                                        colors={campaign.colors || [`hsl(${(idx * 60 + 180) % 360}, 45%, 25%)`]}
                                        scrollable={true}
                                    />
                                    <div className="content-pills" style={{ marginTop: '2.5rem' }}>
                                        {(content.content_types || campaign.content_types_mapped || []).map(type => (
                                            <span key={type} style={{ 
                                                background: '#1a1a1a', 
                                                border: '1px solid rgba(255,255,255,0.1)', 
                                                borderRadius: '8px', 
                                                padding: '0.4rem 1rem', 
                                                fontSize: '0.7rem', 
                                                fontWeight: 700,
                                                color: '#fff',
                                                textTransform: 'capitalize'
                                            }}>
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Results Wrapper (Metrics) */}
                            <div className="project-results-wrapper" style={{ direction: 'ltr', textAlign: 'left', marginTop: '2rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    {Object.entries(metrics).map(([key, val]) => (
                                        <div key={`a-${key}`} style={{ 
                                            padding: '1.2rem', 
                                            background: '#BDFF00', 
                                            borderRadius: '12px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            minHeight: '80px'
                                        }}>
                                            <span style={{ fontSize: '1.4rem', color: '#000', fontWeight: 900, lineHeight: 1 }}>{val}</span>
                                            <span style={{ fontSize: '0.6rem', color: '#000', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.3rem', opacity: 0.8 }}>{key}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Toolstack */}
                            <div className="project-toolstack" style={{ direction: 'ltr', textAlign: 'left', marginTop: '2rem' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--muted-color)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    TOOLSTACK: {tools.map(t => t.trim()).join(' + ')}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    </section>
    );
};

/* ── Feed Grid ────────────────────────────────────── */
const FeedGrid = () => {
    const [selectedPost, setSelectedPost] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [feedItems, setFeedItems] = useState(smData.feed);

    useEffect(() => {
        const fetchFeed = async () => {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('community_content')
                .select('*')
                .order('display_order', { ascending: true });
            if (!error && data && data.length > 0) {
                setFeedItems(data);
            }
        };
        fetchFeed();
    }, []);

    return (
        <section className="studio-section">
            <div className="container">
                <div style={{ textAlign: 'left', marginBottom: '6rem' }}>
                    <span className="badge">Creator Work</span>
                    <h2 style={{ fontSize: 'var(--fs-h2)' }}>Content that Builds Communities.</h2>
                    <p style={{ color: 'var(--muted-color)', maxWidth: '600px', margin: '1rem 0' }}>Exploring the strategy behind individual top-performing assets.</p>
                </div>

                <div className="sm-feed-grid">
                    {feedItems.map((post, i) => {
                        const mediaSrc = post.media_items && post.media_items.length > 0 
                            ? post.media_items[0] 
                            : post.image_url;
                        
                        return (
                            <motion.div 
                                key={post.id || i} 
                                className="feed-item" 
                                initial={{ opacity: 0, scale: 0.9 }} 
                                whileInView={{ opacity: 1, scale: 1 }} 
                                viewport={{ once: true }} 
                                transition={{ delay: i * 0.05 }} 
                                onClick={() => {
                                    setCurrentSlide(0);
                                    setSelectedPost(post);
                                }}
                            >
                                {mediaSrc ? (
                                    mediaSrc.match(/\.(mp4|webm|ogg)$/i) ? (
                                        <video src={mediaSrc} muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <img src={mediaSrc} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: `hsl(${(i * 40) % 360}, 30%, 20%)` }} />
                                )}
                                <div className="feed-overlay">
                                    <span style={{ fontWeight: 600 }}>♥ {post.metrics?.likes || '0'}</span>
                                    <span style={{ fontWeight: 600 }}>💬 {post.metrics?.comments || '0'}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {selectedPost && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPost(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'grid', placeItems: 'center', padding: '2rem' }}>
                        <motion.div initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }} onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', width: '100%', maxWidth: '800px', display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 1fr', gap: '2rem', overflow: 'hidden' }}>
                            <div style={{ position: 'relative', overflow: 'hidden', minHeight: '400px' }}>
                                {selectedPost.media_items && selectedPost.media_items.length > 0 ? (
                                    <div className="modal-carousel" style={{ height: '100%', display: 'flex', transition: 'transform 0.3s ease', transform: `translateX(-${currentSlide * 100}%)` }}>
                                        {selectedPost.media_items.map((item, idx) => (
                                            <div key={idx} style={{ minWidth: '100%', height: '100%' }}>
                                                {item.match(/\.(mp4|webm|ogg)$/i) ? (
                                                    <video src={item} controls autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <img src={item} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : selectedPost.image_url ? (
                                    <img src={selectedPost.image_url} alt={selectedPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: `hsl(${(selectedPost.id * 40) % 360}, 30%, 20%)` }} />
                                )}
                                
                                {selectedPost.media_items?.length > 1 && (
                                    <>
                                        <button 
                                            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                                            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', zIndex: 10, visibility: currentSlide === 0 ? 'hidden' : 'visible' }}
                                        >
                                            ←
                                        </button>
                                        <button 
                                            onClick={() => setCurrentSlide(prev => Math.min(selectedPost.media_items.length - 1, prev + 1))}
                                            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', zIndex: 10, visibility: currentSlide === selectedPost.media_items.length - 1 ? 'hidden' : 'visible' }}
                                        >
                                            →
                                        </button>
                                        <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                                            {selectedPost.media_items.map((_, i) => (
                                                <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === currentSlide ? 'var(--brand-accent)' : 'rgba(255,255,255,0.5)' }} />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div style={{ padding: '2rem 2rem 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--brand-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>{selectedPost.type}</span>
                                    <button onClick={() => setSelectedPost(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
                                </div>
                                <h3 style={{ margin: 0 }}>{selectedPost.title}</h3>
                                <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>{selectedPost.hook}</p>
                                <p style={{ color: 'var(--muted-color)' }}>{selectedPost.description}</p>
                                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '1.5rem' }}>
                                    {selectedPost.metrics && Object.entries(selectedPost.metrics).map(([key, val]) => (
                                        <div key={key}>
                                            <span style={{ display: 'block', fontWeight: 800, color: 'var(--brand-accent)' }}>{val}</span>
                                            <span style={{ color: 'var(--muted-color)', textTransform: 'capitalize', fontSize: '0.8rem' }}>{key}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

/* ── Reel Mockup ──────────────────────────────────── */
const ReelMockup = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [reels, setReels] = useState(smData.reels);
    const [eraTitle, setEraTitle] = useState("The Era of Short-Form");
    const [activeIndex, setActiveIndex] = useState(0);
    const [isManualScrolling, setIsManualScrolling] = useState(false);

    const containerRef = React.useRef(null);
    const observerRef = React.useRef(null);
    const timeoutRef = React.useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);

        const fetchReels = async () => {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('short_form_content')
                .select('*')
                .order('display_order', { ascending: true });
            if (!error && data && data.length > 0) {
                setReels(data);
                if (data[0].era) setEraTitle(data[0].era);
            }
        };
        fetchReels();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (observerRef.current) observerRef.current.disconnect();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // Setup Intersection Observer for Scroll Sync
    useEffect(() => {
        if (!reels || reels.length === 0 || !containerRef.current) return;

        if (observerRef.current) observerRef.current.disconnect();

        const options = {
            root: containerRef.current,
            rootMargin: '0px',
            threshold: 0.7 // Increased threshold for more precise activation
        };

        observerRef.current = new IntersectionObserver((entries) => {
            if (isManualScrolling) return;

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const indexStr = entry.target.getAttribute('data-index');
                    const index = parseInt(indexStr);
                    if (!isNaN(index) && index >= 0 && index < reels.length) {
                        setActiveIndex(index);
                    }
                }
            });
        }, options);

        const items = containerRef.current.querySelectorAll('.reel-item');
        items.forEach((item) => observerRef.current.observe(item));

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [reels, isManualScrolling]);

    // Sync activeIndex to eraTitle
    useEffect(() => {
        if (reels[activeIndex]?.era) {
            setEraTitle(reels[activeIndex].era);
        }
    }, [activeIndex, reels]);

    const handleTabClick = (index) => {
        if (!reels || reels.length === 0) return;
        if (index < 0 || index >= reels.length) return;
        if (activeIndex === index) return;
        
        setIsManualScrolling(true);
        setActiveIndex(index);

        if (containerRef.current) {
            const items = containerRef.current.querySelectorAll('.reel-item');
            if (items && items[index]) {
                items[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // Resume intersection observer after smooth scroll completes
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsManualScrolling(false);
        }, 1000); // Slightly longer delay to ensure scroll stability
    };

    return (
    <section className="studio-section">
        <div className="container">
            <div className={`web-project-card ${isMobile ? 'mobile-order' : ''}`} style={{ 
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(300px, 1fr) minmax(300px, 1.2fr)',
                gap: isMobile ? '2rem' : '6rem',
                alignItems: 'center'
            }}>
                <div style={{ direction: 'ltr' }}>
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="phone-mockup" style={{ margin: '0 auto', maxWidth: '240px' }}>
                        <div ref={containerRef} className="reel-container" style={{ scrollSnapType: 'y mandatory', overflowY: 'auto', height: '100%', borderRadius: '32px' }}>
                            {reels.map((reel, i) => (
                                <div 
                                    key={reel.id || i} 
                                    data-index={i}
                                    className="reel-item" 
                                    style={{ position: 'relative', height: '100%', scrollSnapAlign: 'start', scrollSnapStop: 'always', background: `hsl(${(200 + i * 40) % 360}, 20%, 15%)`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem 1.5rem', overflow: 'hidden' }}
                                >
                                    {(reel.media_items?.[0] || reel.video_url) && (
                                        <video 
                                            src={reel.media_items?.[0] || reel.video_url} 
                                            autoPlay 
                                            muted 
                                            loop 
                                            playsInline
                                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} 
                                        />
                                    )}
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <div style={{ position: 'absolute', right: '1rem', bottom: '20%', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Heart size={20} fill="#fff" /></div>
                                            <div style={{ width: 35, height: 35, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                                        </div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', maxWidth: '80%', fontSize: '1.1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{reel.title}</h4>
                                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>▶ {reel.views} views</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                    <span style={{ color: 'var(--brand-accent)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reels + TikTok Specialist</span>
                    <h3 style={{ fontSize: 'var(--fs-h2)', margin: '1rem 0' }}>{reels[activeIndex]?.era || eraTitle}</h3>
                    <p style={{ color: 'var(--muted-color)', fontSize: 'var(--fs-p2)' }}>
                        {reels[activeIndex]?.description || "Attention spans are shrinking. I script, shoot, and edit vertical video designed entirely around the all-important first 3-second hook."}
                    </p>
                    <div className="results-grid" style={{ 
                        display: 'grid',
                        gridTemplateColumns: '1fr', 
                        marginTop: '2rem', 
                        gap: '1.5rem'
                    }}>
                        {reels.map((reel, idx) => (
                            <motion.div 
                                key={reel.id || idx} 
                                className={`result-stat ${activeIndex === idx ? 'active' : ''}`}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => handleTabClick(idx)}
                                style={{ 
                                    padding: '1.5rem', 
                                    background: activeIndex === idx ? 'rgba(var(--brand-accent-rgb), 0.1)' : 'rgba(255,255,255,0.03)', 
                                    border: `1px solid ${activeIndex === idx ? 'var(--brand-accent)' : 'rgba(255,255,255,0.05)'}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <span className="result-val" style={{ fontSize: '1.1rem', color: activeIndex === idx ? 'var(--brand-accent)' : '#fff' }}>{reel.title}</span>
                                <span className="result-label">{reel.category || 'Technique'}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
    );
};

/* ── Testimonials ─────────────────────────────────── */
const SocialTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchT = async () => {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false })
                .limit(6);
            if (!error && data) {
                setTestimonials(data);
            }
            setLoading(false);
        };
        fetchT();
    }, []);

    const [displayTestimonials, setDisplayTestimonials] = useState([]);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

    useEffect(() => {
        if (testimonials.length > 0) {
            const filtered = testimonials.filter(t => t.category === 'social_media' || t.category === 'general');
            setDisplayTestimonials(filtered);
        } else if (testimonials.length === 0 && !loading) {
            setDisplayTestimonials([]);
        }
        if (!loading) setHasAttemptedFetch(true);
    }, [testimonials, loading]);

    if (hasAttemptedFetch && displayTestimonials.length === 0) return null;

    return (
        <section className="studio-section" style={{ paddingBottom: '12rem' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ textAlign: 'left', marginBottom: '6rem' }}>
                    <span className="badge">Proof</span>
                    <h2 style={{ fontSize: 'var(--fs-h2)' }}>Client Wins</h2>
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
                                    color: 'var(--text-color)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '24px',
                                    borderBottomLeftRadius: isEven ? '4px' : '24px',
                                    borderBottomRightRadius: !isEven ? '4px' : '24px',
                                    position: 'relative',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                }}
                            >
                                <p style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', lineHeight: 1.5, fontStyle: 'italic', fontWeight: 400 }}>"{test.quote}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: isEven ? 'flex-start' : 'flex-end' }}>
                                    <span style={{
                                        fontWeight: 800,
                                        color: 'var(--brand-accent)',
                                        fontSize: '0.75rem',
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

/* ── Educational Tools ────────────────────────────── */
const EducationalTools = () => (
    <section className="studio-section">
        <div className="container">
            <div style={{ textAlign: 'left', marginBottom: '6rem' }}>
                <span className="badge">My Workflow</span>
                <h2 style={{ fontSize: 'var(--fs-h2)' }}>The Toolkit</h2>
                <p style={{ color: 'var(--muted-color)', maxWidth: '600px', margin: '1rem 0' }}>The essential tools I use to manage, design, and grow digital presence.</p>
            </div>
            <div className="process-grid">
                {smData.educationalTools.map((tool, idx) => (
                    <motion.div key={idx} className="process-card" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                        <span style={{ color: 'var(--brand-accent)', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{tool.category}</span>
                        <h4 style={{ margin: '0.5rem 0' }}>{tool.name}</h4>
                        <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>{tool.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

/* ── CTA ──────────────────────────────────────────── */
export const SMCallToAction = () => (
    <section className="studio-section" style={{ paddingBottom: '12rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                <h2 style={{ fontSize: 'var(--fs-h1)', textAlign: 'center' }}>{smData.cta}</h2>
                <p style={{ color: 'var(--muted-color)', maxWidth: '600px', margin: '0 auto', textAlign: 'center', fontSize: 'var(--fs-p1)' }}>
                    Stop guessing what your audience wants. I help you build a sustainable, strategy-driven presence.
                </p>
            </motion.div>
        </div>
    </section>
);

/* ── Main Page ────────────────────────────────────── */
const SocialMediaPage = () => (
    <div className="social-page">
        <SMHero />
        <ClientLogos />
        <CampaignSpotlight />
        <OurStrategy />
        <FeedGrid />
        <ReelMockup />
        <EducationalTools />
        <SocialTestimonials />
        <SMCallToAction />
    </div>
);

export default SocialMediaPage;
