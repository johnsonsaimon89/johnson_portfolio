import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { toast } from '../../utils/toast';
import { Save, RefreshCw } from 'lucide-react';

const HeroManager = () => {
    const [heroData, setHeroData] = useState({
        home_hero_title: 'Building digital spaces for changemakers',
        home_hero_subtitle: 'From brand identity to full-scale web platforms.',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchHeroData();
    }, []);

    const fetchHeroData = async () => {
        setLoading(true);
        if (!supabase) { setLoading(false); return; }
        
        // Fetch specific keys from app_config
        const keys = ['home_hero_title', 'home_hero_subtitle'];
        const { data, error } = await supabase
            .from('app_config')
            .select('key, value')
            .in('key', keys);
            
        if (!error && data) {
            const mapped = { ...heroData };
            data.forEach(item => {
                mapped[item.key] = item.value;
            });
            setHeroData(mapped);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        if (!supabase) return;
        
        const updates = Object.keys(heroData).map(key => ({
            key,
            value: heroData[key],
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('app_config')
            .upsert(updates, { onConflict: 'key' });

        if (error) {
            toast.error('Failed to save hero copy: ' + error.message);
        } else {
            toast.success('Hero copy updated successfully!');
        }
        setSaving(false);
    };

    const handleChange = (e) => {
        setHeroData({ ...heroData, [e.target.name]: e.target.value });
    };

    const s = {
        container: { display: 'flex', flexDirection: 'column', gap: '2rem' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        title: { fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#0F0F0F' },
        subtitle: { color: '#71717a', fontSize: '0.875rem', marginTop: '0.25rem' },
        card: { background: '#fff', borderRadius: '16px', border: '1px solid #E8E8E5', padding: '2rem' },
        formGroup: { marginBottom: '1.5rem' },
        label: { display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', color: '#0F0F0F' },
        input: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E8E8E5', fontSize: '0.95rem' },
        textarea: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E8E8E5', fontSize: '0.95rem', minHeight: '100px', resize: 'vertical' },
        saveBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#0F0F0F', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }
    };

    if (loading) {
        return <div style={{ padding: '3rem', textAlign: 'center', color: '#71717a' }}><RefreshCw className="spin" /> Loading...</div>;
    }

    return (
        <div style={s.container}>
            <div style={s.header}>
                <div>
                    <h2 style={s.title}>Hero Section Manager</h2>
                    <p style={s.subtitle}>Update the main messaging on your homepage</p>
                </div>
                <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
                    {saving ? <RefreshCw className="spin" size={16} /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div style={s.card}>
                <div style={s.formGroup}>
                    <label style={s.label}>Main Headline (H1)</label>
                    <input 
                        style={s.input} 
                        name="home_hero_title" 
                        value={heroData.home_hero_title} 
                        onChange={handleChange} 
                    />
                </div>
                <div style={s.formGroup}>
                    <label style={s.label}>Subheading</label>
                    <textarea 
                        style={s.textarea} 
                        name="home_hero_subtitle" 
                        value={heroData.home_hero_subtitle} 
                        onChange={handleChange} 
                    />
                </div>
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default HeroManager;
