import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const valueProps = [
    "Modern, visually engaging, and premium interfaces.",
    "Responsive layouts that adapt flawlessly to any screen size.",
    "Clear digital storytelling and structured hierarchies.",
    "A polished brand identity translated into UI components.",
    "Engineered to convert passive visitors into active clients."
];

const ValueProp = () => {
    return (
        <section className="section">
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 >
                            What You Get When <br />
                            <span style={{ color: 'var(--accent-lime)' }}>Working With Me</span>
                        </h2>
                        <p className="lead" style={{ color: 'var(--muted-color)', }}>
                            I don't just hand over a template. I deliver a comprehensively structured digital asset designed specifically for your brand's growth and audience engagement.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '3rem' }}
                    >
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {valueProps.map((prop, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                                >
                                    <CheckCircle2 color="var(--accent-lime)" size={24} style={{ flexShrink: 0 }} />
                                    <span >{prop}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ValueProp;
