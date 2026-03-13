import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import MagneticButton from './common/MagneticButton';
import { useScroll, useTransform } from 'framer-motion';

const Hero = ({ id }) => {
    const { hero } = portfolioData;
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

    // Split title into structural lines for massive layout
    const lines = [
        "DIGITAL",
        "EXPERIENCES THAT",
        "CONNECT, ENGAGE,",
        "AND CONVERT"
    ];

    const wordAnimation = {
        hidden: { y: "100%", opacity: 0 },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            transition: {
                ease: [0.16, 1, 0.3, 1], // cubic-bezier equivalent
                duration: 1,
                delay: i * 0.1
            }
        })
    };

    return (
        <section id={id} className="section hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '10rem' }}>
            <div className="container" style={{ width: '100%' }}>
                <div className="distributed-grid">

                    {/* Massive Typography Stack - Distributed Left/Center */}
                    <div className="col-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        {lines.map((line, index) => {
                            const isAccent = line.includes("DIGITAL");
                            return (
                                <div key={index} style={{ overflow: 'hidden', paddingBottom: '0.1em', marginTop: '-0.15em' }}>
                                    <motion.h1
                                        custom={index}
                                        variants={wordAnimation}
                                        initial="hidden"
                                        animate="visible"
                                        style={{
                                            fontWeight: 800,
                                            margin: 0,
                                            color: isAccent ? 'var(--brand-accent)' : '#ffffff',
                                            textTransform: 'uppercase',
                                            letterSpacing: '-0.04em',
                                            fontSize: 'var(--fs-h1)'
                                        }}
                                    >
                                        {line}
                                    </motion.h1>
                                </div>
                            );
                        })}
                    </div>

                    {/* Subtext and Actions - Distributed Right with offset */}
                    <div className="col-right stagger-bottom" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
                            className="text-max-width lead"
                            style={{
                                color: 'var(--muted-color)',
                            }}
                        >
                            {hero.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}
                        >
                            <MagneticButton strength={0.4}>
                                <a href="#projects" className="btn-primary">
                                    {hero.ctaPrimary} <ArrowUpRight size={20} />
                                </a>
                            </MagneticButton>
                            <MagneticButton strength={0.3}>
                                <a href="#solutions" className="btn-outline">
                                    {hero.ctaSecondary}
                                </a>
                            </MagneticButton>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Visual Placeholders */}
            <motion.div style={{ position: 'absolute', top: '10%', right: '5%', zIndex: -1, opacity: 0.1, y: y1 }}>
                <div style={{ width: '300px', height: '200px', border: '1px solid #fff', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }} title="Laptop Mockup Placeholder" />
                <div style={{ width: '150px', height: '250px', border: '1px solid #fff', borderRadius: '24px', marginLeft: 'auto', background: 'rgba(255,255,255,0.05)' }} title="Smartphone Mockup Placeholder" />
            </motion.div>

            <motion.div style={{ position: 'absolute', bottom: '15%', left: '5%', zIndex: -1, opacity: 0.1, y: y2 }}>
                <div style={{ width: '250px', height: '180px', border: '1px dotted #fff', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }} title="Minimal Dashboard Visual Placeholder" />
            </motion.div>

            {/* Subtle background shapes (no gradients, soft textures) */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    right: '5%',
                    top: '30%',
                    width: 'clamp(300px, 40vw, 600px)',
                    height: 'clamp(300px, 40vw, 600px)',
                    background: 'rgba(255, 255, 255, 0.02)', // Changed to subtle soft texture/shape per requirements
                    borderRadius: '50%',
                    zIndex: -1,
                    filter: 'blur(80px)',
                    pointerEvents: 'none'
                }}
            />
        </section>
    );
};

export default Hero;

