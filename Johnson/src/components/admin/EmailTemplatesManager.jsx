import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { toast } from '../../utils/toast';
import { Save, FileText, Mail, UserPlus, ShoppingBag, DownloadCloud, Gift, BellRing, CheckCircle, Inbox } from 'lucide-react';
import './AdminComponents.css';

const TEMPLATE_CONFIGS = [
    { id: 'welcome', label: 'Welcome Email', description: 'After signup', icon: UserPlus, color: '#10b981' },
    { id: 'purchase_confirmation', label: 'Order Confirmation', description: 'After purchase', icon: ShoppingBag, color: '#f59e0b' },
    { id: 'file_delivery', label: 'File Delivery', description: 'After confirmation', icon: DownloadCloud, color: '#0ea5e9' },
    { id: 'free_download', label: 'Free Download', description: 'Free resources', icon: Gift, color: '#f43f5e' },
    { id: 'admin_order_notification', label: 'Order Alert (To You)', description: 'New paid order', icon: BellRing, color: '#8b5cf6' },
    { id: 'contact_received', label: 'Contact Auto-Reply', description: 'After message', icon: CheckCircle, color: '#10b981' },
    { id: 'admin_contact_notification', label: 'Message Alert (To You)', description: 'New inquiry', icon: Inbox, color: '#ec4899' },
];

const TEMPLATE_PLACEHOLDERS = {
    welcome: ['name', 'site_url'],
    purchase_confirmation: ['name', 'product_title', 'amount_tzs', 'order_id', 'site_url', 'sale_event', 'sale_label'],
    file_delivery: ['name', 'product_title', 'file_url', 'order_id', 'site_url', 'sale_event', 'sale_label'],
    free_download: ['name', 'product_title', 'file_url', 'site_url', 'sale_event', 'sale_label'],
    admin_order_notification: ['name', 'customer_email', 'product_title', 'amount_tzs', 'order_id', 'site_url', 'sale_event'],
    contact_received: ['name', 'subject', 'site_url'],
    admin_contact_notification: ['name', 'customer_email', 'subject', 'sender_message', 'site_url'],
};

