import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    { num: '01', title: 'Discovery & Strategy', desc: 'I start by understanding your brand, target audience, and business objectives. I define the user journey and site architecture to ensure everything aligns with your goals.' },
    { num: '02', title: 'UX & Wireframing', desc: 'I create structural blueprints that prioritize intuitive navigation. I focus on clear information hierarchy to make sure your message is easy to follow.' },
    { num: '03', title: 'Visual Design', desc: 'I apply your brand identity with modern typography and premium aesthetics. This is where I engineer the "wow" factor for your digital presence.' },
    { num: '04', title: 'Development', desc: 'I translate designs into clean, performant, and responsive code. I ensure fluid animations and fast load times across every device.' },
    { num: '05', title: 'Testing & Launch', desc: 'I perform rigorous quality checks across browsers. After final performance optimizations, I help you launch your platform to the world.' }
];

const ProcessTimeline = () => {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 1024);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section className="studio-section">
            <div className="container">
                <div style={{ textAlign: 'left', marginBottom: '8rem' }}>
                    <span className="badge">Methodology</span>
                    <h2 style={{ fontSize: 'var(--fs-h1)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1 }}>The Process</h2>
                    <p className="lead" style={{ color: 'var(--muted-color)', maxWidth: '540px', marginTop: '1.5rem', fontSize: '1.2rem', lineHeight: 1.6 }}>
                        A systematic approach to building websites that balance creativity with strategic conversion paths.
                    </p>
                </div>

                <div className="process-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(6, 1fr)', 
                    gap: '2rem' 
                }}>
                    {steps.map((step, index) => {
                        const isLastTwo = index >= 3;
                        return (
                            <motion.div
                                key={index}
                                className="process-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    gridColumn: isMobile ? 'auto' : (isLastTwo ? (index === 3 ? '2 / 4' : '4 / 6') : 'span 2')
                                }}
                            >
                                <div className="process-num">{step.num}</div>
                                <h4 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '1rem' }}>{step.title}</h4>
                                <p style={{ fontSize: 'var(--fs-p2)', color: 'var(--muted-color)', lineHeight: 1.6, margin: 0 }}>
                                    {step.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProcessTimeline;
