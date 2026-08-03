import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { toast } from '../../utils/toast';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                type: 'web', // Enforced by database constraint
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
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h2>{project ? 'Edit Project' : 'New Project'}</h2>
                    <button type="button" onClick={onCancel} className="icon-btn">
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="error-banner" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                        <AlertCircle size={20} />
                        <p style={{ margin: 0 }}>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.content.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Hadzabe Media Center"
                        />
                    </div>

                    <div className="form-group">
                        <label>Category (Type)</label>
                        <input
                            type="text"
                            name="organization_type"
                            value={formData.organization_type}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Community Archive"
                        />
                    </div>

                    <div className="form-group">
                        <label>Image URL / Path</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.content.image}
                            onChange={handleChange}
                            placeholder="e.g. /projects/hadzabe.png"
                        />
                    </div>

                    <div className="form-group">
                        <label>External URL</label>
                        <input
                            type="text"
                            name="url"
                            value={formData.content.url}
                            onChange={handleChange}
                            placeholder="e.g. https://example.com"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />
                            <span style={{ fontWeight: 600 }}>Active (Visible)</span>
                        </label>
                        
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="upcoming"
                                checked={formData.content.upcoming}
                                onChange={handleChange}
                            />
                            <span style={{ fontWeight: 600, color: 'var(--brand-accent)' }}>"Coming Soon" Badge</span>
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onCancel} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving} className="btn btn-primary">
                            {isSaving ? 'Saving...' : <><Save size={18} /> Save Project</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectForm;