const EmailTemplatesManager = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('welcome');
    const [editingTemplate, setEditingTemplate] = useState({
        subject: '',
        content: ''
    });
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('code'); // 'code' | 'preview'

    const activeTemplateColor = TEMPLATE_CONFIGS.find(t => t.id === selectedType)?.color || '#10b981';

    const MOCK_DATA = {
        name: 'John Doe',
        site_url: 'https://johnsonsaimon.com',
        product_title: 'Ultimate 2026 Strategy Pack',
        amount_tzs: '50,000',
        order_id: 'ORD-123456',
        file_url: '#',
        sale_event: 'LIMITED LAUNCH OFFER',
        sale_label: 'SAVE 40% TODAY',
        customer_email: 'client@example.com',
        subject: 'Inquiry: Custom Web Design',
        sender_message: 'Hi Johnson, I really love your work on the recent portfolios. I would like to discuss a project for my creative agency.',
    };

    const getPreviewContent = (content) => {
        let preview = content;
        Object.entries(MOCK_DATA).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            preview = preview.replace(regex, value);
        });
        return preview;
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    useEffect(() => {
        if (templates.length > 0) {
            const template = templates.find(t => t.type === selectedType);
            if (template) {
                setEditingTemplate({
                    subject: template.subject,
                    content: template.content
                });
            }
        }
    }, [selectedType, templates]);

    const fetchTemplates = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('email_templates')
            .select('*')
            .order('type');

        if (error) {
            console.error('Error fetching templates:', error);
            toast.error('Failed to load email templates');
        } else {
            setTemplates(data || []);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!supabase) return;
        setSaving(true);
        const { error } = await supabase
            .from('email_templates')
            .update({
                subject: editingTemplate.subject,
                content: editingTemplate.content
            })
            .eq('type', selectedType);

        if (error) {
            toast.error('Failed to save template: ' + error.message);
        } else {
            toast.success('Template updated successfully!');
            fetchTemplates();
        }
        setSaving(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(`{{${text}}}`);
        toast.success(`Copied {{${text}}}`);
    };

    if (loading) return <div className="admin-loading">Loading templates...</div>;

    return (
        <div className="admin-component-container">
            {/* Vibrant Metrics Row */}
            <div className="admin-grid-3" style={{ marginBottom: '2rem' }}>
                <div className="stat-card themed-vibrant" style={{ '--tab-accent': '#10b981' }}>
                    <div className="stat-header">
                        <span className="stat-label">Template Status</span>
                        <div className="stat-icon"><CheckCircle size={18} /></div>
                    </div>
                    <div className="stat-value">{templates.length}</div>
                    <div className="stat-footer">Active email triggers</div>
                </div>
                <div className="stat-card themed-vibrant" style={{ '--tab-accent': '#8b5cf6' }}>
                    <div className="stat-header">
                        <span className="stat-label">System Triggers</span>
                        <div className="stat-icon"><BellRing size={18} /></div>
                    </div>
                    <div className="stat-value">Automated</div>
                    <div className="stat-footer">Instant response ready</div>
                </div>
                <div className="stat-card themed-vibrant" style={{ '--tab-accent': activeTemplateColor }}>
                    <div className="stat-header">
                        <span className="stat-label">Currently Editing</span>
                        <div className="stat-icon"><Mail size={18} /></div>
                    </div>
                    <div className="stat-value" style={{ fontSize: 'var(--fs-p1)' }}>{TEMPLATE_CONFIGS.find(t => t.id === selectedType)?.label}</div>
                    <div className="stat-footer">Multi-colored focus</div>
                </div>
            </div>

            <div className="admin-panel">
                <div className="panel-header">
                    <div>
                        <h3 style={{ border: 'none', margin: 0 }}>Template Ecosystem</h3>
                        <p style={{ margin: '4px 0 0', fontSize: 'var(--fs-p2)', color: '#64748b' }}>
                            Customize the automated emails sent to your customers.
                        </p>
                    </div>
                </div>

                <div className="template-editor-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', marginTop: '2rem' }}>
                    {/* Sidebar */}
                    <div className="template-sidebar">
                        <div className="template-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {TEMPLATE_CONFIGS.map(t => (
                                <button
                                    key={t.id}
                                    className={`admin-nav-item ${selectedType === t.id ? 'active' : ''}`}
                                    onClick={() => setSelectedType(t.id)}
                                    style={{ 
                                        textAlign: 'left', 
                                        padding: '1rem', 
                                        borderRadius: '12px',
                                        background: selectedType === t.id ? `${t.color}15` : 'transparent',
                                        border: '1px solid',
                                        borderColor: selectedType === t.id ? `${t.color}30` : 'transparent',
                                        color: selectedType === t.id ? '#0F172A' : '#64748b',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.85rem',
                                        fontSize: 'var(--fs-p2)',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    <div style={{ 
                                        width: '32px', 
                                        height: '32px', 
                                        borderRadius: '8px', 
                                        background: selectedType === t.id ? t.color : '#f1f5f9', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: selectedType === t.id ? '#fff' : t.color,
                                        transition: 'all 0.3s'
                                    }}>
                                        <t.icon size={18} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 700, color: selectedType === t.id ? '#0F172A' : '#475569' }}>{t.label}</span>
                                        <span style={{ fontSize: 'var(--fs-p2)', opacity: selectedType === t.id ? 0.7 : 0.8, color: selectedType === t.id ? '#0F172A' : '#64748b' }}>{t.description}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="template-main-content">
                        <div className="admin-form">
                            {/* Subject Field */}
                            <div className="form-group">
                                <label style={{ marginBottom: '0.6rem', display: 'block', fontSize: 'var(--fs-p2)', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Email Subject Line</label>
                                <input
                                    type="text"
                                    value={editingTemplate.subject}
                                    onChange={(e) => setEditingTemplate(prev => ({ ...prev, subject: e.target.value }))}
                                    placeholder="Enter email subject"
                                    style={{ 
                                        marginBottom: '2rem',
                                        backgroundColor: '#ffffff',
                                        color: '#000',
                                        border: `1px solid ${activeTemplateColor}30`,
                                        borderLeft: `5px solid ${activeTemplateColor}`,
                                        fontSize: 'var(--fs-p2)',
                                        fontWeight: 600,
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        width: '100%',
                                        boxShadow: `0 4px 20px ${activeTemplateColor}10`
                                    }}
                                />
                            </div>

                            {/* Content Editor / Preview */}
                            <div className="form-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1.25rem' }}>
                                    <label style={{ fontSize: 'var(--fs-p2)', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Body Architecture</label>
                                    <div style={{ display: 'flex', background: '#f8fafc', padding: '0.4rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                        <button 
                                            type="button"
                                            onClick={() => setActiveTab('code')}
                                            style={{
                                                padding: '0.6rem 1.4rem',
                                                fontSize: 'var(--fs-p2)',
                                                fontWeight: 800,
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: activeTab === 'code' ? `linear-gradient(135deg, ${activeTemplateColor} 0%, ${activeTemplateColor}CC 100%)` : 'transparent',
                                                color: activeTab === 'code' ? '#fff' : '#64748b',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.6rem',
                                                boxShadow: activeTab === 'code' ? `0 4px 15px ${activeTemplateColor}40` : 'none'
                                            }}
                                        >
                                            <FileText size={14} /> SOURCE CODE
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setActiveTab('preview')}
                                            style={{
                                                padding: '0.6rem 1.4rem',
                                                fontSize: 'var(--fs-p2)',
                                                fontWeight: 800,
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: activeTab === 'preview' ? `linear-gradient(135deg, ${activeTemplateColor} 0%, ${activeTemplateColor}CC 100%)` : 'transparent',
                                                color: activeTab === 'preview' ? '#fff' : '#64748b',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.6rem',
                                                boxShadow: activeTab === 'preview' ? `0 4px 15px ${activeTemplateColor}40` : 'none'
                                            }}
                                        >
                                            <Mail size={14} /> LIVE PREVIEW
                                        </button>
                                    </div>
                                </div>

                                {/* Placeholder ButtonsBar */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.25rem' }}>
                                    {TEMPLATE_PLACEHOLDERS[selectedType]?.map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => copyToClipboard(p)}
                                            style={{
                                                fontSize: 'var(--fs-p2)',
                                                padding: '0.4rem 0.85rem',
                                                background: '#fff',
                                                border: `1px solid ${activeTemplateColor}20`,
                                                borderRadius: '8px',
                                                color: activeTemplateColor,
                                                cursor: 'pointer',
                                                fontWeight: 700,
                                                transition: 'all 0.2s'
                                            }}
                                            title="Click to copy"
                                            onMouseOver={(e) => e.target.style.background = `${activeTemplateColor}10`}
                                            onMouseOut={(e) => e.target.style.background = '#fff'}
                                        >
                                            <span style={{ opacity: 0.5, marginRight: '2px' }}>{`{{`}</span>
                                            {p}
                                            <span style={{ opacity: 0.5, marginLeft: '2px' }}>{`}}`}</span>
                                        </button>
                                    ))}
                                </div>
                                
                                {activeTab === 'code' ? (
                                    <textarea
                                        value={editingTemplate.content}
                                        onChange={(e) => setEditingTemplate(prev => ({ ...prev, content: e.target.value }))}
                                        rows="20"
                                        style={{ 
                                            fontFamily: '"Fira Code", "JetBrains Mono", monospace', 
                                            lineHeight: '1.7', 
                                            fontSize: 'var(--fs-p2)',
                                            backgroundColor: '#0f172a',
                                            color: '#f1f5f9',
                                            border: `1px solid ${activeTemplateColor}30`,
                                            padding: '2rem',
                                            borderRadius: '16px',
                                            width: '100%',
                                            outline: 'none',
                                            resize: 'vertical',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                        }}
                                    />
                                ) : (
                                    <div style={{ 
                                        backgroundColor: '#fafafa', 
                                        borderRadius: '16px', 
                                        overflow: 'hidden', 
                                        border: `1px solid ${activeTemplateColor}20`,
                                        height: '600px',
                                        position: 'relative',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <iframe
                                            title="Email Preview"
                                            srcDoc={getPreviewContent(editingTemplate.content)}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                border: 'none',
                                                background: '#fff'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Save Action */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem' }}>
                                <button
                                    className="admin-submit-btn"
                                    onClick={handleSave}
                                    disabled={saving}
                                    style={{ 
                                        width: 'auto', 
                                        padding: '1rem 3rem', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '0.85rem',
                                        backgroundColor: activeTemplateColor,
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '14px',
                                        fontWeight: 800,
                                        fontSize: 'var(--fs-p2)',
                                        cursor: 'pointer',
                                        boxShadow: `0 8px 25px ${activeTemplateColor}40`,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    {saving ? 'Saving System Updates...' : <><Save size={20} /> DEPLOY TEMPLATE CHANGES</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailTemplatesManager;
