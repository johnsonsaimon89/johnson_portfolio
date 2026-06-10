import React from 'react';
import { motion } from 'framer-motion';

const tools = [
    { name: 'Figma', category: 'Design', description: 'Crafting high-fidelity UI/UX and interactive prototypes.', color: '#F24E1E' },
    { name: 'Webflow', category: 'Development', description: 'Building custom, SEO-ready websites with seamless CMS.', color: '#4353FF' },
    { name: 'Squarespace', category: 'Platforms', description: 'Designing clean, visually-driven sites for modern brands.', color: '#000000' },
    { name: 'Framer', category: 'Interactive', description: 'Creating immersive, high-performance web animations.', color: '#0055FF' },
    { name: 'React', category: 'Architecture', description: 'Launching robust, scalable web applications with Vite.', color: '#61DAFB' },
    { name: 'Tailwind CSS', category: 'Styling', description: 'Implementing precise, responsive utility-first design.', color: '#06B6D4' }
];

const ToolsDashboard = () => {
    return (
        <section className="studio-section">
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <span className="badge">Workflow</span>
                    <h2 style={{ fontSize: 'var(--fs-h2)' }}>The Toolkit</h2>
                    <p style={{ color: 'var(--muted-color)', maxWidth: '600px', margin: '1rem auto' }}>
                        I use industry-standard software to ensure every project is fast, responsive, and easy to manage.
                    </p>
                </div>

                <div className="process-grid">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={index}
                            className="process-card"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <span style={{ color: 'var(--brand-accent)', fontWeight: 700, fontSize: 'var(--fs-p2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                {tool.category}
                            </span>
                            <h4 style={{ margin: '1.5rem 0 0.5rem 0' }}>{tool.name}</h4>
                            <p style={{ fontSize: 'var(--fs-p2)', marginBottom: 0 }}>{tool.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ToolsDashboard;
