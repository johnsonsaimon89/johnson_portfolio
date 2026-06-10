import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Mail, Send, Loader2, Code, Eye } from 'lucide-react';
import { toast } from '../../utils/toast';

const EmailBroadcastManager = () => {
    const [subject, setSubject] = useState('');
    const [emailHtml, setEmailHtml] = useState('');
    const [sending, setSending] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    const handleSendBroadcast = async () => {
        if (!subject || !emailHtml) {
            toast.error("Please provide both a subject and email content.");
            return;
        }

        toast.confirm(`Are you sure you want to send this email to ALL subscribers?`, async () => {
            setSending(true);
            try {
                // 1. Fetch all subscribers
                const { data: subscribers, error: fetchError } = await supabase
                    .from('newsletter_subscribers')
                    .select('email, name');

                if (fetchError) throw fetchError;
                if (!subscribers || subscribers.length === 0) {
                    toast.error("No subscribers found to send to.");
                    return;
                }

                toast.info(`Starting broadcast to ${subscribers.length} subscribers...`);

                // 2. Trigger emails via the Edge Function
                // We'll send them in batches or one by one depending on the Edge Function's capability.
                // Since our current send-email function handles single emails, we'll loop.
                // Optimization: A dedicated broadcast edge function would be better for large lists.
                
                let successCount = 0;
                for (const sub of subscribers) {
                    try {
                        const { error: sendError } = await supabase.functions.invoke('send-email', {
                            body: {
                                to: sub.email,
                                subject: subject,
                                html: emailHtml,
                                name: sub.name || 'Subscriber'
                            }
                        });
                        if (!sendError) successCount++;
                    } catch (err) {
                        console.error(`Failed to send to ${sub.email}:`, err);
                    }
                }

                toast.success(`Broadcast complete! Successfully sent to ${successCount}/${subscribers.length} subscribers.`);
                setSubject('');
                setEmailHtml('');
            } catch (error) {
                console.error('Broadcast Error:', error);
                toast.error("Failed to execute broadcast: " + error.message);
            } finally {
                setSending(false);
            }
        });
    };

    return (
        <div className="admin-component-container">
            <div className="admin-panel">
                <div className="panel-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '8px', background: '#ec4899', borderRadius: '8px', color: '#fff', display: 'flex' }}>
                            <Send size={18} />
                        </div>
                        <h3 style={{ margin: 0 }}>Email Broadcast Campaign</h3>
                    </div>
                    <button 
                        className="btn-outline" 
                        onClick={() => setPreviewMode(!previewMode)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {previewMode ? <Code size={16} /> : <Eye size={16} />}
                        {previewMode ? 'Back to Editor' : 'Preview HTML'}
                    </button>
                </div>

                <div className="admin-form mt-2">
                    <div className="form-group">
                        <label>Email Subject Line</label>
                        <input 
                            type="text" 
                            value={subject} 
                            onChange={(e) => setSubject(e.target.value)} 
                            placeholder="e.g., Big News: Our Special Event is Live! 🚀"
                            disabled={sending}
                        />
                    </div>

                    {!previewMode ? (
                        <div className="form-group">
                            <label>Email HTML Content</label>
                            <textarea 
                                value={emailHtml} 
                                onChange={(e) => setEmailHtml(e.target.value)} 
                                placeholder="Paste your HTML template code here..."
                                style={{ height: '400px', fontFamily: 'monospace', fontSize: '13px' }}
                                disabled={sending}
                            />
                            <p style={{ fontSize: 'var(--fs-p2)', color: '#64748b', marginTop: '0.5rem' }}>
                                Tip: Use <code>{"{{name}}"}</code> to personalize with the subscriber's name.
                            </p>
                        </div>
                    ) : (
                        <div className="form-group">
                            <label>Template Preview</label>
                            <div 
                                style={{ 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: '8px', 
                                    padding: '1rem', 
                                    background: '#fff', 
                                    minHeight: '400px', 
                                    overflowY: 'auto' 
                                }}
                                dangerouslySetInnerHTML={{ __html: emailHtml || '<p style="color: #94a3b8; text-align: center; margin-top: 100px;">No content to preview</p>' }}
                            />
                        </div>
                    )}

                    <button 
                        className="admin-submit-btn" 
                        style={{ background: '#ec4899', border: 'none', marginTop: '1rem' }}
                        onClick={handleSendBroadcast}
                        disabled={sending || !subject || !emailHtml}
                    >
                        {sending ? (
                            <><Loader2 size={18} className="spin" /> Sending Broadcast...</>
                        ) : (
                            <><Send size={18} /> Launch Campaign to All Subscribers</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailBroadcastManager;
