import React, { useState } from 'react';
import { X, Plus, Trash2, Eye } from 'lucide-react';
import ImageUploader from './ImageUploader';

const CaseStudyForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        organization_name: initialData?.organization_name || '',
        organization_type: initialData?.organization_type || '', // used as Category
        is_active: initialData?.is_active ?? true,
        content: initialData?.content || {
            title: '',
            url: '',
            context: '',
            challenge: '',
            role: '',
            approach: '',
            image: '',
            impact: []
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            content: { ...prev.content, [field]: value }
        }));
    };

    const addImpact = () => {
        setFormData(prev => ({
            ...prev,
            content: { ...prev.content, impact: [...(prev.content.impact || []), ''] }
        }));
    };

    const updateImpact = (index, value) => {
        setFormData(prev => {
            const newImpact = [...(prev.content.impact || [])];
            newImpact[index] = value;
            return { ...prev, content: { ...prev.content, impact: newImpact } };
        });
    };

    const removeImpact = (index) => {
        setFormData(prev => ({
            ...prev,
            content: { ...prev.content, impact: (prev.content.impact || []).filter((_, i) => i !== index) }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ 
            ...formData, 
            type: 'web' // Using 'web' to satisfy the existing DB constraint
        });
    };

    const getWordCount = (str) => {
        return (str || '').match(/\S+/g)?.length || 0;
    };

    const WordCounter = ({ text, limit }) => {
        const count = getWordCount(text);
        const isOver = count > limit;
        return (
            <div style={{ textAlign: 'right', marginTop: '0.25rem' }}>
                <small style={{ color: isOver ? '#ef4444' : '#666', fontWeight: isOver ? '600' : 'normal' }}>
                    {count} / {limit} words recommended
                </small>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form refined-form">
            <div className="form-section-header">
                <h4>General Details (All Optional)</h4>
            </div>
            
            <div className="form-row">
                <div className="form-group half">
                    <label>Title</label>
                    <input type="text" value={formData.content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} placeholder="e.g. Building a Stronger Digital Home..." />
                </div>
                <div className="form-group half" style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1.8rem' }}>
                    <input 
                        type="checkbox" 
                        id="is_active" 
                        name="is_active" 
                        checked={formData.is_active} 
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))} 
                        style={{ width: '20px', height: '20px', accentColor: 'var(--tab-accent, #6366f1)' }}
                    />
                    <label htmlFor="is_active" style={{ marginBottom: 0, cursor: 'pointer' }}>Publicly Visible</label>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group half">
                    <label>Organization Name</label>
                    <input type="text" name="organization_name" value={formData.organization_name} onChange={handleInputChange} placeholder="e.g. AFRISOS" />
                </div>
                <div className="form-group half">
                    <label>Category / Industry</label>
                    <input type="text" name="organization_type" value={formData.organization_type} onChange={handleInputChange} placeholder="e.g. NGO & Conservation" />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group half">
                    <label>Project URL</label>
                    <input type="url" value={formData.content.url || ''} onChange={(e) => handleContentChange('url', e.target.value)} placeholder="https://example.com" />
                </div>
                <div className="form-group half">
                    <label>Cover Image URL</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="text" value={formData.content.image || ''} onChange={(e) => handleContentChange('image', e.target.value)} placeholder="/projects/image.png" style={{ flex: 1 }} />
                        <ImageUploader onUploadSuccess={(url) => handleContentChange('image', url)} currentImageUrl={formData.content.image} />
                    </div>
                </div>
            </div>

            <div className="form-divider" />

            <div className="form-section-header mt-2">
                <h4>Storytelling Content (All Optional)</h4>
            </div>

            <div className="form-group">
                <label>Context</label>
                <textarea value={formData.content.context || ''} onChange={(e) => handleContentChange('context', e.target.value)} placeholder="Explain the background..." rows="3" />
                <WordCounter text={formData.content.context} limit={60} />
            </div>

            <div className="form-group">
                <label>Challenge</label>
                <textarea value={formData.content.challenge || ''} onChange={(e) => handleContentChange('challenge', e.target.value)} placeholder="What was the core problem?" rows="3" />
                <WordCounter text={formData.content.challenge} limit={60} />
            </div>

            <div className="form-group">
                <label>My Role</label>
                <textarea value={formData.content.role || ''} onChange={(e) => handleContentChange('role', e.target.value)} placeholder="What were you responsible for?" rows="2" />
                <WordCounter text={formData.content.role} limit={40} />
            </div>

            <div className="form-group">
                <label>Approach</label>
                <textarea value={formData.content.approach || ''} onChange={(e) => handleContentChange('approach', e.target.value)} placeholder="How did you solve it?" rows="3" />
                <WordCounter text={formData.content.approach} limit={60} />
            </div>

            <div className="form-section-header mt-3">
                <h4>Impact Metrics (Optional)</h4>
            </div>
            
            <div className="form-group">
                {(formData.content.impact || []).map((imp, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                        <input type="text" value={imp} onChange={(e) => updateImpact(idx, e.target.value)} placeholder="e.g. Reached 250K+ targeted viewers" style={{ flex: 1 }} />
                        <button type="button" onClick={() => removeImpact(idx)} className="action-btn delete" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addImpact} className="premium-add-btn secondary-outline" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '0.5rem 1rem' }}>
                    <Plus size={14} /> Add Metric
                </button>
            </div>

            <div className="form-actions mt-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="premium-submit-btn">
                        {initialData ? 'Update Case Study' : 'Publish Case Study'}
                    </button>
                    <button type="button" onClick={onCancel} className="premium-cancel-btn">Discard Changes</button>
                </div>
                
                {/* Preview Button */}
                <a href="/work" target="_blank" rel="noopener noreferrer" className="premium-add-btn secondary-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <Eye size={16} /> Preview on Live Site
                </a>
            </div>

            <style jsx>{`
                .refined-form { max-width: 800px; margin: 0 auto; }
                .form-section-header { margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #f0f0f0; }
                .form-section-header h4 { margin: 0; color: #111; font-size: var(--fs-p2); text-transform: uppercase; letter-spacing: 0.05em; }
                .form-divider { height: 1px; background: #eee; margin: 2.5rem 0; }
                .premium-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1rem; }
                .form-actions { padding-top: 2rem; border-top: 1px solid #eee; }
                .premium-submit-btn { padding: 0.8rem 2rem; background: var(--tab-accent, #6366f1); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .premium-submit-btn:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }
                .premium-cancel-btn { padding: 0.8rem 1.5rem; background: transparent; color: #666; border: 1px solid #ddd; border-radius: 8px; font-weight: 500; cursor: pointer; }
                .premium-cancel-btn:hover { background: #f5f5f5; color: #333; }
                .premium-add-btn.secondary-outline { background: transparent; border: 1px solid #ddd; color: #666; cursor: pointer; border-radius: 8px; transition: all 0.2s; }
                .premium-add-btn.secondary-outline:hover { background: var(--tab-accent, #6366f1); border-color: var(--tab-accent, #6366f1); color: #fff; }
            `}</style>
        </form>
    );
};

export default CaseStudyForm;
