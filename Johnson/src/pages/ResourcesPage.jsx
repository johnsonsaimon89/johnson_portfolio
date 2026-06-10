import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Download, Play, ShoppingBag, CheckCircle, Smartphone, CreditCard, X, Loader2 } from 'lucide-react';
import { supabase, isSupabaseReady } from '../lib/supabaseClient';
import emailService from '../lib/emailService';
import { productsData } from '../data/productsData';
import { formatPrice } from '../utils/currencyUtils';
import '../styles/StudioStyles.css'; // Shared studio styles
import './ResourcesPage.css';

/* ── Product Card ───────────────────────────────────── */
const ProductCard = ({ product, isFree, onClick }) => {
    const isOnSale = product.is_on_sale && product.sale_price_tzs < product.price_tzs;
    const displayPrice = isOnSale ? product.sale_price_tzs : product.price_tzs;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="resource-card glass"
            style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}
        >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: isFree ? '#00f2fe' : 'var(--brand-accent)', borderRadius: '32px 32px 0 0' }} />

            {(isOnSale || product.sale_event) && (
                <div style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    display: 'flex',
                    gap: '0.5rem',
                    zIndex: 2,
                    pointerEvents: 'none'
                }}>
                    {isOnSale && (
                        <div style={{
                            background: '#ff0000', // RED for discount
                            color: '#fff',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '100px',
                            fontSize: 'var(--fs-p2)',
                            fontWeight: 800,
                            boxShadow: '0 4px 12px rgba(255,0,0,0.3)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            {product.sale_label || 'SALE'}
                        </div>
                    )}
                    {product.sale_event && (
                        <div style={{
                            background: '#00ff00', // GREEN for event
                            color: '#000', // BLACK text
                            padding: '0.4rem 0.8rem',
                            borderRadius: '100px',
                            fontSize: 'var(--fs-p2)',
                            fontWeight: 800,
                            boxShadow: '0 4px 12px rgba(0,255,0,0.2)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                        }}>
                            ✨ {product.sale_event}
                        </div>
                    )}
                </div>
            )}

            <span style={{
                alignSelf: 'flex-start',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: 'var(--fs-p2)',
                color: isFree ? '#00f2fe' : 'var(--brand-accent)',
                background: isFree ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255,255,255,0.05)',
                padding: '0.3rem 0.8rem',
                borderRadius: '100px',
                fontWeight: 700,
                marginBottom: '1.5rem'
            }}>
                {product.type}
            </span>

            <h3 style={{ margin: '0 0 1rem 0' }}>{product.title}</h3>
            <p style={{ color: 'var(--muted-color)', flex: 1, marginBottom: '2rem' }}>{product.description}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 800, fontSize: 'var(--fs-p1)', color: '#fff' }}>
                        {formatPrice(displayPrice)}
                    </span>
                    {isOnSale && (
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'var(--fs-p2)', textDecoration: 'line-through' }}>
                            {formatPrice(product.price_tzs)}
                        </span>
                    )}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 'var(--fs-p2)' }}>
                    {product.sales_count || (isFree ? `${product.downloads} downloads` : product.salesCount)}
                </span>
            </div>

            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onClick(product, isFree)}
                className={isFree ? 'studio-btn studio-btn-outline' : 'studio-btn studio-btn-primary'}
                style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
            >
                {isFree ? <><Download size={16} /> Download Free</> : <><ShoppingBag size={16} /> Buy Now</>}
            </motion.button>
        </motion.div>
    );
};

