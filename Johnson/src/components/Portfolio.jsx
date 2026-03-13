import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import MagneticButton from './common/MagneticButton';
import LazyImage from './common/LazyImage';

const ProjectCard = ({ project, index }) => {
    const isLarge = project.size === 'large';

    const cardStyles = {
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        height: isLarge ? 'clamp(400px, 60vw, 600px)' : 'clamp(350px, 50vw, 450px)',
        cursor: project.url ? 'pointer' : 'default',
        textDecoration: 'none',
        display: 'block'
    };

    const mediaQueries = `
        @media (min-width: 768px) {
            #portfolio-card-${index} {
                grid-column: ${isLarge ? 'span 2' : 'span 1'};
            }
        }
    `;

    return (
        <>
            <style>{mediaQueries}</style>
            <motion.a
                id={`portfolio-card-${index}`}
                href={project.url || '#'}
                target={project.url ? "_blank" : "_self"}
                rel="noopener noreferrer"
                initial={["rest", "scrollHidden"]}
                whileHover="hover"
                whileInView="scrollVisible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                    scrollHidden: { opacity: 0, y: 30 },
                    scrollVisible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: index * 0.1 } }
                }}
                style={cardStyles}
                className={`bento-item ${index % 3 === 1 ? 'frame-taped' : index % 3 === 2 ? 'frame-angled' : ''}`}
            >
                {/* Background Image Setup */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: 'var(--color-bg-surface)' }}>
                    {project.image_url && (
                        <motion.div
                            style={{ height: '120%', width: '100%', position: 'absolute', top: '-10%' }}
                            variants={{
                                rest: { scale: 1.0, filter: 'grayscale(80%) brightness(0.5)' },
                                hover: { scale: 1.05, filter: 'grayscale(0%) brightness(0.8)' }
                            }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <LazyImage
                                src={project.image_url}
                                alt={project.title}
                                revealDirection={index % 2 === 0 ? 'bottom' : 'right'}
                                style={{ height: '100%', width: '100%' }}
                            />
                        </motion.div>
                    )}
                </div>

                {/* Cinematic Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'transparent',
                    zIndex: 1
                }} />

                {/* Content */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 'clamp(1.5rem, 5vw, 3rem)',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--brand-accent)' }}>
                            {project.category}
                        </span>
                        {project.upcoming && (
                            <span style={{
                                background: 'var(--brand-accent)',
                                color: '#000',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '100px',
                                fontWeight: 800,
                                textTransform: 'uppercase'
                            }}>
                                Upcoming
                            </span>
                        )}
                    </div>

                    <h3 style={{ color: '#fff', margin: 0, }}>
                        {project.title}
                    </h3>

                    {project.url && (
                        <motion.div
                            variants={{
                                rest: { opacity: 0, y: 10, height: 0 },
                                hover: { opacity: 1, y: 0, height: 'auto' }
                            }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            style={{ overflow: 'hidden', marginTop: '0.5rem' }}
                        >
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 600,
                                color: '#fff',
                                borderBottom: '1px solid rgba(255,255,255,0.4)',
                                paddingBottom: '2px'
                            }}>
                                View Live Project <span>→</span>
                            </span>
                        </motion.div>
                    )}
                </div>
            </motion.a>
        </>
    );
};

const Portfolio = ({ id }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!supabase) {
                setLoading(false);
                return;
            }
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('display_order', { ascending: true });
            if (!error && data) {
                // Map the new schema to the expected props for project card
                const mappedProjects = data.map(p => ({
                    ...p,
                    url: p.link,
                    upcoming: p.is_upcoming,
                    image: p.image_url
                }));
                setProjects(mappedProjects);
            }
            setLoading(false);
        };
        fetchProjects();
    }, []);

    return (
        <section id={id} className="section portfolio" style={{ paddingTop: '8rem', paddingBottom: '10rem' }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    gap: '2rem',
                    flexWrap: 'wrap',
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{ color: 'var(--brand-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                            Selected Work
                        </span>
                        <h2 style={{ marginTop: '1rem', }}>
                            Impactful <span style={{ color: 'var(--brand-accent)' }}>Projects</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <MagneticButton strength={0.3}>
                            <Link to="/web-portfolio" className="btn-outline" style={{ display: 'inline-flex', borderRadius: '100px' }}>
                                View Portfolio
                            </Link>
                        </MagneticButton>
                    </motion.div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-color)' }}>Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-color)' }}>No projects added yet.</div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
                        gap: '1.5rem',
                        gridAutoFlow: 'row dense' // Helps fill gaps created by spanning items
                    }}>
                        {projects.map((project, index) => (
                            <ProjectCard key={index} index={index} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Portfolio;

