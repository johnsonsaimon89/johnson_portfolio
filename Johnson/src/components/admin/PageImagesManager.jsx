import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ImageUploader from './ImageUploader';
import { Image as ImageIcon, RefreshCw, Check } from 'lucide-react';

const PAGE_IMAGE_SLOTS = [
    {
        page: 'Profile Page, Services Accordion',
        description: 'These images appear in the right-hand visual panel when a service accordion item is open.',
        slots: [
            { key: 'profile_service_social', label: 'Social Media Service' },
            { key: 'profile_service_web', label: 'Web Design Service' },
            { key: 'profile_service_podcast', label: 'Podcast / Content Service' },
            { key: 'profile_service_brand', label: 'Brand Strategy Service' },
            { key: 'profile_service_digital', label: 'Digital Marketing Service' },
            { key: 'profile_service_strategy', label: 'Content Strategy Service' },
        ],
    },
    {
        page: 'Social Media Page',
        description: 'These images form the hero visual collage on the Social Media portfolio page.',
        slots: [
            { key: 'social_hero_collage_1', label: 'Hero Collage, Image 1' },
            { key: 'social_hero_collage_2', label: 'Hero Collage, Image 2' },
            { key: 'social_hero_collage_3', label: 'Hero Collage, Image 3' },
        ],
    },
    {
        page: 'Resources / Shop Page',
        description: 'Background or featured image for the Resources page hero section.',
        slots: [
            { key: 'resources_hero_image', label: 'Resources Hero Image' },
        ],
    },
];

const PageImagesManager = () => {
    const [images, setImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState({});

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setLoading(true);
        if (!supabase) { setLoading(false); return; }
        const { data, error } = await supabase
            .from('page_images')
            .select('page_key, image_url');
        if (!error && data) {
            const map = {};
            data.forEach(row => { map[row.page_key] = row.image_url; });
            setImages(map);
        }
        setLoading(false);
    };

    const handleUploadSuccess = async (pageKey, label, url) => {
        if (!supabase) return;
        const { error } = await supabase
            .from('page_images')
            .upsert(
                {
                    page_key: pageKey,
                    label,
                    image_url: url,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: 'page_key' }
            );
        if (error) {
            toast.error('Failed to save image: ' + error.message);
        } else {
            setImages(prev => ({ ...prev, [pageKey]: url }));
            setSaved(prev => ({ ...prev, [pageKey]: true }));
            toast.success(`✓ "${label}" updated`);
            setTimeout(() => setSaved(prev => ({ ...prev, [pageKey]: false })), 3000);
        }
    };

    const s = {
        root: { display: 'flex', flexDirection: 'column', gap: '3rem' },
        header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' },
        title: { fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#0F0F0F', margin: 0 },
        subtitle: { color: '#71717a', fontSize: '0.875rem', marginTop: '0.4rem', margin: '0.4rem 0 0' },
        refreshBtn: {
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.625rem 1.25rem', background: '#fff',
            border: '1px solid #E8E8E5', borderRadius: 10, cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 600, color: '#0F0F0F',
            transition: 'all 0.2s ease', fontFamily: 'inherit',
        },
        groupSection: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
        groupHeader: { paddingBottom: '0.75rem', borderBottom: '1px solid #E8E8E5' },
        groupLabel: {
            fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#71717a', display: 'block',
        },
        groupDesc: { fontSize: '0.8rem', color: '#a1a1aa', marginTop: '0.25rem' },
        slotsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
        },
        slotCard: (isSaved) => ({
            background: '#fff',
            border: `1px solid ${isSaved ? '#10b981' : '#E8E8E5'}`,
            borderRadius: 16,
            overflow: 'hidden',
            transition: 'border-color 0.3s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }),
        preview: {
            position: 'relative',
            aspectRatio: '4/3',
            background: '#F7F6F3',
            overflow: 'hidden',
        },
        previewImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
        placeholder: {
            width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#a1a1aa',
        },
        savedPill: {
            position: 'absolute', top: '0.75rem', right: '0.75rem',
            background: '#10b981', color: '#fff', borderRadius: '100px',
            padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center',
            gap: '0.3rem', fontSize: '0.72rem', fontWeight: 700,
        },
        cardBody: { padding: '1.25rem' },
        cardLabel: {
            fontSize: '0.8rem', fontWeight: 700, color: '#0F0F0F',
            margin: '0 0 1rem', letterSpacing: '-0.01em',
        },
        spinner: { marginRight: '0.75rem', animation: 'spin 1s linear infinite' },
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem', color: '#71717a' }}>
                <RefreshCw size={20} style={s.spinner} />
                Loading page images…
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={s.root}>
            {/* Header */}
            <div style={s.header}>
                <div>
                    <h2 style={s.title}>Page Images</h2>
                    <p style={s.subtitle}>
                        Upload images for specific sections across the site. Changes are saved instantly.
                    </p>
                </div>
                <button style={s.refreshBtn} onClick={fetchImages}>
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </div>

            {/* Groups */}
            {PAGE_IMAGE_SLOTS.map((group) => (
                <div key={group.page} style={s.groupSection}>
                    <div style={s.groupHeader}>
                        <span style={s.groupLabel}>{group.page}</span>
                        <p style={s.groupDesc}>{group.description}</p>
                    </div>

                    <div style={s.slotsGrid}>
                        {group.slots.map((slot) => {
                            const isSaved = !!saved[slot.key];
                            const currentUrl = images[slot.key];
                            return (
                                <div key={slot.key} style={s.slotCard(isSaved)}>
                                    {/* Image preview */}
                                    <div style={s.preview}>
                                        {currentUrl ? (
                                            <img src={currentUrl} alt={slot.label} style={s.previewImg} />
                                        ) : (
                                            <div style={s.placeholder}>
                                                <ImageIcon size={26} strokeWidth={1.5} />
                                                <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>No image yet</span>
                                            </div>
                                        )}
                                        {isSaved && (
                                            <div style={s.savedPill}>
                                                <Check size={11} />
                                                Saved
                                            </div>
                                        )}
                                    </div>

                                    {/* Label + uploader */}
                                    <div style={s.cardBody}>
                                        <p style={s.cardLabel}>{slot.label}</p>
                                        <ImageUploader
                                            bucketName="portfolio_images"
                                            currentImageUrl={currentUrl}
                                            onUploadSuccess={(url) =>
                                                handleUploadSuccess(slot.key, slot.label, url)
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default PageImagesManager;
