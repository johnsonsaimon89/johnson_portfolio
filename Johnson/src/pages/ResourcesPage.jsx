import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Download, Play, ShoppingBag, CheckCircle, Smartphone, CreditCard, X, Loader2, Sparkles } from 'lucide-react';
import { supabase, isSupabaseReady } from '../lib/supabaseClient';
import emailService from '../lib/emailService';
import { productsData } from '../data/productsData';
import { formatPrice } from '../utils/currencyUtils';
import '../styles/StudioStyles.css'; // Shared studio styles
import './ResourcesPage.css';

/* ── Product Card ───────────────────────────────────── */
const ProductCard = ({ product, isFree, onClick, className }) => {
    const isOnSale = product.is_on_sale && product.sale_price_tzs < product.price_tzs;
    const displayPrice = isOnSale ? product.sale_price_tzs : product.price_tzs;

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            style={{
                display: 'flex', flexDirection: 'column', position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                border: '1px solid rgba(255,255,255,0.08)',
                minHeight: '360px',
                background: product.image_url ? '#000' : 'linear-gradient(135deg, #1A1B2E 0%, #2a1b3d 100%)',
                cursor: 'pointer'
            }}
            onClick={() => onClick(product, isFree)}
        >
            {/* Background Image */}
            {product.image_url && (
                <img 
                    src={product.image_url} 
                    alt={product.title} 
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                        transition: 'transform 0.5s ease',
                    }}
                />
            )}

            {/* Gradient Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.95) 100%)',
                zIndex: 1,
                pointerEvents: 'none'
            }} />

            {/* Top Badges (Sale / Black Friday) */}
            <div style={{ position: 'absolute', top: '1.2rem', left: '1.2rem', right: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', zIndex: 2, pointerEvents: 'none' }}>
                {isOnSale && (
                    <div style={{
                        background: '#ff0000', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '4px',
                        fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
                        boxShadow: '0 4px 12px rgba(255,0,0,0.4)',
                    }}>
                        {product.sale_label || 'SALE'}
                    </div>
                )}
                {product.sale_event && (
                    <div style={{
                        background: '#00ff00', color: '#000', padding: '0.3rem 0.6rem', borderRadius: '4px',
                        fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
                        boxShadow: '0 4px 12px rgba(0,255,0,0.3)',
                        display: 'flex', alignItems: 'center', gap: '0.3rem'
                    }}>
                        <Sparkles size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} /> {product.sale_event}
                    </div>
                )}
            </div>

            {/* Content Box at the bottom */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                marginTop: 'auto',
                padding: '2rem 1.5rem 1.5rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                color: '#fff',
                pointerEvents: 'none'
            }}>
                {/* Free/Premium Badge */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
                    <span style={{ 
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '100px',
                        background: isFree ? 'rgba(0,255,100,0.2)' : 'rgba(255,215,0,0.2)',
                        color: isFree ? '#00ff66' : '#FFD700',
                        border: `1px solid ${isFree ? 'rgba(0,255,100,0.4)' : 'rgba(255,215,0,0.4)'}`
                    }}>
                        {isFree ? 'Free Asset' : 'Premium'}
                    </span>
                    <span style={{ 
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '100px',
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        {product.type}
                    </span>
                </div>

                <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', lineHeight: 1.2 }}>
                    {product.title}
                </h3>
                
                <p style={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    fontSize: '0.9rem', 
                    marginBottom: '1.2rem', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    lineHeight: 1.5
                }}>
                    {product.description}
                </p>

                {/* Price Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>
                            {formatPrice(displayPrice)}
                        </span>
                        {isOnSale && (
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textDecoration: 'line-through' }}>
                                {formatPrice(product.price_tzs)}
                            </span>
                        )}
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                        {product.sales_count || (isFree ? `${product.downloads} downloads` : product.salesCount)}
                    </span>
                </div>

                {/* CTA Button */}
                <div
                    style={{ 
                        width: '100%', 
                        padding: '0.8rem', 
                        borderRadius: '100px', 
                        background: isFree ? 'rgba(255,255,255,0.1)' : 'var(--brand-accent)',
                        color: isFree ? '#fff' : '#000',
                        fontWeight: 700,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backdropFilter: isFree ? 'blur(10px)' : 'none',
                        border: isFree ? '1px solid rgba(255,255,255,0.2)' : 'none',
                        pointerEvents: 'auto'
                    }}
                >
                    {isFree ? <><Download size={16} /> Download Free</> : <><ShoppingBag size={16} /> Buy Now</>}
                </div>
            </div>
        </motion.div>
    );
};

