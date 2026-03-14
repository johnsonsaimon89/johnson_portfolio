import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Maximize2, PlayCircle } from 'lucide-react';
import ImageUploader from './ImageUploader';

const CaseStudyForm = ({ initialData, onSave, onCancel, type: initialType }) => {
    const [type, setType] = useState(initialType || initialData?.type || 'web');
    const [formData, setFormData] = useState({
        organization_type: initialData?.organization_type || '',
        organization_name: initialData?.organization_name || '',
        is_active: initialData?.is_active ?? true,
        content: initialData?.content || {
            paragraphs: ['', '', ''],
            metrics: { visitors: '', sales: '', signups: '' },
            custom_metrics: [],
            challenges: ['', '', '', '', ''],
            solution: '',
            tool_stack: '',
            website_url: '',
            preview_image_url: '',
            media_items: initialData?.media_items || [],
            colors: ['#6366f1', '#1e293b', '#f8fafc'],
            before_after: {
                engagement: { before: '', after: '' },
                reach: { before: '', after: '' },
                followers: { before: '', after: '' },
                buyers: { before: '', after: '' }
            }
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (field, value, index = null) => {
        setFormData(prev => {
            const newContent = { ...prev.content };
            if (index !== null && Array.isArray(newContent[field])) {
                newContent[field][index] = value;
            } else {
                newContent[field] = value;
            }
            return { ...prev, content: newContent };
        });
    };

    const handleMetricChange = (metric, value, isBeforeAfter = false, typeBA = 'before') => {
        setFormData(prev => {
            const newContent = { ...prev.content };
            if (isBeforeAfter) {
                if (!newContent.before_after) newContent.before_after = {
                    engagement: { before: '', after: '' },
                    reach: { before: '', after: '' },
                    followers: { before: '', after: '' },
                    buyers: { before: '', after: '' }
                };
                if (!newContent.before_after[metric]) newContent.before_after[metric] = { before: '', after: '' };
                newContent.before_after[metric][typeBA] = value;
            } else {
                if (!newContent.metrics) newContent.metrics = {};
                newContent.metrics[metric] = value;
            }
            return { ...prev, content: newContent };
        });
    };

    const addMediaItem = (url) => {
        setFormData(prev => ({
            ...prev,
            content: {
                ...prev.content,
                media_items: [...(prev.content.media_items || []), url]
            }
        }));
    };

    const removeMediaItem = (index) => {
        setFormData(prev => ({
            ...prev,
            content: {
                ...prev.content,
                media_items: prev.content.media_items.filter((_, i) => i !== index)
            }
        }));
    };

    const addCustomMetric = () => {
        setFormData(prev => ({
            ...prev,
            content: {
                ...prev.content,
                custom_metrics: [...(prev.content.custom_metrics || []), { label: '', value: '' }]
            }
        }));
    };

    const updateCustomMetric = (index, field, value) => {
        setFormData(prev => {
            const newMetrics = [...prev.content.custom_metrics];
            newMetrics[index][field] = value;
            return {
                ...prev,
                content: { ...prev.content, custom_metrics: newMetrics }
            };
        });
    };

    const removeCustomMetric = (index) => {
        setFormData(prev => ({
            ...prev,
            content: {
                ...prev.content,
                custom_metrics: prev.content.custom_metrics.filter((_, i) => i !== index)
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Flatten media_items into the root for database compatibility if needed, 
        // but here we keep it in content or update the root.
        // The migration adds it to the root, so let's sync.
        onSave({ 
            ...formData, 
            type,
            media_items: formData.content.media_items 
        });
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form refined-form">
            <div className="form-section-header">
                <h4>General Information</h4>
            </div>
            
            <div className="form-row">
                <div className="form-group half">
                    <label>Case Study Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} disabled={!!initialData} className="premium-select">
                        <option value="web">Web Studio</option>
                        <option value="social">Social Media</option>
                    </select>
                </div>
                <div className="form-group half">
                    <label>Visibility</label>
                    <select name="is_active" value={formData.is_active} onChange={handleInputChange} className="premium-select">
                        <option value={true}>Publicly Visible</option>
                        <option value={false}>Hidden / Draft</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group half">
                    <label>Organization Name</label>
                    <input type="text" name="organization_name" value={formData.organization_name} onChange={handleInputChange} required placeholder="e.g. EduLearn" />
                </div>
                <div className="form-group half">
                    <label>Industry / Vertical</label>
                    <input type="text" name="organization_type" value={formData.organization_type} onChange={handleInputChange} required placeholder="e.g. Fintech Tech" />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group half">
                    <label>Tool Stack (comma separated)</label>
                    <input 
                        type="text" 
                        value={formData.content.tool_stack || ''} 
                        onChange={(e) => handleContentChange('tool_stack', e.target.value)} 
                        placeholder="e.g. React, Framer Motion, Supabase" 
                    />
                </div>
                <div className="form-group half">
                    <label>Website URL (for preview)</label>
                    <input 
                        type="url" 
                        value={formData.content.website_url || ''} 
                        onChange={(e) => handleContentChange('website_url', e.target.value)} 
                        placeholder="https://example.com" 
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Preview Screenshot URL (Manual Path or Link)</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input 
                            type="text" 
                            style={{ flex: 1 }}
                            value={formData.content.preview_image_url || ''} 
                            onChange={(e) => handleContentChange('preview_image_url', e.target.value)} 
                            placeholder="e.g. /projects/screenshot1.png" 
                        />
                        <ImageUploader 
                            onUploadSuccess={(url) => handleContentChange('preview_image_url', url)}
                            currentImageUrl={formData.content.preview_image_url}
                        />
                    </div>
                    <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                        Use this if the website blocks being shown in a frame (Standard for many high-security sites).
                    </small>
                </div>
            </div>

            <div className="form-divider" />

            {type === 'web' ? (
                <>
                    <div className="form-section-header mt-2">
                        <h4>Narrative (Web Studio)</h4>
                    </div>
                    <div className="form-group">
                        <label>Description Paragraphs</label>
                        {formData.content.paragraphs.map((p, i) => (
                            <textarea
                                key={i}
                                value={p}
                                onChange={(e) => handleContentChange('paragraphs', e.target.value, i)}
                                placeholder={`Paragraph ${i + 1} - Briefly explain the problem or solution...`}
                                rows="3"
                                className="mt-1"
                            />
                        ))}
                    </div>

                    <div className="form-section-header mt-2">
                        <h4>Brand Aesthetic</h4>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Color Palette (3 Colors)</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {[0, 1, 2].map(idx => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <input 
                                            type="color" 
                                            value={formData.content.colors?.[idx] || '#000000'} 
                                            onChange={(e) => {
                                                const newColors = [...(formData.content.colors || ['#000000', '#000000', '#000000'])];
                                                newColors[idx] = e.target.value;
                                                handleContentChange('colors', newColors);
                                            }}
                                            style={{ width: '60px', height: '40px', padding: '2px', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                        <input 
                                            type="text" 
                                            value={formData.content.colors?.[idx] || '#000000'}
                                            onChange={(e) => {
                                                const newColors = [...(formData.content.colors || ['#000000', '#000000', '#000000'])];
                                                newColors[idx] = e.target.value;
                                                handleContentChange('colors', newColors);
                                            }}
                                            style={{ fontSize: '0.7rem', width: '60px', textAlign: 'center' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="form-section-header mt-2">
                        <h4>Core Metrics</h4>
                    </div>
                    <div className="form-row">
                        <div className="form-group third">
                            <label>Visitors</label>
                            <input type="text" value={formData.content.metrics?.visitors || ''} onChange={(e) => handleMetricChange('visitors', e.target.value)} placeholder="e.g. +63%" />
                        </div>
                        <div className="form-group third">
                            <label>Sales / Revenue</label>
                            <input type="text" value={formData.content.metrics?.sales || ''} onChange={(e) => handleMetricChange('sales', e.target.value)} placeholder="e.g. $12.5k" />
                        </div>
                        <div className="form-group third">
                            <label>Signup Rate</label>
                            <input type="text" value={formData.content.metrics?.signups || ''} onChange={(e) => handleMetricChange('signups', e.target.value)} placeholder="e.g. +22%" />
                        </div>
                    </div>


                    <div className="form-group mt-1">
                        <label>Custom Metrics</label>
                        {formData.content.custom_metrics?.map((m, i) => (
                            <div key={i} className="form-row align-center mb-1">
                                <input type="text" placeholder="Label" value={m.label} onChange={(e) => updateCustomMetric(i, 'label', e.target.value)} style={{ flex: 1 }} />
                                <input type="text" placeholder="Value" value={m.value} onChange={(e) => updateCustomMetric(i, 'value', e.target.value)} style={{ flex: 1 }} />
                                <button type="button" onClick={() => removeCustomMetric(i)} className="action-btn delete"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={addCustomMetric} className="studio-btn studio-btn-outline" style={{ marginTop: '0.5rem' }}>
                            <Plus size={16} /> Add Custom Metric
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="form-section-header">
                        <h4>Strategic Breakdown (Social Media)</h4>
                    </div>
                    
                    <div className="form-group">
                        <label>The Solution</label>
                        <textarea
                            value={formData.content.solution}
                            onChange={(e) => handleContentChange('solution', e.target.value)}
                            placeholder="Describe how you solved the client's problem..."
                            rows="4"
                        />
                    </div>

                    <div className="form-section-header mt-2">
                        <h4>Challenges (5 Items)</h4>
                    </div>
                    <div className="challenges-grid">
                        {formData.content.challenges.map((c, i) => (
                            <div key={i} className="challenge-input-wrapper">
                                <span className="x-bullet">×</span>
                                <input
                                    type="text"
                                    value={c}
                                    onChange={(e) => handleContentChange('challenges', e.target.value, i)}
                                    placeholder={`Challenge ${i + 1}`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="form-group">
                        <label>Media Items (Carousel Content)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            {formData.content.media_items?.map((item, idx) => (
                                <div key={idx} className="image-preview-container">
                                    {item.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                                        <>
                                            <video src={item} className="video-preview" muted loop playsInline onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                                            <div className="video-indicator">
                                                <PlayCircle size={10} /> VIDEO
                                            </div>
                                        </>
                                    ) : (
                                        <img src={item} alt="" className="image-preview" />
                                    )}
                                    
                                    <div className="preview-actions-overlay">
                                        <button type="button" className="preview-action-btn" onClick={() => window.open(item, '_blank')} title="View Full">
                                            <Maximize2 size={16} />
                                        </button>
                                        <button type="button" className="preview-action-btn remove" onClick={() => removeMediaItem(idx)} title="Remove">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="image-uploader-wrapper">
                                <ImageUploader
                                    bucketName="portfolio_images"
                                    onUploadSuccess={addMediaItem}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section-header mt-2">
                        <h4>Content Deliverables (e.g. Reels, Polls)</h4>
                    </div>
                    <div className="form-group">
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', background: '#f9fafb', padding: '1rem', borderRadius: '12px', border: '1px solid #eee' }}>
                            {(formData.content.content_types || []).map((type, idx) => (
                                <span key={idx} style={{ background: '#000', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {type}
                                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => {
                                        const newTypes = formData.content.content_types.filter((_, i) => i !== idx);
                                        handleContentChange('content_types', newTypes);
                                    }} />
                                </span>
                            ))}
                            {(!formData.content.content_types || formData.content.content_types.length === 0) && (
                                <span style={{ color: '#999', fontSize: '0.8rem' }}>No deliverables added yet.</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="text" 
                                id="new-tag-input"
                                placeholder="Add new deliverable (e.g. Quizzes)" 
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = e.target.value.trim();
                                        if (val) {
                                            const current = formData.content.content_types || [];
                                            handleContentChange('content_types', [...current, val]);
                                            e.target.value = '';
                                        }
                                    }
                                }}
                            />
                            <button 
                                type="button" 
                                className="studio-btn studio-btn-outline"
                                onClick={() => {
                                    const input = document.getElementById('new-tag-input');
                                    const val = input.value.trim();
                                    if (val) {
                                        const current = formData.content.content_types || [];
                                        handleContentChange('content_types', [...current, val]);
                                        input.value = '';
                                    }
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="form-section-header mt-2">
                        <h4>Performance Tracking (Before & After)</h4>
                    </div>
                    <div className="metrics-comparison-grid">
                        {['engagement', 'reach', 'followers', 'buyers'].map(metric => (
                            <div key={metric} className="metric-comp-card">
                                <label className="metric-name">{metric}</label>
                                <div className="comp-inputs">
                                    <input
                                        type="text"
                                        placeholder="Before"
                                        value={formData.content.before_after?.[metric]?.before || ''}
                                        onChange={(e) => handleMetricChange(metric, e.target.value, true, 'before')}
                                    />
                                    <div className="comp-arrow">→</div>
                                    <input
                                        type="text"
                                        placeholder="After"
                                        value={formData.content.before_after?.[metric]?.after || ''}
                                        onChange={(e) => handleMetricChange(metric, e.target.value, true, 'after')}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="form-actions mt-3">
                <button type="submit" className="premium-submit-btn">
                    {initialData ? 'Update Case Study' : 'Publish Case Study'}
                </button>
                <button type="button" onClick={onCancel} className="premium-cancel-btn">Discard Changes</button>
            </div>

            <style jsx>{`
                .refined-form {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .form-section-header {
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #f0f0f0;
                }
                .form-section-header h4 {
                    margin: 0;
                    color: #111;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .form-divider {
                    height: 1px;
                    background: #eee;
                    margin: 2.5rem 0;
                }
                .premium-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0.75rem center;
                    background-size: 1rem;
                }
                .challenges-grid {
                    display: grid;
                    gap: 0.75rem;
                }
                .challenge-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: #f9fafb;
                    padding: 0.25rem 1rem;
                    border-radius: 8px;
                    border: 1px solid #eee;
                }
                .x-bullet {
                    color: #ef4444;
                    font-weight: 800;
                    font-size: 1.2rem;
                }
                .metrics-comparison-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .metric-comp-card {
                    background: #fff;
                    border: 1px solid #eee;
                    padding: 1.25rem;
                    border-radius: 12px;
                }
                .metric-name {
                    display: block;
                    margin-bottom: 1rem !important;
                    font-weight: 700 !important;
                    color: #111 !important;
                    text-transform: capitalize !important;
                }
                .comp-inputs {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .comp-arrow {
                    color: #9ca3af;
                }
                .form-actions {
                    display: flex;
                    gap: 1rem;
                    padding-top: 2rem;
                    border-top: 1px solid #eee;
                }
                .premium-submit-btn {
                    padding: 0.8rem 2rem;
                    background: #000;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .premium-submit-btn:hover {
                    background: #333;
                    transform: translateY(-1px);
                }
                .premium-cancel-btn {
                    padding: 0.8rem 1.5rem;
                    background: transparent;
                    color: #666;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                }
                .premium-cancel-btn:hover {
                    background: #f5f5f5;
                    color: #333;
                }
            `}</style>
        </form>
    );
};

export default CaseStudyForm;
