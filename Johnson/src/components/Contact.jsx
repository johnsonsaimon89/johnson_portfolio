import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Phone, ArrowRight, Loader2, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { supabase, isSupabaseReady } from '../lib/supabaseClient';
import emailService from '../lib/emailService';
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

const SERVICES = [
    'Communication Strategy',
    'Website Design & Management',
    'Strategic Social Media',
    'Email Marketing',
    'Brand Messaging',
    'Multi-platform Content Creation',
    'Online Community Management',
    'Other / Not Sure Yet',
];

const Contact = () => {
    const { contact } = portfolioData;
    const [header] = useState({
        contact_badge: 'Talk',
        contact_title: "LET'S START SOMETHING GREAT",
        contact_description: "If you have an idea, project, or collaboration in mind, I’d love to hear about it. Whether you're looking to grow your social media presence or build a new website, feel free to reach out and start a conversation."
    });

    // Removed dynamic fetching to restore hardcoded text

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        honeypot: '', // invisible spam trap
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

        // Spam trap — if honeypot is filled, silently reject
        if (form.honeypot) return;

        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        setToast(null);

        // Graceful fallback when Supabase credentials aren't configured yet
        if (!isSupabaseReady) {
            setLoading(false);
            setToast({
                type: 'error',
                message: '⚙️ Database not connected yet. Use WhatsApp to reach Johnson directly!'
            });
            return;
        }

        try {
            let fullMessage = form.message.trim();
            if (form.phone.trim()) {
                fullMessage += `\n\nPhone/WhatsApp: ${form.phone.trim()}`;
            }

            // Also include honeypot check again just to be safe
            if (form.honeypot) return;

            const { error } = await supabase.from('messages').insert([{
                name: form.name.trim(),
                email: form.email.trim(),
                subject: form.service || 'General Inquiry',
                message: fullMessage
            }]);

            if (error) throw error;

            // Email notifications are now handled by database triggers (auto-reply + admin alert)
            // to prevent duplicates and improve sender reputation.

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

    const inputStyle = {
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--glass-border)',
        padding: '1rem 0',
        color: 'white',
        outline: 'none',
        width: '100%',
        fontSize: '1rem',
        transition: 'border-color 0.2s',
    };

    return (
        <section id="talk" className="section contact">
            <div className="container">
                <div className="contact-grid">
                    {/* Left panel — contact info */}
                    <div className="contact-info-panel">
                        <span className="contact-label">{header.contact_badge}</span>
                        <h2 style={{ marginTop: '2rem' }} dangerouslySetInnerHTML={{ __html: header.contact_title.replace('GREAT', '<span style="color: var(--brand-accent)">GREAT</span>') }} />
                        <p style={{ color: 'var(--muted-color)', marginTop: '1.5rem', lineHeight: 1.7 }}>
                            {header.contact_description}
                        </p>

                        <div className="contact-details">
                            <a href={`mailto:${contact.email}`} className="contact-detail-item">
                                <div className="glass contact-icon"><Mail size={20} /></div>
                                <div>
                                    <p style={{ color: 'var(--muted-color)', fontSize: '0.85rem' }}>Email</p>
                                    <p style={{ fontWeight: 600 }}>{contact.email}</p>
                                </div>
                            </a>

                            <a href={`tel:${contact.phone}`} className="contact-detail-item">
                                <div className="glass contact-icon"><Phone size={20} /></div>
                                <div>
                                    <p style={{ color: 'var(--muted-color)', fontSize: '0.85rem' }}>Call / WhatsApp</p>
                                    <p style={{ fontWeight: 600 }}>{contact.phone}</p>
                                </div>
                            </a>

                            <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-detail-item contact-wa-item">
                                <div className="glass contact-icon contact-icon--wa"><MessageCircle size={20} /></div>
                                <div>
                                    <p style={{ color: 'var(--muted-color)', fontSize: '0.85rem' }}>WhatsApp</p>
                                    <p style={{ fontWeight: 600 }}>Chat Directly →</p>
                                </div>
                            </a>

                            <div className="contact-detail-item">
                                <div className="glass contact-icon"><MapPin size={20} /></div>
                                <div>
                                    <p style={{ color: 'var(--muted-color)', fontSize: '0.85rem' }}>Location</p>
                                    <p style={{ fontWeight: 600 }}>{contact.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right panel — form */}
                    <div className="glass contact-form-panel">
                        <form onSubmit={handleSubmit} noValidate>
                            {/* Honeypot — hidden from humans, visible to bots */}
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
                                    <label className="form-label">Full Name <span className="form-required">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        style={inputStyle}
                                        className={errors.name ? 'input-error' : ''}
                                    />
                                    {errors.name && <span className="form-error">{errors.name}</span>}
                                </div>

                                <div className="form-field">
                                    <label className="form-label">Email Address <span className="form-required">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        style={inputStyle}
                                        className={errors.email ? 'input-error' : ''}
                                    />
                                    {errors.email && <span className="form-error">{errors.email}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label className="form-label">Phone / WhatsApp</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="+255 700 000 000"
                                        style={inputStyle}
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="form-label">Service Needed</label>
                                    <select
                                        name="service"
                                        value={form.service}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">Select a service…</option>
                                        {SERVICES.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Your Message <span className="form-required">*</span></label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Tell me about your project, goals, timeline, or budget…"
                                    style={{ ...inputStyle, resize: 'none' }}
                                    className={errors.message ? 'input-error' : ''}
                                />
                                {errors.message && <span className="form-error">{errors.message}</span>}
                            </div>

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
                        </form>
                    </div>
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
    );
};

export default Contact;
