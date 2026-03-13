import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Globe, AlertCircle, RefreshCcw } from 'lucide-react';

/**
 * MiniBrowser Component
 * A premium, adaptive mockup that displays a live website preview, a screenshot, or a fallback.
 * Supports both desktop (browser) and mobile (phone) modes.
 */
const MiniBrowser = ({ 
    url, 
    previewImage, 
    type = 'desktop', 
    clientName = 'Project',
    colors = ['#6366f1', '#1e293b']
}) => {
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [iframeStatus, setIframeStatus] = useState('loading'); // loading, success, blocked
    const [useScreenshot, setUseScreenshot] = useState(false);
    
    // Safely parse hostname
    const getHostName = (urlStr) => {
        try {
            if (!urlStr || urlStr === '#') return 'preview.local';
            const url = new URL(urlStr);
            return url.hostname;
        } catch (e) {
            return 'preview.local';
        }
    };

    const displayUrl = getHostName(url);

    // Known sites that block iframes or are slow to load in iframes
    const isKnownBlocked = (urlStr) => {
        if (!urlStr || urlStr === '#') return false;
        const host = urlStr.toLowerCase();
        return host.includes('stripe.com') || 
               host.includes('coursera.org') || 
               host.includes('nature.org') || 
               host.includes('apple.com') ||
               host.includes('instagram.com') ||
               host.includes('facebook.com') ||
               host.includes('twitter.com') ||
               host.includes('linkedin.com') ||
               host.includes('amazon.com') ||
               host.includes('behance.net') ||
               host.includes('dribbble.com');
    };

    const handleOpenTab = (e) => {
        if (url && url !== '#') {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    // WordPress MShots URL for dynamic screenshots
    // Using a medium width to ensure faster generation/loading
    const screenshotUrl = (url && url !== '#' && url !== 'undefined')
        ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=600` 
        : null;

    useEffect(() => {
        if (url && url !== '#' && !previewImage) {
            // Pre-emptively switch to screenshot if the domain is known to block iframes
            if (isKnownBlocked(url)) {
                console.log(`Pre-emptively switching to screenshot for restricted domain: ${url}`);
                setUseScreenshot(true);
                setIframeStatus('loading'); // Show "Generating Preview" state initially
                return;
            }

            const timer = setTimeout(() => {
                if (!iframeLoaded) {
                    setIframeStatus('blocked');
                    setUseScreenshot(true); // Fallback to screenshot if iframe hasn't loaded
                }
            }, 6000); // 6 seconds threshold
            return () => clearTimeout(timer);
        }
    }, [url, iframeLoaded, previewImage]);

    const renderContent = () => {
        // 1. Prioritize user-provided preview image
        if (previewImage) {
            return (
                <img 
                    src={previewImage} 
                    alt={clientName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
            );
        }

        // 2. Try Iframe first (unless already marked as failed/blocked)
        if (url && url !== '#' && !useScreenshot) {
            return (
                <div style={{ width: '100%', height: '100%', position: 'relative', background: '#050505' }}>
                    <iframe 
                        src={url} 
                        onLoad={() => {
                            setIframeLoaded(true);
                            setIframeStatus('success');
                        }}
                        style={{ 
                            width: type === 'mobile' ? '100%' : '125%', 
                            height: type === 'mobile' ? '100%' : '125%', 
                            border: 'none', 
                            transform: type === 'mobile' ? 'none' : 'scale(0.8)', 
                            transformOrigin: 'top left',
                            opacity: iframeLoaded ? 1 : 0,
                            transition: 'opacity 0.5s ease'
                        }}
                        title={clientName}
                    />

                    {/* Loading State Overlay */}
                    {!iframeLoaded && iframeStatus === 'loading' && (
                        <div style={{ 
                            position: 'absolute', 
                            inset: 0, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: '#050505',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            <RefreshCcw className="animate-spin" style={{ color: 'var(--brand-accent)', opacity: 0.5 }} />
                            <span style={{ fontSize: '10px', opacity: 0.3, letterSpacing: '0.1em' }}>CONNECTING...</span>
                        </div>
                    )}
                </div>
            );
        }

        // 3. Dynamic Screenshot fallback for restricted sites
        if (screenshotUrl && useScreenshot) {
            return (
                <div style={{ width: '100%', height: '100%', background: '#050505', position: 'relative' }}>
                    <img 
                        src={screenshotUrl} 
                        alt={`${clientName} Live Preview`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onLoad={() => setIframeStatus('success')}
                        onError={() => {
                            console.log('Screenshot failed, falling back to gradient');
                            setUseScreenshot(false);
                        }}
                    />
                    {iframeStatus === 'loading' && (
                        <div style={{ 
                            position: 'absolute', 
                            inset: 0, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: '#050505',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            <RefreshCcw className="animate-spin" style={{ color: 'var(--brand-accent)', opacity: 0.5 }} />
                            <span style={{ fontSize: '10px', opacity: 0.3, letterSpacing: '0.1em' }}>GENERATING PREVIEW...</span>
                        </div>
                    )}
                    <div style={{ 
                        position: 'absolute', 
                        bottom: '12px', 
                        right: '12px', 
                        background: 'rgba(0,0,0,0.6)', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontSize: '10px',
                        color: 'white',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 2
                    }}>
                        Live Snapshot
                    </div>
                </div>
            );
        }

        // 4. Ultimate Fallback (Beautiful Gradient)
        return (
            <div style={{ 
                width: '100%', 
                height: '100%', 
                background: `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]})`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '2rem',
                flexDirection: 'column',
                gap: '1.5rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ 
                    position: 'absolute', 
                    width: '150%', 
                    height: '150%', 
                    background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    top: '-25%',
                    left: '-25%',
                    pointerEvents: 'none'
                }} />
                
                <div style={{ 
                    width: type === 'mobile' ? '80px' : '120px', 
                    height: type === 'mobile' ? '80px' : '120px', 
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    zIndex: 1
                }}>
                    <Globe size={type === 'mobile' ? 32 : 48} color="white" style={{ opacity: 0.8 }} />
                </div>

                <div style={{ zIndex: 1, textAlign: 'center' }}>
                    <div style={{ 
                        fontWeight: 900, 
                        fontSize: type === 'mobile' ? '1.2rem' : '2rem', 
                        color: 'white',
                        letterSpacing: '-0.02em',
                        marginBottom: '8px'
                    }}>
                        {clientName}
                    </div>
                    <div style={{ 
                        fontSize: type === 'mobile' ? '10px' : '14px', 
                        opacity: 0.6,
                        color: 'white',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        Interactive Case Study
                    </div>
                </div>
            </div>
        );
    };

    const HoverLabel = () => (
        <div className="hover-overlay" style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'rgba(0,0,0,0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.3s',
            zIndex: 50
        }}>
            <div className="view-btn" style={{ 
                background: 'white', 
                color: 'black', 
                padding: type === 'mobile' ? '10px 20px' : '12px 28px', 
                borderRadius: '100px',
                fontWeight: 700,
                fontSize: type === 'mobile' ? '12px' : '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                opacity: 0,
                transform: 'translateY(20px)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
                View Live Website <ExternalLink size={type === 'mobile' ? 14 : 16} />
            </div>
        </div>
    );

    // Device specific frames
    if (type === 'mobile') {
        return (
            <motion.div 
                className="mini-browser-mobile"
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={handleOpenTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    position: 'relative',
                    width: '280px',
                    height: '560px',
                    borderRadius: '44px',
                    background: '#0a0a0a',
                    border: '12px solid #1a1a1a',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.02)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    userSelect: 'none',
                    margin: '0 auto'
                }}
            >
                {/* Status Bar */}
                <div style={{ height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '18px', background: '#000', borderRadius: '10px', marginTop: '10px' }} />
                </div>

                {/* URL Bar */}
                <div style={{ 
                    padding: '8px 16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: 'rgba(255,255,255,0.03)',
                    margin: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.4)',
                    gap: '6px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <Globe size={10} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.8 }}>
                        {displayUrl}
                    </span>
                </div>

                {/* Content */}
                <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 80px)', background: '#050505' }}>
                    {renderContent()}
                    <HoverLabel />
                </div>

                {/* Home Indicator */}
                <div style={{ 
                    position: 'absolute', 
                    bottom: '8px', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    width: '35%', 
                    height: '4px', 
                    background: 'rgba(255,255,255,0.2)', 
                    borderRadius: '2px' 
                }} />

                <style>{`
                    .mini-browser-mobile:hover .hover-overlay {
                        background: rgba(0,0,0,0.3);
                        backdrop-filter: blur(2px);
                    }
                    .mini-browser-mobile:hover .view-btn {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                `}</style>
            </motion.div>
        );
    }

    // Default Browser / Desktop mode
    return (
        <motion.div 
            className="mini-browser-desktop"
            whileHover={{ y: -10, scale: 1.01 }}
            onClick={handleOpenTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                width: '100%',
                aspectRatio: '16/10',
                background: '#0a0a0a',
                borderRadius: '18px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 50px 100px rgba(0,0,0,0.7)',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                userSelect: 'none'
            }}
        >
            {/* Window Header */}
            <div style={{
                background: 'rgba(26,26,26,0.8)',
                backdropFilter: 'blur(10px)',
                padding: '14px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', boxShadow: '0 0 10px rgba(255,95,86,0.3)' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', boxShadow: '0 0 10px rgba(255,189,46,0.3)' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', boxShadow: '0 0 10px rgba(39,201,63,0.3)' }} />
                </div>
                
                {/* Search Bar */}
                <div style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.4)',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    fontFamily: 'monospace'
                }}>
                    <Globe size={14} strokeWidth={2.5} style={{ opacity: 0.6 }} />
                    <span style={{ letterSpacing: '0.02em' }}>{url || 'https://www.interactive-preview.local'}</span>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <RefreshCcw size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    <ExternalLink size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                </div>
            </div>

            {/* Content Area */}
            <div style={{ 
                position: 'relative', 
                width: '100%', 
                height: 'calc(100% - 56px)', 
                background: '#050505',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
            }}>
                {renderContent()}
                <HoverLabel />
            </div>

            {/* Subtle Gradient Glow */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                pointerEvents: 'none'
            }} />

            <style>{`
                .mini-browser-desktop:hover .hover-overlay {
                    background: rgba(0,0,0,0.4);
                    backdrop-filter: blur(4px);
                }
                .mini-browser-desktop:hover .view-btn {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </motion.div>
    );
};

export default MiniBrowser;
