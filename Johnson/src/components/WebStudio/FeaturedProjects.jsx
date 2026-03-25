import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { webData } from '../../data/webData';
import MiniBrowser from '../common/MiniBrowser';

const FeaturedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from('case_studies')
                .select('*')
                .eq('type', 'web')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (!error && data) {
                const formattedProjects = data.map(study => {
                    const content = study.content || {};
                    const coreMetrics = content.metrics || {};
                    const customMetrics = content.custom_metrics || [];
                    
                    // Combine core metrics and custom metrics into a single array
                    // Ensure core metrics are only included if they have values
                    const allMetrics = [
                        coreMetrics.visitors ? { label: 'VISITORS', value: coreMetrics.visitors } : null,
                        coreMetrics.sales ? { label: 'SALES', value: coreMetrics.sales } : null,
                        coreMetrics.signups ? { label: 'SIGNUPS', value: coreMetrics.signups } : null,
                        ...customMetrics.map(m => m.label && m.value ? { label: m.label.toUpperCase(), value: m.value } : null)
                    ].filter(Boolean); // Only keep non-null metrics

                    return {
                        id: study.id,
                        client: study.organization_name,
                        industry: study.organization_type,
                        websiteUrl: content.website_url || '',
                        previewImageUrl: content.preview_image_url || '',
                        paragraphs: content.paragraphs || [],
                        displayMetrics: allMetrics,
                        colors: content.colors || ['#6366f1', '#1e293b', '#f8fafc'],
                        tools: content.tool_stack ? content.tool_stack.split(',').map(t => t.trim()) : []
                    };
                });
                setProjects(formattedProjects);
            }
            setLoading(false);
        };
        fetchProjects();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) return <div className="admin-loading">Loading projects...</div>;

    return (
        <section id="projects" className="studio-section">
            <div className="container">
                <div style={{ textAlign: 'left', marginBottom: '8rem' }}>
                    <span className="badge">Featured Case Studies</span>
                    <h2 style={{ fontSize: 'var(--fs-h1)', fontWeight: 900, letterSpacing: '-0.04em' }}>Digital Platforms that Scale.</h2>
                    <p className="lead" style={{ color: 'var(--muted-color)', maxWidth: '600px', margin: '1rem 0' }}>
                        High-performance solutions designed for clear brand presentation and sustainable growth.
                    </p>
                </div>

                <div className="project-card-grid" style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
                    {projects.map((project, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className={`web-project-card ${isMobile ? 'mobile-order' : ''}`}
                                style={{ 
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : 'minmax(300px, 1fr) minmax(300px, 1.2fr)',
                                    gap: isMobile ? '2rem' : '4rem',
                                    alignItems: 'center',
                                    direction: (!isMobile && !isEven) ? 'rtl' : 'ltr'
                                }}
                            >
                                {/* Content Side (Explanation) */}
                                <div className="web-content-area" style={{ direction: 'ltr', textAlign: 'left' }}>
                                    <span className="project-tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                                        {project.industry}
                                    </span>
                                    <h3 className="project-title" style={{ fontSize: 'var(--fs-h3)', fontWeight: 800, marginBottom: '2rem' }}>{project.client}</h3>
                                    
                                    <div className="project-description" style={{ marginBottom: isMobile ? '1.5rem' : '2.5rem' }}>
                                        {project.paragraphs?.slice(0, 3).map((p, i) => (
                                            <p key={i} style={{ fontSize: 'var(--fs-p2)', lineHeight: 1.6, color: 'var(--muted-color)', marginBottom: '1rem' }}>
                                                {p}
                                            </p>
                                        ))}
                                    </div>

                                    {/* Mobile Mockup - Repositioned before metrics */}
                                    {isMobile && (
                                        <div className="web-visual-area" style={{ direction: 'ltr', marginBottom: '3rem' }}>
                                            <div className="mockup-container" style={{ position: 'relative' }}>
                                                <MiniBrowser 
                                                    type="mobile"
                                                    url={project.websiteUrl}
                                                    previewImage={project.previewImageUrl}
                                                    clientName={project.client}
                                                    colors={project.colors}
                                                />
                                                {/* Mobile Color Palette */}
                                                <div style={{ 
                                                    position: 'absolute', 
                                                    bottom: '20px', 
                                                    right: '20px',
                                                    background: 'rgba(10,10,10,0.8)',
                                                    backdropFilter: 'blur(10px)',
                                                    padding: '8px 12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    display: 'flex',
                                                    gap: '6px',
                                                    zIndex: 100
                                                }}>
                                                    {project.colors.map((color, cIdx) => (
                                                        <div key={cIdx} style={{ background: color, width: '16px', height: '16px', borderRadius: '3px' }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Metrics Row */}
                                    {project.displayMetrics && project.displayMetrics.length > 0 && (
                                        <div className="project-results-wrapper" style={{ margin: '2rem 0', gridColumn: 'auto' }}>
                                            <div style={{ 
                                                display: 'grid', 
                                                gridTemplateColumns: `repeat(${Math.min(project.displayMetrics.length, 3)}, 1fr)`, 
                                                gap: '1rem' 
                                            }}>
                                                {project.displayMetrics.slice(0, 3).map((metric, mIdx) => (
                                                    <div key={mIdx} className="result-stat" style={{ padding: '1rem', background: 'var(--brand-accent)', border: '1px solid var(--brand-accent)' }}>
                                                        <span className="result-val" style={{ fontSize: '1.4rem', color: '#000' }}>{metric.value}</span>
                                                        <span className="result-label" style={{ fontSize: '0.65rem', opacity: 0.8, color: '#000', fontWeight: 700 }}>{metric.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Toolstack */}
                                    <div className="project-toolstack">
                                        <div style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            TOOLSTACK: <span style={{ color: '#fff' }}>{project.tools.join(' + ')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Visual Side - Only for Desktop */}
                                {!isMobile && (
                                    <div className="web-visual-area" style={{ direction: 'ltr' }}>
                                        <div className="mockup-container" style={{ position: 'relative' }}>
                                            <MiniBrowser 
                                                type="desktop"
                                                url={project.websiteUrl}
                                                previewImage={project.previewImageUrl}
                                                clientName={project.client}
                                                colors={project.colors}
                                            />
                                            
                                            <div style={{ 
                                                position: 'absolute', 
                                                bottom: '30px', 
                                                right: isEven ? '30px' : 'auto',
                                                left: isEven ? 'auto' : '30px',
                                                background: 'rgba(10,10,10,0.8)',
                                                backdropFilter: 'blur(10px)',
                                                padding: '12px 18px',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                display: 'flex',
                                                gap: '10px',
                                                zIndex: 100,
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                            }}>
                                                {project.colors.map((color, cIdx) => (
                                                    <div key={cIdx} style={{ background: color, width: '24px', height: '24px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProjects;
