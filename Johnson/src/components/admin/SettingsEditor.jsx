import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ImageUploader from './ImageUploader';
import './AdminComponents.css';

const SettingsEditor = () => {
    const [settings, setSettings] = useState({
        hero_title: '',
        hero_subtitle: '',
        about_bio_text: '',
        contact_email: '',
        contact_phone: '',
        logo_url: '',
        theme_color_primary: '#BDFF00',
        theme_color_secondary: '#030303',
        typography_heading: 'Inter',
        typography_body: 'Inter'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } else if (data) {
            setSettings({
                hero_title: data.hero_title || '',
                hero_subtitle: data.hero_subtitle || '',
                about_bio_text: data.about_bio_array ? data.about_bio_array.join('\n\n') : '',
                contact_email: data.contact_email || '',
                contact_phone: data.contact_phone || '',
                logo_url: data.logo_url || '',
                theme_color_primary: data.theme_color_primary || '#BDFF00',
                theme_color_secondary: data.theme_color_secondary || '#030303',
                typography_heading: data.typography_heading || 'Inter',
                typography_body: data.typography_body || 'Inter'
            });
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        if (!supabase) return;

        // Convert the textarea string back into an array of paragraphs
        const bioArray = settings.about_bio_text
            .split('\n\n')
            .map(p => p.trim())
            .filter(p => p.length > 0);

        const updatedData = {
            hero_title: settings.hero_title,
            hero_subtitle: settings.hero_subtitle,
            about_bio_array: bioArray,
            contact_email: settings.contact_email,
            contact_phone: settings.contact_phone,
            logo_url: settings.logo_url,
            theme_color_primary: settings.theme_color_primary,
            theme_color_secondary: settings.theme_color_secondary,
            typography_heading: settings.typography_heading,
            typography_body: settings.typography_body
        };

        const { error } = await supabase
            .from('site_settings')
            .update(updatedData)
            .eq('id', 1);

        if (error) {
            toast.error('Failed to save settings: ' + error.message);
        } else {
            toast.success('Site settings saved successfully!');
        }
        setSaving(false);
    };

    if (loading) return <div className="admin-loading">Loading settings...</div>;

    return (
        <div className="admin-component-container">
            <div className="admin-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="panel-header">
                    <h3>Global Site Settings</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted-color)' }}>
                        Update the text content shown across your website.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="admin-form">
                    <h4 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Hero Section (Homepage)</h4>
                    <div className="form-group">
                        <label>Main Title (H1)</label>
                        <input
                            type="text"
                            name="hero_title"
                            value={settings.hero_title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group mb-2">
                        <label>Subtitle / Description</label>
                        <textarea
                            name="hero_subtitle"
                            value={settings.hero_subtitle}
                            onChange={handleInputChange}
                            rows="3"
                        />
                    </div>

                    <h4 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2rem' }}>About Section</h4>
                    <div className="form-group mb-2">
                        <label>Profile Biography</label>
                        <p style={{ fontSize: '0.8rem', color: 'var(--muted-color)', marginBottom: '0.5rem', marginTop: '-0.3rem' }}>
                            Separate paragraphs with a blank line (press Enter twice).
                        </p>
                        <textarea
                            name="about_bio_text"
                            value={settings.about_bio_text}
                            onChange={handleInputChange}
                            rows="10"
                        />
                    </div>

                    <h4 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2rem' }}>Contact Information</h4>
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Public Email</label>
                            <input
                                type="email"
                                name="contact_email"
                                value={settings.contact_email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group half">
                            <label>Public Phone</label>
                            <input
                                type="text"
                                name="contact_phone"
                                value={settings.contact_phone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <h4 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2rem' }}>Global Theme & Branding</h4>
                    <div className="form-group mb-2">
                        <label>Website Logo</label>
                        <div style={{ marginTop: '0.5rem', maxWidth: '400px' }}>
                            <ImageUploader 
                                bucketName="site-assets"
                                currentImageUrl={settings.logo_url}
                                onUploadSuccess={(url) => setSettings(prev => ({ ...prev, logo_url: url }))}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Primary Theme Color</label>
                            <input
                                type="color"
                                name="theme_color_primary"
                                value={settings.theme_color_primary}
                                onChange={handleInputChange}
                                style={{ padding: '0', height: '40px' }}
                            />
                        </div>
                        <div className="form-group half">
                            <label>Secondary Theme Color</label>
                            <input
                                type="color"
                                name="theme_color_secondary"
                                value={settings.theme_color_secondary}
                                onChange={handleInputChange}
                                style={{ padding: '0', height: '40px' }}
                            />
                        </div>
                    </div>
                    <div className="form-row mt-2">
                        <div className="form-group half">
                            <label>Heading Typography (Font Name)</label>
                            <input
                                type="text"
                                name="typography_heading"
                                value={settings.typography_heading}
                                onChange={handleInputChange}
                                placeholder="e.g., Inter, Roboto"
                            />
                        </div>
                        <div className="form-group half">
                            <label>Body Typography (Font Name)</label>
                            <input
                                type="text"
                                name="typography_body"
                                value={settings.typography_body}
                                onChange={handleInputChange}
                                placeholder="e.g., Inter, Arial"
                            />
                        </div>
                    </div>

                    <h4 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2rem' }}>Payment Details (Checkout)</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted-color)', marginBottom: '1rem' }}>
                        These details will be displayed to customers during the checkout process for digital products.
                    </p>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="admin-submit-btn" disabled={saving} style={{ width: 'auto', padding: '0.8rem 2rem' }}>
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsEditor;
