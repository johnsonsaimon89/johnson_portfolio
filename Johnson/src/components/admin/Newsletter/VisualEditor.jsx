import { toast } from '../../../utils/toast';
import React, { useRef, useState, useEffect } from 'react';
import EmailEditor from 'react-email-editor';
import { Save, ArrowLeft, Send } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

const VisualEditor = ({ campaignId, onBack }) => {
    const emailEditorRef = useRef(null);
    const [subject, setSubject] = useState('');
    const [segmentTags, setSegmentTags] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTagsDropdown, setShowTagsDropdown] = useState(false);

    useEffect(() => {
        if (campaignId) {
            loadCampaign();
        }
        fetchAvailableTags();
    }, [campaignId]);

    const fetchAvailableTags = async () => {
        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .select('tags');

        if (data) {
            const allTags = new Set();
            data.forEach(sub => {
                if (sub.tags && Array.isArray(sub.tags)) {
                    sub.tags.forEach(t => allTags.add(t));
                }
            });
            setAvailableTags(Array.from(allTags));
        }
    };

    const toggleTag = (tag) => {
        const currentTags = segmentTags.split(',').map(t => t.trim()).filter(Boolean);
        if (currentTags.includes(tag)) {
            setSegmentTags(currentTags.filter(t => t !== tag).join(', '));
        } else {
            setSegmentTags([...currentTags, tag].join(', '));
        }
    };

    const loadCampaign = async () => {
        const { data, error } = await supabase
            .from('newsletter_campaigns')
            .select('*')
            .eq('id', campaignId)
            .single();

        if (data) {
            setSubject(data.subject);
            setSegmentTags((data.segment_tags || []).join(', '));
        }
    };

    const onLoad = () => {
        // Load existing design if we are editing
        if (campaignId) {
            supabase
                .from('newsletter_campaigns')
                .select('content_json')
                .eq('id', campaignId)
                .single()
                .then(({ data }) => {
                    if (data && data.content_json && emailEditorRef.current) {
                        emailEditorRef.current.editor.loadDesign(data.content_json);
                    }
                });
        }
    };

    const handleSave = (status = 'draft') => {
        if (!subject) {
            toast.info('Please enter a subject line.');
            return;
        }

        if (emailEditorRef.current) {
            setLoading(true);
            emailEditorRef.current.editor.exportHtml(async (data) => {
                const { design, html } = data;

                const tagsArray = segmentTags.split(',').map(t => t.trim()).filter(t => t);

                const payload = {
                    subject,
                    content_html: html,
                    content_json: design,
                    status: status,
                    segment_tags: tagsArray.length > 0 ? tagsArray : null,
                    updated_at: new Date()
                };

                let result;
                if (campaignId) {
                    result = await supabase
                        .from('newsletter_campaigns')
                        .update(payload)
                        .eq('id', campaignId);
                } else {
                    result = await supabase
                        .from('newsletter_campaigns')
                        .insert([payload]);
                }

                if (result.error) {
                    toast.error('Error saving campaign: ' + result.error.message);
                } else {
                    toast.success(`Campaign saved as ${status}!`);
                    if (status === 'draft') {
                        onBack();
                    }
                }
                setLoading(false);
            });
        }
    };

    const handleSendNow = async () => {
        if (!confirm('Are you sure you want to SEND this campaign right now? This will queue the broadcast.')) return;

        // Save first, then we can trigger send process via Edge Function.
        handleSave('sending');
        // Actually, we should trigger sending logic from CampaignsTab to keep it consistent, 
        // or doing it right here. Let's just save as draft and let the CampaignsTab handle the sending, 
        // or call the resend logic here. 
        // For simplicity, we just save and tell user to send from the campaign list.
        toast.success("Campaign saved. Please send it from the Campaigns List tab to see active sending status.");
        onBack();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '1rem', background: '#f9fafb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                    <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', padding: '0.5rem' }}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <div style={{ flex: 1, maxWidth: '500px' }}>
                        <input
                            type="text"
                            placeholder="Campaign Subject Line..."
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', fontSize: '1.2rem', border: 'none', borderBottom: '2px solid #e5e7eb', background: 'transparent', outline: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative' }}>
                        <div
                            onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                            style={{
                                width: '250px',
                                padding: '0.4rem',
                                fontSize: '0.875rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                background: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                            title="Leave blank to send to everyone"
                        >
                            <span style={{ color: segmentTags ? '#111827' : '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {segmentTags || 'Target Audience: Everyone'}
                            </span>
                        </div>

                        {showTagsDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '250px',
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '4px',
                                marginTop: '4px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                zIndex: 10,
                                padding: '0.5rem',
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Select Segments</div>
                                {availableTags.length === 0 ? (
                                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>No tags found in subscribers.</div>
                                ) : (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {availableTags.map(tag => {
                                            const isSelected = segmentTags.split(',').map(t => t.trim()).filter(Boolean).includes(tag);
                                            return (
                                                <div
                                                    key={tag}
                                                    onClick={() => toggleTag(tag)}
                                                    style={{
                                                        fontSize: '12px',
                                                        padding: '4px 8px',
                                                        borderRadius: '100px',
                                                        cursor: 'pointer',
                                                        background: isSelected ? '#111827' : '#f3f4f6',
                                                        color: isSelected ? '#fff' : '#374151',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {tag}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                <div style={{ marginTop: '0.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Or type custom tags..."
                                        value={segmentTags}
                                        onChange={(e) => setSegmentTags(e.target.value)}
                                        style={{ width: '100%', padding: '0.4rem', fontSize: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => handleSave('draft')}
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e5e7eb', color: '#374151', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                    >
                        <Save size={16} /> Save Draft
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <EmailEditor
                    ref={emailEditorRef}
                    onLoad={onLoad}
                    options={{
                        appearance: {
                            theme: 'light',
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default VisualEditor;
