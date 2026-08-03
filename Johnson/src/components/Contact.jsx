import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Phone, ArrowRight, Loader2, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { supabase, isSupabaseReady } from '../lib/supabaseClient';
import './Contact.css';

const Toast = ({ type, message, onClose }) => (
    <AnimatePresence>
        <motion.div
            className={`contact-toast contact-toast--${type}`}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span>{message}</span>
            {type === 'error' && (
                <a href={portfolioData.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="toast-wa-link">
                    Try WhatsApp instead →
                </a>
            )}
            <button onClick={onClose} className="toast-close">✕</button>
        </motion.div>
    </AnimatePresence>
);

const maskUp = {
    hidden: { y: '110%', opacity: 0 },
    show: (delay = 0) => ({
        y: '0%', opacity: 1,
        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay },
    }),
};

const fadeIn = {
    hidden: { opacity: 0, y: 15 },
    show: (delay = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
    }),
};

const SERVICES = [
    'Communication Strategy',
    'Website / Digital Experience',
    'Content & Storytelling',
    'Brand Development',
    'Something Else'
];

const Contact = () => {
    const { contact } = portfolioData;
    const [header] = useState({
        contact_badge: 'Talk',
        contact_title: "HAVE AN IDEA\nWORTH\nSHARING?",
        contact_description: "Tell me what you're building, what challenge you're facing, or what idea you want to bring to life. We'll explore the best way to communicate it clearly and connect with the people who matter."
    });

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        honeypot: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Your name is required.';
        if (!form.email.trim()) {
            errs.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errs.email = 'Please enter a valid email address.';
        }
        if (!form.message.trim()) errs.message = 'Please tell Johnson about your project.';
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.honeypot) return;

        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        setToast(null);

        if (!isSupabaseReady) {
            setLoading(false);
            setToast({
                type: 'error',
                message: ' Database not connected yet. Use WhatsApp to reach Johnson directly!'
            });
            return;
        }

        try {
            let fullMessage = form.message.trim();
            if (form.phone.trim()) {
                fullMessage += `\n\nPhone/WhatsApp: ${form.phone.trim()}`;
            }

            if (form.honeypot) return;

            const { error } = await supabase.from('messages').insert([{
                name: form.name.trim(),
                email: form.email.trim(),
                subject: form.service || 'General Inquiry',
                message: fullMessage
            }]);

            if (error) throw error;

            setToast({ type: 'success', message: "Message sent! Johnson will be in touch soon." });
            setForm({ name: '', email: '', phone: '', service: '', message: '', honeypot: '' });
            setErrors({});
        } catch (err) {
            console.error('Supabase submission error:', err);
            setToast({ type: 'error', message: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page-wrapper">
            {/* ══════════════════════════════════════
                HERO SECTION (Dark)
            ══════════════════════════════════════ */}
            <section style={{
                background: 'var(--text-color)',
                color: 'var(--text-light)',
                paddingTop: 'calc(var(--header-height) + clamp(2rem, 5vw, 4rem))',
                paddingBottom: 'clamp(4rem, 8vw, 7rem)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '800px' }}>

                        <div className="mask-parent" style={{ marginBottom: '1rem' }}>
                            <motion.h1
                                variants={maskUp} initial="hidden" animate="show" custom={0.1}
                                style={{
                                    fontSize: 'var(--fs-h1)',
                                    fontWeight: 900, lineHeight: 0.95,
                                    letterSpacing: '-0.05em',
                                    color: 'rgba(255,255,255,0.9)',
                                    textTransform: 'uppercase', margin: 0,
                                }}
                                dangerouslySetInnerHTML={{ __html: header.contact_title.replace(/\n/g, '<br/>').replace('SHARING?', '<span style="color: var(--brand-accent)">SHARING?</span>') }}
                            />
                        </div>
                        <motion.p
                            variants={fadeIn} initial="hidden" animate="show" custom={0.3}
                            style={{
                                color: '#ffffff', fontSize: 'var(--fs-p1)',
                                lineHeight: 1.65, maxWidth: '50ch', margin: '2rem 0 0',
                                fontWeight: 500,
                            }}
                        >
                            {header.contact_description}
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                CONTACT DETAILS & FORM
            ══════════════════════════════════════ */}
            <section className="section contact" style={{ background: 'var(--bg-color)', paddingTop: 'clamp(4rem, 8vw, 6rem)', paddingBottom: 'clamp(4rem, 8vw, 6rem)' }}>
                <div className="container">
                    <div className="contact-editorial-layout" style={{ gap: '4rem', alignItems: 'flex-start' }}>
                        
                        {/* Left Column: Direct Info */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 800, margin: '0 0 1rem', color: 'var(--text-color)' }}>
                                    Ready to start?
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '400px' }}>
                                    Fill out the form or reach out directly using the details below.
                                </p>
                            </div>
                            
                            <div className="contact-editorial-info" style={{ gap: '1.25rem' }}>
                                <a href={`mailto:${contact.email}`} className="info-item">
                                    <Mail size={18} />
                                    <span>{contact.email}</span>
                                </a>
                                <a href={`tel:${contact.phone}`} className="info-item">
                                    <Phone size={18} />
                                    <span>{contact.phone}</span>
                                </a>
                                <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="info-item info-item--wa">
                                    <MessageCircle size={18} />
                                    <span>Message me on WhatsApp →</span>
                                </a>
                                <div className="info-item">
                                    <MapPin size={18} />
                                    <span>{contact.address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="contact-editorial-right">
                            <form className="contact-minimal-form" onSubmit={handleSubmit} noValidate>
                                <input
                                    type="text"
                                    name="honeypot"
                                    value={form.honeypot}
                                    onChange={handleChange}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                    style={{ display: 'none' }}
                                />

                                <div className="form-row">
                                    <div className="form-field">
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Full Name *"
                                            className={`minimal-input ${errors.name ? 'input-error' : ''}`}
                                        />
                                        {errors.name && <span className="form-error">{errors.name}</span>}
                                    </div>

                                    <div className="form-field">
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="Email Address *"
                                            className={`minimal-input ${errors.email ? 'input-error' : ''}`}
                                        />
                                        {errors.email && <span className="form-error">{errors.email}</span>}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-field">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="Phone / WhatsApp"
                                            className="minimal-input"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <select
                                            name="service"
                                            value={form.service}
                                            onChange={handleChange}
                                            className="minimal-select"
                                        >
                                            <option value="">What can I help you with?</option>
                                            {SERVICES.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-field form-field-full">
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Tell me about your idea, challenge, or what you are trying to achieve. *"
                                        className={`minimal-input minimal-textarea ${errors.message ? 'input-error' : ''}`}
                                    />
                                    {errors.message && <span className="form-error">{errors.message}</span>}
                                </div>

                                <div className="form-submit-container">
                                    <motion.button
                                        type="submit"
                                        className="btn-primary contact-submit-btn"
                                        whileHover={{ scale: loading ? 1 : 1.02 }}
                                        whileTap={{ scale: loading ? 1 : 0.98 }}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <><Loader2 size={20} className="spin" /> Sending…</>
                                        ) : (
                                            <>Send Message <ArrowRight size={20} /></>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </section>

            {/* ══════════════════════════════════════
                WHAT HAPPENS NEXT (Light Section)
            ══════════════════════════════════════ */}
            <section className="section section-light" style={{ background: 'var(--bg-color)', paddingTop: 'clamp(3rem, 6vw, 4rem)', paddingBottom: 'clamp(4rem, 8vw, 8rem)' }}>
                <div className="container">
                    <div style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-color)' }}>
                            What happens next?
                        </h2>
                    </div>
                    
                    <div className="journey-grid">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                            style={{
                                background: 'var(--text-color)',
                                borderRadius: '16px',
                                padding: '2rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--text-light)',
                                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>01 — We Talk</h5>
                            <p style={{ fontSize: '0.95rem', color: '#ffffff', margin: 0, lineHeight: 1.6 }}>A short conversation to understand your goals and challenges.</p>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                            style={{
                                background: 'var(--text-color)',
                                borderRadius: '16px',
                                padding: '2rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--text-light)',
                                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>02 — We Find Direction</h5>
                            <p style={{ fontSize: '0.95rem', color: '#ffffff', margin: 0, lineHeight: 1.6 }}>Together we identify the right strategy, approach, and next steps.</p>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                            style={{
                                background: 'var(--text-color)',
                                borderRadius: '16px',
                                padding: '2rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--text-light)',
                                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>03 — We Build</h5>
                            <p style={{ fontSize: '0.95rem', color: '#ffffff', margin: 0, lineHeight: 1.6 }}>We bring the idea to life through communication, design, and digital experiences.</p>
                        </motion.div>
                    </div>
                </div>
                {/* Toast notification */}
                {toast && (
                    <Toast
                        type={toast.type}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                )}
            </section>
        </div>
    );
};

export default Contact;
