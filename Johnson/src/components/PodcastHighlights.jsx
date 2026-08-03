import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, PlayCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const PodcastHighlights = () => {
    const [episodes, setEpisodes] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [carouselOffset, setCarouselOffset] = useState(0);
    const [isHoveringStack, setIsHoveringStack] = useState(false);

    useEffect(() => {
        const fetchEpisodes = async () => {
            if (!supabase) { setLoading(false); return; }
            const { data, error } = await supabase
                .from('podcasts')
                .select('*')
                .order('episode_number', { ascending: false })
                .limit(6);
            
            if (data && data.length > 0) {
                setEpisodes(data);
            }
            setLoading(false);
        };
        fetchEpisodes();
    }, []);

    const displayEpisodes = episodes.length > 0 ? episodes : [
        { id: '66a8eb87beb76fc5ebe64571', title: 'Networking', episode_number: 6 },
        { id: '665430f12d069b0012ed8216', title: 'Experience in National Service-JKT', episode_number: 5 },
        { id: '6639d9f531213e001248a3a4', title: 'Celebrating Small Wins', episode_number: 4 },
        { id: '661ce5deaed7bb0016edfdf7', title: 'Effective Goal Setting', episode_number: 3 },
        { id: '65e595a1fd399f0016bbed1c', title: 'Empowering Youth: The Consistency Code for Success', episode_number: 2 },
        { id: '65cb70020bc4c400162f69d8', title: 'Ulumbi: Why Ulumbi?', episode_number: 1 }
    ];

    const activeEpisode = displayEpisodes[activeIndex];
    const sequenceEpisodes = displayEpisodes.filter((_, idx) => idx !== activeIndex);

    // Continuous loop timer
    useEffect(() => {
        let interval;
        if (isHoveringStack && sequenceEpisodes.length > 3) {
            interval = setInterval(() => {
                setCarouselOffset((prev) => (prev + 1) % sequenceEpisodes.length);
            }, 1200); // Rotate every 1.2s while hovering
        }
        return () => clearInterval(interval);
    }, [isHoveringStack, sequenceEpisodes.length]);

    const shiftedSequence = [
        ...sequenceEpisodes.slice(carouselOffset),
        ...sequenceEpisodes.slice(0, carouselOffset)
    ];

    return (
        <section className="studio-section" style={{ padding: '6rem 0', background: '#09152E', overflow: 'hidden' }}>
            <div className="container">
                <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'var(--fs-h2)', marginTop: '0', color: '#FFFFFF' }}>
                        Conversations on Education, Society, and Growth
                    </h2>
                    <p style={{ color: '#ffffff', maxWidth: '620px', margin: '1rem auto 0', fontSize: '1.125rem' }}>
                        Ulumbi Podcast is a journey into the minds, ideas and solutions that shape our world. 
                        Select a session below to start listening.
                    </p>
                </div>

                <div className="podcast-interactive-wrapper" style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    flexWrap: 'wrap', 
                    gap: '4rem', 
                    maxWidth: '1200px', 
                    margin: '0 auto', 
                    alignItems: 'flex-start' 
                }}>
                    
                    {/* Active Hero Slot (Left Side) */}
                    <div className="active-player-slot" style={{ flex: '1 1 500px', position: 'relative' }}>
                        <AnimatePresence mode="popLayout">
                            <motion.div 
                                layoutId={`pod-card-${activeEpisode.id}`}
                                key={`active-${activeEpisode.id}`}
                                style={{
                                    width: '100%',
                                    background: '#FFD700',
                                    borderRadius: '24px',
                                    padding: '2rem',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem',
                                    zIndex: 10
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <h3 style={{ color: '#09152E', margin: 0, fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Now Playing: Ep {activeEpisode.episode_number || activeEpisode.number || "?"}
                                    </h3>
                                    <PlayCircle size={28} color="#09152E" />
                                </div>
                                
                                <h4 style={{ color: '#09152E', fontSize: '2rem', lineHeight: 1.1, margin: 0, fontWeight: 800 }}>
                                    {activeEpisode.title}
                                </h4>
                                
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    style={{ borderRadius: '16px', overflow: 'hidden', background: '#09152E', height: '200px' }}
                                >
                                    <iframe 
                                        style={{ borderRadius: '16px', border: 'none' }} 
                                        src={`https://embed.acast.com/$/65b757fac88e880016ff9a1a/${activeEpisode.id}`} 
                                        width="100%" 
                                        height="100%" 
                                        frameBorder="0" 
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                        loading="lazy"
                                    ></iframe>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Auto-looping Stacked Sequence List (Right Side) */}
                    <div 
                        className="carousel-sequence-slot" 
                        style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', position: 'relative', height: '450px' }}
                    >
                        <AnimatePresence>
                            {shiftedSequence.map((ep, idx) => {
                                const isTop3 = idx < 3;
                                
                                // Calculate stack positions
                                const yOffset = isTop3 ? idx * 115 : 340 + (idx - 3) * 12;
                                const scale = isTop3 ? 1 : Math.max(0.85, 1 - (idx - 3) * 0.05);
                                const opacity = isTop3 ? 1 : Math.max(0, 0.7 - (idx - 3) * 0.2);
                                const zIndex = sequenceEpisodes.length - idx;

                                return (
                                    <motion.div
                                        layout
                                        initial={false}
                                        animate={{ opacity, y: yOffset, scale, zIndex }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                                        key={`sequence-${ep.id}`}
                                        onClick={() => {
                                            const originalIndex = displayEpisodes.findIndex(e => e.id === ep.id);
                                            setActiveIndex(originalIndex);
                                            setCarouselOffset(0); // Reset loop on click
                                            setIsHoveringStack(false);
                                        }}
                                        onMouseEnter={() => {
                                            if (!isTop3) setIsHoveringStack(true);
                                        }}
                                        onMouseLeave={() => {
                                            setIsHoveringStack(false);
                                        }}
                                        whileHover={!isTop3 ? { scale: scale + 0.02 } : undefined}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100px', // Fixed height for predictable layout
                                            background: '#FFD700',
                                            borderRadius: '16px',
                                            padding: '1.25rem 1.5rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                                            color: '#09152E'
                                        }}
                                        className="ripple-card"
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'inherit' }}>
                                                Episode {ep.episode_number || ep.number || "?"}
                                            </span>
                                            <ArrowUpRight size={18} style={{ opacity: 0.5 }} />
                                        </div>
                                        
                                        <h4 style={{ fontSize: '1.125rem', lineHeight: 1.3, marginTop: '0.5rem', fontWeight: 800, position: 'relative', zIndex: 1, color: 'inherit' }}>
                                            {ep.title}
                                        </h4>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>

                </div>

                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <a
                        href="https://linktr.ee/ulumbipodcast?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#FFD700', fontWeight: 700, padding: '0.75rem 1.5rem', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '100px', textDecoration: 'none', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,215,0,0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        Listen to all episodes <ArrowUpRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default PodcastHighlights;
