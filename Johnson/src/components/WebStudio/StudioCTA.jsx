import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

const StudioCTA = () => {
    return (
        <section className="studio-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', paddingBottom: '12rem' }}>
            <div className="container" style={{ width: '100%', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: 'var(--fs-h1)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                            Ready to build a website that grows with you?
                        </h2>
                        <p className="lead" style={{ 
                            color: 'var(--muted-color)', 
                            maxWidth: '600px', 
                            margin: '2.5rem auto 3.5rem auto',
                            fontSize: 'var(--fs-p1)',
                            lineHeight: 1.6 
                        }}>
                            Let's build a digital asset that stands out, tells your story, and helps you win more clients.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                            <a href="#contact" className="studio-btn studio-btn-primary" style={{ padding: '1rem 3rem' }}>
                                Start a Project <ArrowRight size={20} />
                            </a>
                            <a href="mailto:johnsonsaimon89@gmail.com" className="studio-btn studio-btn-outline" style={{ padding: '1rem 3rem' }}>
                                Email Me <Mail size={20} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default StudioCTA;
