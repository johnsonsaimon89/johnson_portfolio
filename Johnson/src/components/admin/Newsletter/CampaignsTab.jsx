import { toast } from '../../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Mail, Edit3, Send, Trash2, Calendar, BarChart2 } from 'lucide-react';

const CampaignsTab = ({ onEditCampaign }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendingId, setSendingId] = useState(null);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('newsletter_campaigns')
            .select('id, subject, status, send_date, segment_tags, sent_count, open_count, click_count, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching campaigns:', error);
            if (error.code === '42P01') {
                setCampaigns([]);
            }
        } else {
            setCampaigns(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) return;

        const { error } = await supabase
            .from('newsletter_campaigns')
            .delete()
            .eq('id', id);

        if (error) toast.error('Error: ' + error.message);
        else fetchCampaigns();
    };

    const handleSend = async (campaign) => {
        if (!window.confirm(`Are you sure you want to send "${campaign.subject}" now?`)) return;

        setSendingId(campaign.id);

        try {
            // 1. Fetch full campaign data to get content_html
            const { data: fullCampaign, error: fetchError } = await supabase
                .from('newsletter_campaigns')
                .select('*')
                .eq('id', campaign.id)
                .single();

            if (fetchError || !fullCampaign.content_html) {
                throw new Error(fetchError?.message || "Missing HTML content");
            }

            // 2. Fetch subscribers based on segment tags
            let query = supabase.from('newsletter_subscribers').select('email');

            if (fullCampaign.segment_tags && fullCampaign.segment_tags.length > 0) {
                query = query.overlaps('tags', fullCampaign.segment_tags);
            }

            const { data: subs, error: subsError } = await query;

            if (subsError) throw new Error(subsError.message);
            if (!subs || subs.length === 0) {
                toast.error("No subscribers found matching this segment.");
                setSendingId(null);
                return;
            }

            const emails = subs.map(s => s.email);

            // 3. Call the Edge Function
            const { data: edgeData, error: edgeError } = await supabase.functions.invoke('send-email', {
                body: {
                    type: 'newsletter_broadcast',
                    email: emails,
                    subject: fullCampaign.subject,
                    htmlContent: fullCampaign.content_html
                }
            });

            if (edgeError || (edgeData && edgeData.error)) {
                console.error("Sending error:", edgeError || edgeData.error);
                throw new Error((edgeError?.message) || JSON.stringify(edgeData.error));
            }

            // 4. Update campaign status to 'sent'
            const { error: updateError } = await supabase
                .from('newsletter_campaigns')
                .update({
                    status: 'sent',
                    send_date: new Date(),
                    sent_count: emails.length
                })
                .eq('id', campaign.id);

            if (updateError) throw new Error(updateError.message);

            toast.success(`Successfully sent to ${emails.length} subscribers!`);
            fetchCampaigns();

        } catch (err) {
            toast.error('Failed to send campaign: ' + err.message);
        } finally {
            setSendingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'sent': return '#10b981';
            case 'scheduled': return '#f59e0b';
            case 'draft': default: return '#6b7280';
        }
    };

    return (
        <div className="admin-component-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Mail size={20} /> Email Campaigns
                </h3>
                <button
                    onClick={() => onEditCampaign(null)}
                    className="admin-submit-btn"
                    style={{ margin: 0, padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Edit3 size={16} /> Create New Campaign
                </button>
            </div>

            {loading ? (
                <div className="admin-loading">Loading campaigns...</div>
            ) : campaigns.length === 0 ? (
                <div className="admin-empty" style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '8px' }}>
                    <Mail size={48} color="#d1d5db" style={{ marginBottom: '1rem' }} />
                    <h4>No campaigns yet</h4>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Start your email marketing journey by creating your first newsletter.</p>
                    <button onClick={() => onEditCampaign(null)} className="admin-submit-btn">Create Campaign</button>
                </div>
            ) : (
                <div className="admin-list">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                                <th style={{ padding: '1rem', color: '#6b7280', fontWeight: 600, fontSize: 'var(--fs-p2)' }}>Campaign</th>
                                <th style={{ padding: '1rem', color: '#6b7280', fontWeight: 600, fontSize: 'var(--fs-p2)' }}>Status</th>
                                <th style={{ padding: '1rem', color: '#6b7280', fontWeight: 600, fontSize: 'var(--fs-p2)' }}>Target</th>
                                <th style={{ padding: '1rem', color: '#6b7280', fontWeight: 600, fontSize: 'var(--fs-p2)' }}>Performance</th>
                                <th style={{ padding: '1rem', color: '#6b7280', fontWeight: 600, fontSize: 'var(--fs-p2)', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map((camp) => (
                                <tr key={camp.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{camp.subject || 'Untitled Draft'}</div>
                                        <div style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={12} /> Last updated: {new Date(camp.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            background: `${getStatusColor(camp.status)}20`,
                                            color: getStatusColor(camp.status),
                                            padding: '4px 8px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize'
                                        }}>
                                            {camp.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#4b5563', fontSize: '14px' }}>
                                        {camp.segment_tags && camp.segment_tags.length > 0 ? camp.segment_tags.join(', ') : 'All Subscribers'}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {camp.status === 'sent' ? (
                                            <div style={{ display: 'flex', gap: '1rem', fontSize: '12px', color: '#4b5563' }}>
                                                <div title="Sent"><Send size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {camp.sent_count}</div>
                                                <div title="Opens currently unavailable without Resend webhooks"><BarChart2 size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> N/A</div>
                                            </div>
                                        ) : (
                                            <span style={{ color: '#9ca3af', fontSize: '12px' }}>Not sent yet</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            {camp.status !== 'sent' && (
                                                <>
                                                    <button
                                                        onClick={() => onEditCampaign(camp.id)}
                                                        style={{ padding: '6px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '4px', cursor: 'pointer', color: '#374151' }}
                                                        title="Edit Draft"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleSend(camp)}
                                                        disabled={sendingId === camp.id}
                                                        style={{ padding: '6px 12px', background: '#6c63ff', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#fff', fontSize: '12px', fontWeight: 600 }}
                                                    >
                                                        {sendingId === camp.id ? 'Sending...' : 'Send Now'}
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(camp.id)}
                                                style={{ padding: '6px', background: 'transparent', border: '1px solid #fee2e2', borderRadius: '4px', cursor: 'pointer', color: '#ef4444' }}
                                                title="Delete Campaign"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CampaignsTab;
