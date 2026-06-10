import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import emailService from '../../lib/emailService';

const EmbeddableSignup = ({ source = "website_embed", showLabels = false, buttonText = "Count me in" }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setStatus('error');
            setMessage('Email is required.');
            return;
        }

        setStatus('loading');

        try {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert([{
                    email: email,
                    name: name || null,
                    source: source
                }]);

            if (error) {
                if (error.code === '23505') {
                    throw new Error("You're already subscribed!");
                }
                throw error;
            }

            // Welcome email is now handled automatically by database trigger notify_send_email()
            // on the newsletter_subscribers table. This ensures only one email is sent.

            setStatus('success');
            setMessage("Thanks for joining! I’ll see you in your inbox.");
            setEmail('');
            setName('');

        } catch (err) {
            setStatus('error');
            setMessage(err.message || 'Something went wrong.');
        }
    };

    if (status === 'success') {
        return (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.2)' }}>
                <p style={{ margin: 0, fontWeight: 500 }}>{message}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {showLabels && <label style={{ fontSize: 'var(--fs-p2)', color: '#f3f4f6' }}>Name (Optional)</label>}
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="What's your name?"
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '100px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        outline: 'none',
                        fontSize: 'var(--fs-p2)'
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {showLabels && <label style={{ fontSize: 'var(--fs-p2)', color: '#f3f4f6' }}>Email *</label>}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your best email"
                    required
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '100px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        outline: 'none',
                        fontSize: 'var(--fs-p2)'
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '100px',
                    border: 'none',
                    background: 'var(--brand-accent, #BDFF00)',
                    color: '#030303',
                    fontWeight: 600,
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    opacity: status === 'loading' ? 0.7 : 1,
                    transition: 'opacity 0.2s',
                    marginTop: '0.5rem'
                }}
            >
                {status === 'loading' ? 'Subscribing...' : buttonText}
            </button>

            {status === 'error' && (
                <p style={{ color: '#ff6584', fontSize: 'var(--fs-p2)', margin: 0, textAlign: 'center' }}>
                    {message}
                </p>
            )}
        </form>
    );
};

export default EmbeddableSignup;
