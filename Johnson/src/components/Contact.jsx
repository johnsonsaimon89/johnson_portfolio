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
        contact_title: "LET'S START\nSOMETHING\nGREAT",
        contact_description: "If you have an idea, project, or collaboration in mind, I’d love to hear about it. Whether you're looking to grow your social media presence or build a new website, feel free to reach out."
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
                message: '⚙️ Database not connected yet. Use WhatsApp to reach Johnson directly!'
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
        <section id="talk" className="section contact">
            <div className="container">
                <div className="contact-editorial-layout">
                    {/* Left Panel: Massive Typography & Clean Details */}
                    <div className="contact-editorial-left">
                        <span className="contact-label">{header.contact_badge}</span>
                        <h2 
                            className="contact-editorial-title"
                            dangerouslySetInnerHTML={{ __html: header.contact_title.replace(/\n/g, '<br/>').replace('GREAT', '<span style="color: var(--brand-accent)">GREAT</span>') }} 
                        />
                        <p className="contact-editorial-desc">
                            {header.contact_description}
                        </p>

                        <div className="contact-editorial-info">
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
                                <span>Chat Directly via WhatsApp →</span>
                            </a>
                            <div className="info-item">
                                <MapPin size={18} />
                                <span>{contact.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Clean Minimalist Form (No Glass) */}
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
                                        <option value="">Service Needed…</option>
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
                                    placeholder="Tell me about your project, goals, timeline, or budget… *"
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
