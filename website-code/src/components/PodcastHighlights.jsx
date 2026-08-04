import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowUpRight } from 'lucide-react';

/*
 * NEW COMPONENT — the podcast currently exists only as a link in the
 * social icons row (portfolioData.socials). That buries a genuine
 * credibility asset. Drop this into ProfilePage.jsx (see plan) to give
 * it a real section instead.
 *
 * Replace the placeholder `episodes` array with your real 3-4 strongest
 * episodes. Long-term, this should move to its own Supabase table
 * (e.g. `podcast_episodes`) managed from the admin dashboard, the same
 * way blog_posts / case_studies already work — but static data is a
 * fine starting point so this ships today.
 */

const episodes = [
    {
        title: 'Episode title goes here',
        topic: 'Education & social issues',
        url: 'https://open.spotify.com/show/0Ghl6V0nj4yu9keKYABxpt',
    },
    {
        title: 'Episode title goes here',
        topic: 'Community & personal growth',
        url: 'https://open.spotify.com/show/0Ghl6V0nj4yu9keKYABxpt',
    },
    {
        title: 'Episode title goes here',
        topic: 'Storytelling & brand voice',
        url: 'https://open.spotify.com/show/0Ghl6V0nj4yu9keKYABxpt',
    },
];

const PodcastHighlights = () => {
    return (
        <section className="studio-section" style={{ padding: '6rem 0' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <span className="badge">Ulumbi Podcast</span>
                    <h2 style={{ fontSize: 'var(--fs-h2)', marginTop: '1rem' }}>
                        Founder & Host — Conversations on Education, Society, and Growth
                    </h2>
                    <p style={{ color: 'var(--muted-color)', maxWidth: '620px', marginTop: '1rem' }}>
                        Since 2022 I've hosted long-form conversations that turn social issues into
                        stories people act on. A few starting points:
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                    {episodes.map((ep, idx) => (
                        <motion.a
                            key={idx}
                            href={ep.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -6 }}
                            transition={{ delay: idx * 0.08 }}
                            style={{
                                display: 'block',
                                padding: '1.75rem',
                                borderRadius: '20px',
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            <div
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    background: 'rgba(189,255,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.25rem',
                                }}
                            >
                                <Play size={18} color="var(--brand-accent)" />
                            </div>
                            <span style={{ fontSize: 'var(--fs-p2)', color: 'var(--brand-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {ep.topic}
                            </span>
                            <h4 style={{ margin: '0.6rem 0 0' }}>{ep.title}</h4>
                        </motion.a>
                    ))}
                </div>

                <a
                    href="https://open.spotify.com/show/0Ghl6V0nj4yu9keKYABxpt"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem', color: 'var(--brand-accent)', fontWeight: 700 }}
                >
                    Listen to all episodes on Spotify <ArrowUpRight size={16} />
                </a>
            </div>
        </section>
    );
};

export default PodcastHighlights;
