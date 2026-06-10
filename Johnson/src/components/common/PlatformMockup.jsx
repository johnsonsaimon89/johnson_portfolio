import React, { useState } from 'react';
import { Instagram, Linkedin, Youtube, Twitter, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ThumbsUp, MessageSquare, Share2, ChevronLeft, ChevronRight } from 'lucide-react';

const PlatformMockup = ({ 
    platform = 'instagram', 
    accountName = '', 
    accountHandle = '', 
    accountLogo = '',
    mediaItems = [],
    style 
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const defaultStyle = {
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        borderRadius: '24px',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '8px solid #111',
        display: 'flex',
        flexDirection: 'column',
        ...style
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev < mediaItems.length - 1 ? prev + 1 : prev));
    };

    const ProfilePicture = ({ size = 32 }) => {
        if (accountLogo) {
            return (
                <img 
                    src={accountLogo} 
                    alt="Profile" 
                    style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }} 
                />
            );
        }
        return (
            <div style={{ width: size, height: size, borderRadius: '50%', background: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: size * 0.4, fontWeight: 'bold', color: '#888' }}>
                    {(accountName || platform).charAt(0).toUpperCase()}
                </span>
            </div>
        );
    };

    const getPlatformHeader = () => {
        const p = platform.toLowerCase();
        
        if (p.includes('insta')) {
            return (
                <div style={{ padding: '0.8rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <ProfilePicture size={36} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600', fontSize: 'var(--fs-p2)', color: '#000', lineHeight: 1.2 }}>
                                {accountHandle ? accountHandle.replace('@', '') : (accountName || 'Instagram')}
                            </span>
                            {accountName && <span style={{ fontSize: 'var(--fs-p2)', color: '#666' }}>{accountName}</span>}
                        </div>
                    </div>
                    <MoreHorizontal size={20} color="#000" />
                </div>
            );
        }
        
        if (p.includes('linked')) {
            return (
                <div style={{ padding: '0.8rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <ProfilePicture size={40} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600', fontSize: 'var(--fs-p2)', color: '#000', lineHeight: 1.2 }}>
                                {accountName || 'LinkedIn Member'}
                            </span>
                            <span style={{ fontSize: 'var(--fs-p2)', color: '#666', lineHeight: 1.3 }}>
                                {accountHandle || 'Professional Network'}
                            </span>
                        </div>
                    </div>
                    <MoreHorizontal size={20} color="#666" />
                </div>
            );
        }

        if (p.includes('tube')) {
            return (
                <div style={{ padding: '0.8rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid #eee', background: '#fff' }}>
                    <ProfilePicture size={40} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '600', fontSize: 'var(--fs-p2)', color: '#000', lineHeight: 1.2 }}>
                            {accountName || 'YouTube Channel'}
                        </span>
                        <span style={{ fontSize: 'var(--fs-p2)', color: '#666', lineHeight: 1.3 }}>
                            {accountHandle || '1M subscribers'}
                        </span>
                    </div>
                </div>
            );
        }

        if (p === 'x' || p.includes('twit')) {
            return (
                <div style={{ padding: '0.8rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.8rem', borderBottom: '1px solid #eee', background: '#000', color: '#fff' }}>
                    <ProfilePicture size={40} />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontWeight: '700', fontSize: 'var(--fs-p2)', color: '#fff' }}>{accountName || 'X User'}</span>
                            <span style={{ fontSize: 'var(--fs-p2)', color: '#71767b' }}>{accountHandle ? (accountHandle.startsWith('@') ? accountHandle : `@${accountHandle}`) : '@handle'}</span>
                        </div>
                    </div>
                    <MoreHorizontal size={20} color="#71767b" />
                </div>
            );
        }

        // Generic fallback
        return (
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <ProfilePicture />
                    <span style={{ fontWeight: '700', fontSize: 'var(--fs-p2)', color: '#334155' }}>{accountName || platform}</span>
                </div>
            </div>
        );
    };

    const getPlatformFooter = () => {
        const p = platform.toLowerCase();
        
        if (p.includes('insta')) {
            return (
                <div style={{ padding: '0.8rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Heart size={24} color="#000" />
                        <MessageCircle size={24} color="#000" />
                        <Send size={24} color="#000" />
                    </div>
                    <Bookmark size={24} color="#000" />
                </div>
            );
        }
        
        if (p.includes('linked')) {
            return (
                <div style={{ padding: '0.5rem 1rem 0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', color: '#666' }}>
                        <ThumbsUp size={20} />
                        <span style={{ fontSize: 'var(--fs-p2)', fontWeight: '600' }}>Like</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', color: '#666' }}>
                        <MessageSquare size={20} />
                        <span style={{ fontSize: 'var(--fs-p2)', fontWeight: '600' }}>Comment</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', color: '#666' }}>
                        <Share2 size={20} />
                        <span style={{ fontSize: 'var(--fs-p2)', fontWeight: '600' }}>Share</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', color: '#666' }}>
                        <Send size={20} />
                        <span style={{ fontSize: 'var(--fs-p2)', fontWeight: '600' }}>Send</span>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="platform-mockup" style={defaultStyle}>
            {getPlatformHeader()}
            
            <div className="platform-mockup-content" style={{ flex: 1, position: 'relative', background: '#e5e7eb', minHeight: '300px', display: 'flex', overflow: 'hidden' }}>
                {mediaItems && mediaItems.length > 0 ? (
                    <>
                        <div 
                            style={{ 
                                display: 'flex', 
                                width: `${mediaItems.length * 100}%`,
                                transform: `translateX(-${currentIndex * (100 / mediaItems.length)}%)`,
                                transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                                height: '100%'
                            }}
                        >
                            {mediaItems.map((item, idx) => (
                                <div key={idx} style={{ width: `${100 / mediaItems.length}%`, height: '100%', position: 'relative' }}>
                                    <img 
                                        src={item} 
                                        alt={`Slide ${idx + 1}`} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                                    />
                                </div>
                            ))}
                        </div>

                        {mediaItems.length > 1 && currentIndex > 0 && (
                            <button 
                                onClick={handlePrev}
                                style={{
                                    position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%',
                                    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 10
                                }}
                            >
                                <ChevronLeft size={20} color="#000" />
                            </button>
                        )}

                        {mediaItems.length > 1 && currentIndex < mediaItems.length - 1 && (
                            <button 
                                onClick={handleNext}
                                style={{
                                    position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%',
                                    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 10
                                }}
                            >
                                <ChevronRight size={20} color="#000" />
                            </button>
                        )}
                        
                        {mediaItems.length > 1 && (
                            <div style={{ position: 'absolute', bottom: '12px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 10 }}>
                                {mediaItems.map((_, idx) => (
                                    <div 
                                        key={idx}
                                        style={{ 
                                            width: '6px', height: '6px', borderRadius: '50%', 
                                            background: currentIndex === idx ? '#0095f6' : 'rgba(255,255,255,0.6)',
                                            transition: 'background 0.3s'
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', position: 'absolute' }}>
                        No Media Content
                    </div>
                )}
            </div>

            {getPlatformFooter()}
        </div>
    );
};

export default PlatformMockup;
