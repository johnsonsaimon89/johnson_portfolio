import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { toast } from '../../utils/toast';
import ImageUploader from './ImageUploader';
import { formatUrl, sanitizeUrlInput } from '../../utils/urlUtils';

const ProjectForm = ({ project, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        organization_name: '',
        organization_type: '',
        is_active: true,
        content: {
            title: '',
            image: '',
            url: '',
            upcoming: false,
            isProject: true
        }
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (project) {
            setFormData({
                organization_name: project.organization_name || '',
                organization_type: project.organization_type || '',
                is_active: project.is_active ?? true,
                content: {
                    title: project.content?.title || '',
                    image: project.content?.image || '',
                    url: project.content?.url || '',
                    upcoming: project.content?.upcoming || false,
                    isProject: true
                }
            });
        }
    }, [project]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (['title', 'image', 'url'].includes(name)) {
            setFormData(prev => ({
                ...prev,
                content: {
                    ...prev.content,
                    [name]: value
                }
            }));
        } else if (name === 'upcoming') {
            setFormData(prev => ({
                ...prev,
                content: {
                    ...prev.content,
                    [name]: checked
                }
            }));
        } else if (name === 'is_active') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = (url) => {
        setFormData(prev => ({
            ...prev,
            content: {
                ...prev.content,
                image: url
            }
        }));
    };

    const handleUrlBlur = (e) => {
        const sanitized = sanitizeUrlInput(e.target.value);
        setFormData(prev => ({
            ...prev,
            content: {
                ...prev.content,
                url: sanitized
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const formattedUrl = formData.content.url ? formatUrl(formData.content.url) : '';
            
            const payload = {
                ...formData,
                type: 'web', // Enforced by database constraint
                content: {
                    ...formData.content,
                    url: formattedUrl,
                    isProject: true
                }
            };

            if (project?.id) {
                // Update
                const { error: updateError } = await supabase
                    .from('case_studies')
                    .update(payload)
                    .eq('id', project.id);
                if (updateError) throw updateError;
                toast.success('Project updated successfully');
            } else {
                // Insert
                // Get highest display order
                const { data: maxOrderData } = await supabase
                    .from('case_studies')
                    .select('display_order')
                    .order('display_order', { ascending: false })
                    .limit(1);
                    
                payload.display_order = (maxOrderData?.[0]?.display_order || 100) + 1;

                const { error: insertError } = await supabase
                    .from('case_studies')
                    .insert(payload);
                if (insertError) throw insertError;
                toast.success('Project created successfully');
            }
            onSave();
        } catch (err) {
            console.error('Save error:', err);
            setError(err.message || 'Failed to save project');
            toast.error('Failed to save project');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form refined-form">
            <div className="form-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>{project ? 'Edit Carousel Project' : 'New Carousel Project'}</h4>
            </div>

            {error && (
                <div className="error-banner" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <AlertCircle size={20} />
                    <p style={{ margin: 0 }}>{error}</p>
                </div>
            )}

            <div className="form-row">
                <div className="form-group half">
                    <label>Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.content.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Hadzabe Media Center"
                    />
                </div>
                <div className="form-group half">
                    <label>Category (Type) *</label>
                    <input
                        type="text"
                        name="organization_type"
                        value={formData.organization_type}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Community Archive"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group half">
                    <label>External Website URL</label>
                    <input
                        type="text"
                        name="url"
                        value={formData.content.url}
                        onChange={handleChange}
                        onBlur={handleUrlBlur}
                        placeholder="e.g. hadzabemediacenter.org or https://hadzabemediacenter.org"
                    />
                    <small style={{ color: '#71717a', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                        Full web address. If you enter "hadzabemediacenter.org", it will automatically format to "https://hadzabemediacenter.org".
                    </small>
                </div>
                <div className="form-group half">
                    <label>Project Cover Image (Upload or URL)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                            type="text"
                            name="image"
                            value={formData.content.image || ''}
                            onChange={handleChange}
                            placeholder="e.g. /projects/hadzabe.png or https://..."
                            style={{ flex: 1 }}
                        />
                        <ImageUploader
                            bucketName="portfolio_images"
                            currentImageUrl={formData.content.image}
                            onUploadSuccess={handleImageUpload}
                        />
                    </div>
                </div>
            </div>

            <div className="form-divider" />

            <div className="form-section-header mt-2">
                <h4>Visibility & Display</h4>
            </div>

            <div className="form-row" style={{ gap: '2.5rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--tab-accent, #6366f1)' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Publicly Visible</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        name="upcoming"
                        checked={formData.content.upcoming}
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--brand-accent, #E05A3D)' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--brand-accent, #E05A3D)' }}>"Coming Soon" Badge</span>
                </label>
            </div>

            <div className="form-actions mt-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" disabled={isSaving} className="premium-submit-btn">
                        {isSaving ? 'Saving...' : <><Save size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> {project ? 'Update Project' : 'Save Project'}</>}
                    </button>
                    <button type="button" onClick={onCancel} className="premium-cancel-btn">
                        Cancel
                    </button>
                </div>

                <a href="/work" target="_blank" rel="noopener noreferrer" className="premium-add-btn secondary-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <X size={16} /> Discard Changes
                </a>
            </div>

            <style jsx>{`
                .refined-form { width: 100%; max-width: 900px; margin: 0 auto; }
                .form-section-header { margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #f0f0f0; }
                .form-section-header h4 { margin: 0; color: #111; font-size: var(--fs-p2); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
                .form-divider { height: 1px; background: #eee; margin: 2rem 0; }
                .form-row { display: flex; gap: 1.5rem; margin-bottom: 1.25rem; }
                .form-group.half { flex: 1; min-width: 0; }
                .form-actions { padding-top: 2rem; border-top: 1px solid #eee; }
                .premium-submit-btn { padding: 0.8rem 2rem; background: var(--tab-accent, #6366f1); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; }
                .premium-submit-btn:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }
                .premium-cancel-btn { padding: 0.8rem 1.5rem; background: transparent; color: #666; border: 1px solid #ddd; border-radius: 8px; font-weight: 500; cursor: pointer; }
                .premium-cancel-btn:hover { background: #f5f5f5; color: #333; }
                .premium-add-btn.secondary-outline { background: transparent; border: 1px solid #ddd; color: #666; cursor: pointer; border-radius: 8px; transition: all 0.2s; padding: 0.8rem 1.2rem; }
                .premium-add-btn.secondary-outline:hover { background: #fee2e2; border-color: #ef4444; color: #ef4444; }
                @media (max-width: 768px) {
                    .form-row { flex-direction: column; gap: 1rem; }
                }
            `}</style>
        </form>
    );
};

export default ProjectForm;
