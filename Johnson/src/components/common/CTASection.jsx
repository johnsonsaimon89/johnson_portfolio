import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

/**
 * Generalized version of components/WebStudio/StudioCTA.jsx.
 * StudioCTA had its copy and links hardcoded to the web-design offer.
 * This version takes props so the exact same visual block can close
 * out ANY page (Profile, Social, Resources/Shop) with a message that
 * matches that page's offer, instead of every page either having no
 * closing CTA at all, or duplicating a slightly-different hardcoded block.
 *
 * Usage:
 * <CTASection
 *   title="Ready to grow your brand's presence?"
 *   subtitle="Let's build a content strategy that turns followers into customers."
 *   primaryLabel="Start a Project"
 *   primaryTo="/contact"
 *   secondaryLabel="Email Me"
 *   secondaryHref="mailto:hello@johnsonsaimon.com"
 * />
 */
const CTASection = ({
    title = 'Ready to work together?',
    subtitle = "Let's build something that stands out and helps you win more clients.",
    primaryLabel = 'Start a Project',
    primaryTo = '/contact',
    secondaryLabel = 'Email Me',
    secondaryHref = 'mailto:hello@johnsonsaimon.com',
}) => {
    return (
        <section className="studio-section" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', padding: 'var(--section-pad) 0' }}>
            <div className="container" style={{ width: '100%', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: 'var(--fs-h1)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                            {title}
                        </h2>
                        <p
                            className="lead"
                            style={{
                                color: 'var(--text-muted)',
                                maxWidth: '800px',
                                margin: '2.5rem auto 3.5rem auto',
                                fontSize: 'var(--fs-p1)',
                                lineHeight: 1.6,
                            }}
                        >
                            {subtitle}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                            <Link to={primaryTo} className="studio-btn studio-btn-primary" style={{ padding: '1rem 3rem' }}>
                                {primaryLabel} <ArrowRight size={20} />
                            </Link>
                            <a href={secondaryHref} className="studio-btn studio-btn-outline" style={{ padding: '1rem 3rem' }}>
                                {secondaryLabel} <Mail size={20} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