/* ── Payment Modal ──────────────────────────────────── */
const PaymentModal = ({ product, isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [settings, setSettings] = useState({ bankName: 'NBC', bankAcc: '', lipa: '' });
    const [selectedMethod, setSelectedMethod] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            if (!supabase) return;
            const { data } = await supabase.from('site_settings').select('payment_bank_name, payment_bank_account, payment_lipa_number').eq('id', 1).single();
            if (data) {
                setSettings({
                    bankName: data.payment_bank_name || 'NBC',
                    bankAcc: data.payment_bank_account || '',
                    lipa: data.payment_lipa_number || ''
                });
            }
        };
        if (isOpen) {
            setStep(1);
            setError('');
            setLoading(false);
            fetchSettings();
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'grid', placeItems: 'center', padding: '1rem' }}
            >
                <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

                <motion.div
                    className="hide-scrollbar"
                    initial={{ y: 50, scale: 0.95 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 20, scale: 0.95 }}
                    onClick={e => e.stopPropagation()}
                    style={{ 
                        background: 'var(--text-color)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '24px', 
                        width: '100%', 
                        maxWidth: '500px', 
                        padding: '2.5rem', 
                        position: 'relative', 
                        maxHeight: '90vh', 
                        overflowY: 'auto',
                        boxShadow: '0 40px 80px rgba(15,23,42,0.6)'
                    }}
                >
                    <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                        <X size={24} />
                    </button>

                    {step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <span style={{ color: 'var(--brand-accent)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Step 1: Choose Payment Method</span>
                            <h2 style={{ margin: 0, color: '#fff', fontSize: '1.8rem', lineHeight: 1.2 }}>{product.title}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#fff' }}>{formatPrice(product.is_on_sale ? product.sale_price_tzs : product.price_tzs)}</div>
                                {product.is_on_sale && <div style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>{formatPrice(product.price_tzs)}</div>}
                            </div>

                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <button
                                    onClick={() => { setSelectedMethod('Bank'); setStep(2); }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}
                                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'var(--brand-accent)'; }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                >
                                    <CreditCard size={20} color="var(--brand-accent)" />
                                    <span style={{ flex: 1, fontWeight: 600 }}>Bank Payment ({settings.bankName})</span>
                                </button>
                                <button
                                    onClick={() => { setSelectedMethod('Lipa'); setStep(2); }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}
                                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'var(--brand-accent)'; }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                >
                                    <Smartphone size={20} color="var(--brand-accent)" />
                                    <span style={{ flex: 1, fontWeight: 600 }}>Lipa Number / Mobile Money</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <span style={{ color: 'var(--brand-accent)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem' }}>Step 2: Confirm & Receive</span>
                            <h2 style={{ margin: 0, color: '#fff' }}>Payment Instructions</h2>
                            
                             <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                                <p style={{ margin: '0 0 1rem 0', color: 'rgba(255,255,255,0.8)' }}>Please send <strong>{formatPrice(product.is_on_sale ? product.sale_price_tzs : product.price_tzs)}</strong> using <strong>{selectedMethod === 'Bank' ? 'Bank Transfer' : 'Mobile Payment'}</strong> to:</p>
                                <div style={{ fontWeight: 800, textAlign: 'center', letterSpacing: '2px', color: 'var(--brand-accent)', fontSize: '1.5rem' }}>
                                    {selectedMethod === 'Bank' ? settings.bankAcc : settings.lipa}
                                </div>
                                {selectedMethod === 'Bank' && <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>Bank: {settings.bankName} | Name: JOHNSON SAIMON</div>}
                            </div>

                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{productsData.payment.microcopy.postPayment}</p>
                            
                            {error && <div style={{ color: '#ff4d4f', background: 'rgba(255,77,79,0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid rgba(255,77,79,0.3)' }}>{error}</div>}

                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={async (e) => {
                                e.preventDefault();
                                setError('');
                                const form = e.target;
                                const name = form.name.value;
                                const email = form.email.value;
                                const sender_name = form.sender_name.value;

                                if (!isSupabaseReady) {
                                    setError("Database not connected yet.");
                                    return;
                                }

                                setLoading(true);
                                try {
                                    console.log("Submitting order for product:", product);
                                    const { error } = await supabase.from('purchase_orders').insert([{
                                        product_id: product.id,
                                        product_title: product.title,
                                        product_type: 'digital',
                                        customer_name: name,
                                        customer_email: email,
                                        transaction_id: sender_name, // Mapping Sender's Name to transaction_id for now
                                        payment_method: selectedMethod === 'Bank' ? "NBC Bank" : "Lipa Number",
                                        amount_tzs: product.is_on_sale ? product.sale_price_tzs : product.price_tzs,
                                        status: 'pending',
                                        is_on_sale: product.is_on_sale || false,
                                        sale_event: product.sale_event || ''
                                    }]);
                                    if (error) {
                                        console.error("Supabase insert error:", error);
                                        throw error;
                                    }

                                    // Email notification is now handled via database trigger notify_send_email()
                                    // This prevents duplicate emails and improves deliverability reputation.

                                    setStep(3);
                                } catch (err) {
                                    console.error("Order error detail:", err);
                                    setError(`Failed to submit order: ${err.message || 'Unknown error'}`);
                                } finally {
                                    setLoading(false);
                                }
                            }}>
                                <input name="name" type="text" placeholder="Your Full Name" required style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--brand-accent)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
                                <input name="email" type="email" placeholder="Your Email (for product delivery)" required style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--brand-accent)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
                                <input name="sender_name" type="text" placeholder="Sender's Name (as it appears in payment)" required style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--brand-accent)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
                                <button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1, padding: '1rem', background: 'var(--brand-accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                                    {loading ? 'Confirming...' : 'Confirm Payment'}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', padding: '2rem 0' }}>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                <CheckCircle size={64} color="var(--brand-accent)" />
                            </motion.div>
                            <h2 style={{ margin: 0, color: '#fff' }}>Details Received</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                                We've received your details. Once verified, your resource will be sent immediately to your email.
                            </p>
                            
                            <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', textAlign: 'left', width: '100%' }}>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', margin: 0, display: 'flex', gap: '10px' }}>
                                    <span><strong>Check your Spam folder</strong> if you don't see our email within 10 minutes.</span>
                                </p>
                            </div>

                            <button onClick={onClose} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}>Close</button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const FreeDownloadModal = ({ product, isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (isOpen) {
            setLoading(false);
            setSuccess(false);
            setError('');
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;

        if (!isSupabaseReady) {
            setError("Database not connected yet.");
            return;
        }

        setLoading(true);
        try {
            await supabase.from('newsletter_subscribers').upsert({
                email,
                name,
                source: 'free_download'
            }, { onConflict: 'email' });

            await supabase.from('purchase_orders').insert([{
                product_id: product.id,
                product_title: product.title,
                product_type: 'free',
                customer_name: name,
                customer_email: email,
                amount_tzs: 0,
                status: 'confirmed',
                file_url: product.file_url || '',
                is_on_sale: product.is_on_sale || false,
                sale_event: product.sale_event || ''
            }]);

            // Email delivery is now handled via frontend emailService
            // Email delivery is now handled strictly via database triggers
            // to ensure reliability and avoid duplicates.
            
            setSuccess(true);
        } catch (err) {
            console.error("Free download error:", err);
            setError("Failed to process download.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'grid', placeItems: 'center', padding: '1rem' }}
            >
                <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />
                <motion.div
                    className="hide-scrollbar"
                    initial={{ y: 50, scale: 0.95 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 20, scale: 0.95 }}
                    onClick={e => e.stopPropagation()}
                    style={{ 
                        background: 'var(--text-color)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '24px', 
                        width: '100%', 
                        maxWidth: '400px', 
                        padding: '2.5rem', 
                        position: 'relative', 
                        maxHeight: '90vh', 
                        overflowY: 'auto',
                        boxShadow: '0 40px 80px rgba(15,23,42,0.6)'
                    }}
                >
                    <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                        <X size={24} />
                    </button>

                    {!success ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <span style={{ color: 'var(--brand-accent)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Free Download</span>
                            <h2 style={{ margin: 0, color: '#fff', fontSize: '1.8rem', lineHeight: 1.2 }}>{product.title}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Where should we send your download link?</p>

                            {error && <div style={{ color: '#ff4d4f', background: 'rgba(255,77,79,0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid rgba(255,77,79,0.3)' }}>{error}</div>}

                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
                                <input name="name" type="text" placeholder="Your Name" required style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--brand-accent)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
                                <input name="email" type="email" placeholder="Your Best Email" required style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--brand-accent)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
                                <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1, padding: '1rem', background: 'var(--brand-accent)', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', alignItems: 'center' }} onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                                    {loading ? <><Loader2 size={18} className="spin" style={{ marginRight: '0.5rem' }} /> Sending...</> : 'Get Free Resource'}
                                </button>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: 0 }}>
                                    You'll be added to my weekly newsletter. No spam.
                                </p>
                            </form>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', padding: '1rem 0' }}>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                <CheckCircle size={64} color="var(--brand-accent)" />
                            </motion.div>
                            <h2 style={{ margin: 0, color: '#fff' }}>On its way!</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                                Check your email inbox for the download link.
                            </p>
                            
                            <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', textAlign: 'left', width: '100%' }}>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', margin: 0, display: 'flex', gap: '10px' }}>
                                    <span><strong>Check your Spam folder</strong> and mark as "Not Spam" to ensure you get future updates.</span>
                                </p>
                            </div>

                            <button onClick={onClose} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}>Awesome, thanks!</button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ── Resources Page ─────────────────────────────────── */
const ResourcesPage = () => {
    const { pathname } = useLocation();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedFreeProduct, setSelectedFreeProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [btsSettings, setBtsSettings] = useState({
        badge: 'Behind The Scenes',
        title: 'How we build it.',
        description: 'Get exclusive access to our process videos, high-fidelity mockups, and early looks at upcoming products.',
        buttonText: 'Watch BTS Video',
        videoUrl: ''
    });

    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!isSupabaseReady) return;
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (error) throw error;

                let paid = [];
                let free = [];

                if (data) {
                    data.forEach(p => {
                        const downloadsCount = p.downloads_count || 0;
                        const salesCount = p.sales_count || 0;
                        
                        const formattedProduct = {
                            ...p,
                            downloads: downloadsCount,
                            salesCount: salesCount
                        };

                        if (p.price_tzs > 0) {
                            paid.push(formattedProduct);
                        } else {
                            free.push(formattedProduct);
                        }
                    });
                }

                // Interleave or just merge them into a single list
                const merged = [...paid, ...free];
                
                // Optional: Custom sorting to make sure a hero item is first
                merged.sort((a, b) => {
                    if (a.id === 'sm-masterclass') return -1;
                    if (b.id === 'sm-masterclass') return 1;
                    return 0;
                });

                // Assign real-life stock photos based on keywords in the title, 
                // so it works perfectly with your database items!
                const getStockPhotoForProduct = (title) => {
                    const t = title.toLowerCase();
                    if (t.includes('calendar') || t.includes('planner')) return 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800';
                    if (t.includes('masterclass') || t.includes('storytelling')) return 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800';
                    if (t.includes('ux') || t.includes('website') || t.includes('design')) return 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=800';
                    if (t.includes('voice') || t.includes('brand')) return 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800';
                    if (t.includes('idea') || t.includes('generator')) return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800';
                    
                    // Generic premium workspace fallback for any other database items
                    return 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800';
                };

                const mergedWithImages = merged.map(p => ({
                    ...p,
                    image_url: p.image_url || getStockPhotoForProduct(p.title) // Use DB image if exists, else dynamic stock
                }));

                setAllProducts(mergedWithImages);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchBtsSettings = async () => {
            if (!isSupabaseReady) return;
            const { data } = await supabase.from('site_settings').select('bts_badge, bts_title, bts_description, bts_button_text, bts_video_url').eq('id', 1).single();
            if (data) {
                setBtsSettings({
                    badge: data.bts_badge || 'Behind The Scenes',
                    title: data.bts_title || 'How we build it.',
                    description: data.bts_description || '',
                    buttonText: data.bts_button_text || 'Watch BTS Video',
                    videoUrl: data.bts_video_url || ''
                });
            }
        };

        fetchProducts();
        fetchBtsSettings();
    }, []);

    const handleClick = (product, isFree) => {
        if (!isFree) setSelectedProduct(product);
        else setSelectedFreeProduct(product);
    };

    if (loading) {
        return <div className="resources-page" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><Loader2 className="spin" size={32} color="#00f2fe" /></div>;
    }

    return (
        <div className="resources-page">


            {/* ══════════════════════════
                HERO, Brand Dark Aesthetic
            ══════════════════════════ */}
            <section style={{
                background: 'var(--text-color)',
                paddingTop: 'calc(var(--header-height) + clamp(3rem, 8vw, 6rem))',
                paddingBottom: 'clamp(4rem, 10vw, 8rem)',
                position: 'relative',
                overflow: 'hidden',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at 50% 0%, rgba(224, 90, 61, 0.08) 0%, transparent 60%)',
                    pointerEvents: 'none',
                }} />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ overflow: 'hidden', marginBottom: '0.1em' }}>
                        <motion.h1
                            initial={{ y: '110%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }}
                            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            style={{
                                fontSize: 'clamp(3rem, 6vw, 5rem)',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: 700, lineHeight: 0.95,
                                letterSpacing: '-0.02em',
                                color: '#fff',
                                margin: 0,
                            }}
                        >
                            Premium Tools
                        </motion.h1>
                    </div>
                    <div style={{ overflow: 'hidden', marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                        <motion.h1
                            initial={{ y: '110%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }}
                            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            style={{
                                fontSize: 'clamp(3rem, 6vw, 5rem)',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: 700, lineHeight: 0.95,
                                letterSpacing: '-0.02em',
                                color: 'var(--brand-accent)',
                                margin: 0,
                            }}
                        >
                            & Free Assets
                        </motion.h1>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '1.1rem', lineHeight: 1.65,
                            maxWidth: '40ch', margin: 0,
                        }}
                    >
                        Curated resources to help you build, design, and convert faster.
                    </motion.p>
                </div>
            </section>

            {/* Unified Showcase */}
            <section className="section" style={{ background: 'var(--bg-color)' }}>
                <div className="container">
                    <div style={{ marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}>
                        <div className="reveal-parent">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                                style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                            >
                                The Strategist's Toolkit
                            </motion.h2>
                        </div>
                    </div>
                    
                    <div className="spacious-grid">
                        {allProducts.length > 0 ? (
                            allProducts.map((product, index) => {
                                const isFree = product.price_tzs === 0 || product.priceTZS === 0;
                                
                                return (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        isFree={isFree} 
                                        onClick={handleClick} 
                                    />
                                );
                            })
                        ) : (
                            <div style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '5rem 2rem',
                                background: 'rgba(15,23,42,0.03)',
                                borderRadius: '24px',
                                border: '1px dashed rgba(15,23,42,0.15)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <ShoppingBag size={48} color="rgba(15,23,42,0.2)" />
                                <h3 style={{ color: '#0f172a', fontSize: '1.5rem', margin: 0, fontFamily: 'var(--font-heading)' }}>Check Back Soon</h3>
                                <p style={{ color: 'rgba(15,23,42,0.7)', maxWidth: '400px', margin: 0, lineHeight: 1.6 }}>
                                    There are no products at the moment. We are working on adding some amazing new resources soon!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>




            <PaymentModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
            <FreeDownloadModal product={selectedFreeProduct} isOpen={!!selectedFreeProduct} onClose={() => setSelectedFreeProduct(null)} />
        </div>
    );
};

export default ResourcesPage;
