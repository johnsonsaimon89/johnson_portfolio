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
        typography_body: 'Inter',
        // Payment Settings
        payment_bank_name: '',
        payment_bank_account: '',
        payment_lipa_number: '',
        // Behind the Scenes
        bts_badge: '',
        bts_title: '',
        bts_description: '',
        bts_button_text: '',
        bts_video_url: '',
        // Email/System Config (from app_config)
        edge_fn_base_url: '',
        app_service_role_key: '',
        resend_api_key: '',
        resend_audience_id: ''
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
            // Fetch app_config values
            const { data: configData } = await supabase.from('app_config').select('*');
            const configMap = {};
            if (configData) {
                configData.forEach(c => configMap[c.key] = c.value);
            }

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
                typography_body: data.typography_body || 'Inter',
                payment_bank_name: data.payment_bank_name || '',
                payment_bank_account: data.payment_bank_account || '',
                payment_lipa_number: data.payment_lipa_number || '',
                bts_badge: data.bts_badge || 'Behind The Scenes',
                bts_title: data.bts_title || 'How we build it.',
                bts_description: data.bts_description || '',
                bts_button_text: data.bts_button_text || 'Watch BTS Video',
                bts_video_url: data.bts_video_url || '',
                edge_fn_base_url: configMap['edge_fn_base_url'] || '',
                app_service_role_key: configMap['app_service_role_key'] || '',
                resend_api_key: configMap['resend_api_key'] || '',
                resend_audience_id: configMap['resend_audience_id'] || ''
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
            typography_body: settings.typography_body,
            payment_bank_name: settings.payment_bank_name,
            payment_bank_account: settings.payment_bank_account,
            payment_lipa_number: settings.payment_lipa_number,
            bts_badge: settings.bts_badge,
            bts_title: settings.bts_title,
            bts_description: settings.bts_description,
            bts_button_text: settings.bts_button_text,
            bts_video_url: settings.bts_video_url
        };

        const { error } = await supabase
            .from('site_settings')
            .update(updatedData)
            .eq('id', 1);

        // Update app_config
        const { error: configError } = await supabase
            .from('app_config')
            .upsert([
                { key: 'edge_fn_base_url', value: settings.edge_fn_base_url },
                { key: 'app_service_role_key', value: settings.app_service_role_key },
                { key: 'resend_api_key', value: settings.resend_api_key },
                { key: 'resend_audience_id', value: settings.resend_audience_id }
            ], { onConflict: 'key' });

        if (error || configError) {
            toast.error('Failed to save settings: ' + (error?.message || configError?.message));
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
                    <p style={{ margin: 0, fontSize: 'var(--fs-p2)', color: 'var(--muted-color)' }}>
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
                        <p style={{ fontSize: 'var(--fs-p2)', color: 'var(--muted-color)', marginBottom: '0.5rem', marginTop: '-0.3rem' }}>
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
                    <p style={{ fontSize: 'var(--fs-p2)', color: 'var(--muted-color)', marginBottom: '1rem' }}>
                        These details will be displayed to customers during the checkout process for digital products.
                    </p>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Bank Name (e.g., NBC)</label>
                            <input
                                type="text"
                                name="payment_bank_name"
                                value={settings.payment_bank_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group half">
                            <label>Account Number</label>
                            <input
                                type="text"
                                name="payment_bank_account"
                                value={settings.payment_bank_account}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Lipa Number / Mobile Money</label>
                        <input
                            type="text"
                            name="payment_lipa_number"
                            value={settings.payment_lipa_number}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <h4 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2rem' }}>Behind The Scenes (Resources Page)</h4>
                    <p style={{ fontSize: 'var(--fs-p2)', color: 'var(--muted-color)', marginBottom: '1rem' }}>
                        Update the content for the "Behind the Scenes" section on the Resources page.
                    </p>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Badge Text</label>
                            <input
                                type="text"
                                name="bts_badge"
                                value={settings.bts_badge}
                                onChange={handleInputChange}
                                placeholder="Behind The Scenes"
                            />
                        </div>
                        <div className="form-group half">
                            <label>Section Title</label>
                            <input
                                type="text"
                                name="bts_title"
                                value={settings.bts_title}
                                onChange={handleInputChange}
                                placeholder="How we build it."
                            />
                        </div>
                    </div>
                    
                    <div className="form-group mb-2">
                        <label>Description Content</label>
                        <textarea
                            name="bts_description"
                            value={settings.bts_description}
                            onChange={handleInputChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Button Text</label>
                            <input
                                type="text"
                                name="bts_button_text"
                                value={settings.bts_button_text}
                                onChange={handleInputChange}
                                placeholder="Watch BTS Video"
                            />
                        </div>
                        <div className="form-group half">
                            <label>Video URL (YouTube/Vimeo/Direct)</label>
                            <input
                                type="text"
                                name="bts_video_url"
                                value={settings.bts_video_url}
                                onChange={handleInputChange}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <h4 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2rem', color: '#BDFF00' }}>Email & Backend Configuration</h4>
                    <p style={{ fontSize: 'var(--fs-p2)', color: 'var(--muted-color)', marginBottom: '1rem' }}>
                        Critical settings for order notifications and automated emails. <strong>Restarting emails requires these to be set.</strong>
                    </p>
                    <div className="form-group">
                        <label>Edge Function Base URL</label>
                        <input
                            type="text"
                            name="edge_fn_base_url"
                            value={settings.edge_fn_base_url}
                            onChange={handleInputChange}
                            placeholder="https://qkwjerktszhlccrdjmxg.supabase.co"
                        />
                    </div>
                    <div className="form-group">
                        <label>Supabase Service Role Key (Found in API Settings)</label>
                        <input
                            type="password"
                            name="app_service_role_key"
                            value={settings.app_service_role_key}
                            onChange={handleInputChange}
                            placeholder="Paste your service_role key here"
                        />
                        <p style={{ fontSize: 'var(--fs-p2)', color: '#64748b', marginTop: '0.4rem' }}>
                            Go to Supabase Dashboard → Project Settings → API and copy the <code>service_role</code> secret.
                        </p>
                    </div>

                    <h4 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2rem', color: '#BDFF00' }}>Resend Newsletter Integration</h4>
                    <p style={{ fontSize: 'var(--fs-p2)', color: 'var(--muted-color)', marginBottom: '1rem' }}>
                        Configure your Resend API credentials to automatically sync new subscribers to your Resend Audience.
                    </p>
                    <div className="form-group">
                        <label>Resend API Key</label>
                        <input
                            type="password"
                            name="resend_api_key"
                            value={settings.resend_api_key}
                            onChange={handleInputChange}
                            placeholder="re_..."
                        />
                    </div>
                    <div className="form-group">
                        <label>Resend Audience ID (Contact List ID)</label>
                        <input
                            type="text"
                            name="resend_audience_id"
                            value={settings.resend_audience_id}
                            onChange={handleInputChange}
                            placeholder="e.g. 1a2b3c4d-..."
                        />
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="admin-submit-btn" disabled={saving} style={{ width: 'auto', padding: '0.8rem 2rem' }}>
                            {saving ? 'Saving...' : 'Save All Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsEditor;