/* ── Payment Modal ──────────────────────────────────── */
const PaymentModal = ({ product, isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [settings, setSettings] = useState({ bankName: 'NBC', bankAcc: '', lipa: '' });
    const [selectedMethod, setSelectedMethod] = useState('');

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
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'grid', placeItems: 'center', padding: '1rem' }}
            >
                <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

                <motion.div
                    initial={{ y: 50, scale: 0.95 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 20, scale: 0.95 }}
                    onClick={e => e.stopPropagation()}
                    style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '2.5rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
                >
                    <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>

                    {step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <span style={{ color: 'var(--brand-accent)', fontWeight: 700, textTransform: 'uppercase', fontSize: 'var(--fs-p2)', letterSpacing: '0.1em' }}>Step 1: Choose Payment Method</span>
                            <h2 style={{ margin: 0 }}>{product.title}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
                                <div style={{ fontWeight: 800, fontSize: 'var(--fs-p1)' }}>{formatPrice(product.is_on_sale ? product.sale_price_tzs : product.price_tzs)}</div>
                                {product.is_on_sale && <div style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.3)', fontSize: 'var(--fs-p2)' }}>{formatPrice(product.price_tzs)}</div>}
                            </div>

                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <button
                                    onClick={() => { setSelectedMethod('Bank'); setStep(2); }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}
                                >
                                    <CreditCard size={20} color="var(--brand-accent)" />
                                    <span style={{ flex: 1, fontWeight: 600 }}>Bank Payment ({settings.bankName})</span>
                                </button>
                                <button
                                    onClick={() => { setSelectedMethod('Lipa'); setStep(2); }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}
                                >
                                    <Smartphone size={20} color="var(--brand-accent)" />
                                    <span style={{ flex: 1, fontWeight: 600 }}>Lipa Number / Mobile Money</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <span style={{ color: 'var(--brand-accent)', fontWeight: 700, textTransform: 'uppercase', fontSize: 'var(--fs-p2)' }}>Step 2: Confirm & Receive</span>
                            <h2 style={{ margin: 0 }}>Payment Instructions</h2>
                            
                             <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', padding: '1.5rem', borderRadius: '12px' }}>
                                <p style={{ margin: '0 0 1rem 0' }}>Please send <strong>{formatPrice(product.is_on_sale ? product.sale_price_tzs : product.price_tzs)}</strong> using <strong>{selectedMethod === 'Bank' ? 'Bank Transfer' : 'Mobile Payment'}</strong> to:</p>
                                <div style={{ fontWeight: 800, textAlign: 'center', letterSpacing: '2px', color: 'var(--brand-accent)', fontSize: 'var(--fs-p1)' }}>
                                    {selectedMethod === 'Bank' ? settings.bankAcc : settings.lipa}
                                </div>
                                {selectedMethod === 'Bank' && <div style={{ textAlign: 'center', fontSize: 'var(--fs-p2)', color: 'var(--muted-color)', marginTop: '0.5rem' }}>Bank: {settings.bankName} | Name: JOHNSON SAIMON</div>}
                            </div>

                            <p style={{ color: 'var(--muted-color)', fontSize: 'var(--fs-p2)' }}>{productsData.payment.microcopy.postPayment}</p>
                            
                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={async (e) => {
                                e.preventDefault();

                                const form = e.target;
                                const name = form.name.value;
                                const email = form.email.value;
                                const sender_name = form.sender_name.value;

                                if (!isSupabaseReady) {
                                    alert("Database not connected yet.");
                                    return;
                                }

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
                                    alert(`Failed to submit order: ${err.message || 'Unknown error'}`);
                                }
                            }}>
                                <input name="name" type="text" placeholder="Your Full Name" required style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit' }} />
                                <input name="email" type="email" placeholder="Your Email (for product delivery)" required style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit' }} />
                                <input name="sender_name" type="text" placeholder="Sender's Name (as it appears in payment)" required style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit' }} />
                                <button type="submit" className="studio-btn studio-btn-primary" style={{ width: '100%' }}>Confirm Payment</button>
                            </form>
                        </div>
                    )}

                    {step === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', padding: '2rem 0' }}>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                <CheckCircle size={64} color="var(--brand-accent)" />
                            </motion.div>
                            <h2 style={{ margin: 0 }}>Details Received</h2>
                            <p style={{ color: 'var(--muted-color)' }}>
                                We've received your details. Once verified, your resource will be sent immediately to your email.
                            </p>
                            
                            <div style={{ background: 'rgba(189, 255, 0, 0.1)', border: '1px solid rgba(189, 255, 0, 0.2)', padding: '1rem', borderRadius: '12px', textAlign: 'left', width: '100%' }}>
                                <p style={{ color: 'var(--brand-accent)', fontSize: 'var(--fs-p2)', margin: 0, display: 'flex', gap: '10px' }}>
                                    <span>💡</span> <span><strong>Check your Spam folder</strong> if you don't see our email within 10 minutes.</span>
                                </p>
                            </div>

                            <button onClick={onClose} className="studio-btn studio-btn-outline" style={{ marginTop: '0.5rem', width: '100%' }}>Close</button>
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

    React.useEffect(() => {
        if (isOpen) {
            setLoading(false);
            setSuccess(false);
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;

        if (!isSupabaseReady) {
            alert("Database not connected yet.");
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
            alert("Failed to process download.");
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
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'grid', placeItems: 'center', padding: '1rem' }}
            >
                <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />
                <motion.div
                    initial={{ y: 50, scale: 0.95 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 20, scale: 0.95 }}
                    onClick={e => e.stopPropagation()}
                    style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', width: '100%', maxWidth: '400px', padding: '2.5rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
                >
                    <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>

                    {!success ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <span style={{ color: '#00f2fe', fontWeight: 700, textTransform: 'uppercase', fontSize: 'var(--fs-p2)', letterSpacing: '0.1em' }}>Free Download</span>
                            <h2 style={{ margin: 0 }}>{product.title}</h2>
                            <p style={{ color: 'var(--muted-color)' }}>Where should we send your download link?</p>

                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
                                <input name="name" type="text" placeholder="Your Name" required style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit' }} />
                                <input name="email" type="email" placeholder="Your Best Email" required style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit' }} />
                                <button type="submit" disabled={loading} className="studio-btn studio-btn-outline" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
                                    {loading ? <><Loader2 size={18} className="spin" style={{ marginRight: '0.5rem' }} /> Sending...</> : 'Get Free Resource'}
                                </button>
                                <p style={{ fontSize: 'var(--fs-p2)', color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: 0 }}>
                                    You'll be added to my weekly newsletter. No spam.
                                </p>
                            </form>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', padding: '1rem 0' }}>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                <CheckCircle size={64} color="#00f2fe" />
                            </motion.div>
                            <h2 style={{ margin: 0 }}>On its way!</h2>
                            <p style={{ color: 'var(--muted-color)' }}>
                                Check your email inbox for the download link.
                            </p>
                            
                            <div style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.2)', padding: '1rem', borderRadius: '12px', textAlign: 'left', width: '100%' }}>
                                <p style={{ color: '#00f2fe', fontSize: 'var(--fs-p2)', margin: 0, display: 'flex', gap: '10px' }}>
                                    <span>💡</span> <span><strong>Check your Spam folder</strong> and mark as "Not Spam" to ensure you get future updates.</span>
                                </p>
                            </div>

                            <button onClick={onClose} className="studio-btn studio-btn-outline" style={{ marginTop: '0.5rem', width: '100%' }}>Awesome, thanks!</button>
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
    const [paidProducts, setPaidProducts] = useState([]);
    const [freeProducts, setFreeProducts] = useState([]);
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

                const paid = [];
                const free = [];

                data.forEach(p => {
                    const formattedProduct = {
                        ...p,
                        downloads: '120+',
                        salesCount: '15-30 per month' // Fallback
                    };

                    if (p.price_tzs > 0) {
                        paid.push(formattedProduct);
                    } else {
                        free.push(formattedProduct);
                    }
                });

                setPaidProducts(paid);
                setFreeProducts(free);
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
            <div className="studio-noise" />

            {/* Hero */}
            <section className="section resources-hero">
                <div className="container">
                    <div className="distributed-grid">
                        <div className="col-left">
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                                <span className="badge">Digital Marketplace</span>
                                <h1 style={{ fontSize: 'var(--fs-h1)', margin: '2rem 0' }}>Premium Tools <br /> & Free Creative Assets.</h1>
                            </motion.div>
                        </div>
                        <div className="col-right stagger-bottom">
                            <motion.p className="lead" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                                Curated resources designed to help you build, design, and convert faster.
                                From high-end templates to essential design guides.
                            </motion.p>
                        </div>
                    </div>
                </div>
                <div className="hero-video-bg">
                    <div className="video-overlay" />
                    <div className="dummy-video-content">
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 15, repeat: Infinity }} className="abstract-blob" />
                    </div>
                </div>
            </section>

            {/* Paid Products */}
            <section className="section studio-section">
                <div className="container">
                    <h2 className="group-title">Premium Assets</h2>
                    <div className="products-grid">
                        {paidProducts.map(product => (
                            <ProductCard key={product.id} product={product} isFree={false} onClick={handleClick} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Free Products */}
            <section className="section studio-section">
                <div className="container">
                    <h2 className="group-title">Free Resources</h2>
                    <div className="products-grid">
                        {freeProducts.map(product => (
                            <ProductCard key={product.id} product={product} isFree={true} onClick={handleClick} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Behind The Scenes */}
            <section className="section studio-section">
                <div className="container">
                    <div className="bts-section">
                        <div className="distributed-grid" style={{ alignItems: 'center' }}>
                            <div className="col-left">
                                <span className="badge">{btsSettings.badge}</span>
                                <h2>{btsSettings.title}</h2>
                                <p>{btsSettings.description}</p>
                                <button className="studio-btn studio-btn-primary" onClick={() => btsSettings.videoUrl && window.open(btsSettings.videoUrl, '_blank')}>
                                    {btsSettings.buttonText} <Play size={16} style={{ marginLeft: '0.5rem' }} />
                                </button>
                            </div>
                            <div className="col-right stagger-bottom">
                                <div style={{ width: '100%', aspectRatio: '16/9', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center' }}>
                                    <Play size={48} opacity={0.3} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div style={{ padding: '8rem 0', textAlign: 'center' }}>
                <Link to="/" className="btn-outline">← Back Home</Link>
            </div>

            <PaymentModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
            <FreeDownloadModal product={selectedFreeProduct} isOpen={!!selectedFreeProduct} onClose={() => setSelectedFreeProduct(null)} />
        </div>
    );
};

export default ResourcesPage;
