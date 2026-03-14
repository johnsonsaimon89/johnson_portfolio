import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Mail, Trash2, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { toast } from '../../utils/toast';

const InboxManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
        
        if (!supabase) return;

        const channel = supabase
            .channel('inbox-db-changes')
            .on('postgres_changes', { event: '*', table: 'messages', schema: 'public' }, () => {
                fetchMessages();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        if (!supabase) return;
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching messages:', error);
        else setMessages(data || []);
        setLoading(false);
    };

    const handleMarkAsRead = async (id, currentStatus) => {
        if (!supabase) return;
        const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
        const { error } = await supabase
            .from('messages')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
            if (selectedMessage && selectedMessage.id === id) {
                setSelectedMessage({ ...selectedMessage, status: newStatus });
            }
            toast.success(`Marked as ${newStatus}`);
        } else {
            toast.error('Failed to update status: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        toast.confirm('Are you sure you want to delete this message?', async () => {
            if (!supabase) return;
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', id);

            if (!error) {
                setMessages(messages.filter(m => m.id !== id));
                if (selectedMessage && selectedMessage.id === id) {
                    setSelectedMessage(null);
                }
                toast.success('Message deleted');
            } else {
                toast.error('Failed to delete message: ' + error.message);
            }
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2rem', minHeight: '700px', alignItems: 'start' }}>
            {/* List Sidebar */}
            <div className="admin-panel" style={{ padding: '1.5rem', height: 'calc(100vh - 250px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                        Messages <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, marginLeft: '4px' }}>({messages.filter(m => m.status === 'unread').length} new)</span>
                    </h3>
                    <button onClick={fetchMessages} className="icon-btn" title="Refresh Inbox" style={{ width: '32px', height: '32px' }}>
                        <Clock size={16} />
                    </button>
                </div>

                {loading ? (
                    <div className="admin-loading" style={{ border: 'none', background: 'transparent' }}>
                        <Loader2 size={24} className="spin" style={{ color: '#000', opacity: 0.2 }} />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="admin-empty" style={{ border: 'none', background: 'transparent', padding: '3rem 1rem' }}>
                        <Mail size={40} style={{ opacity: 0.1, margin: '0 auto 1rem auto' }} />
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>Your inbox is clear</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`admin-list-item ${selectedMessage?.id === msg.id ? 'active' : ''}`}
                                style={{
                                    padding: '1.25rem',
                                    cursor: 'pointer',
                                    border: selectedMessage?.id === msg.id ? '2px solid #000' : '1px solid #f1f5f9',
                                    background: msg.status === 'unread' ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                                    borderRadius: '12px',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: msg.status === 'unread' ? '0 4px 12px rgba(16, 185, 129, 0.05)' : 'none',
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'flex-start',
                                    position: 'relative',
                                }}
                                onClick={() => {
                                    setSelectedMessage(msg);
                                    if (msg.status === 'unread') {
                                        handleMarkAsRead(msg.id, 'unread');
                                    }
                                }}
                            >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.name}</span>
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{formatDate(msg.created_at)}</span>
                                    </div>
                                    <div style={{ 
                                        fontSize: '0.8rem', 
                                        color: msg.status === 'unread' ? '#000' : '#64748b', 
                                        fontWeight: msg.status === 'unread' ? 700 : 500, 
                                        whiteSpace: 'nowrap', 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis',
                                        marginBottom: '2px',
                                    }}>
                                        {msg.subject || 'No Subject'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.8 }}>
                                        {msg.message}
                                    </div>
                                </div>
                                {msg.status === 'unread' && (
                                    <div style={{ 
                                        width: '6px', 
                                        height: '6px', 
                                        borderRadius: '50%', 
                                        background: '#10b981', 
                                        marginTop: '6px',
                                        flexShrink: 0,
                                        boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
                                    }}></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reading Pane */}
            <div className="admin-panel" style={{ height: 'calc(100vh - 250px)', overflowY: 'auto', background: '#fff', border: '1px solid #f1f5f9' }}>
                {selectedMessage ? (
                    <div style={{ animation: 'fadeIn 0.4s cubic-bezier(0, 0, 0.2, 1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ 
                                    width: '44px', 
                                    height: '44px', 
                                    borderRadius: '10px', 
                                    background: '#f8fafc', 
                                    color: '#000', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    fontWeight: 900, 
                                    fontSize: '1.1rem',
                                    border: '1px solid #e2e8f0',
                                }}>
                                    {selectedMessage.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{selectedMessage.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                                        <a href={`mailto:${selectedMessage.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{selectedMessage.email}</a>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    onClick={() => handleMarkAsRead(selectedMessage.id, selectedMessage.status)}
                                    className="action-btn"
                                    title={selectedMessage.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                                    style={{ width: '40px', height: '40px', borderRadius: '10px' }}
                                >
                                    {selectedMessage.status === 'unread' ? <CheckCircle size={18} /> : <Clock size={18} />}
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedMessage.id)}
                                    className="action-btn delete"
                                    title="Delete Message"
                                    style={{ width: '40px', height: '40px', borderRadius: '10px' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div style={{ maxWidth: '700px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '2rem', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                                {selectedMessage.subject || 'No Subject'}
                            </h2>
                            <div style={{ 
                                lineHeight: 1.8, 
                                fontSize: '1.05rem', 
                                color: '#334155', 
                                whiteSpace: 'pre-wrap',
                                background: '#fbfcfd',
                                padding: '2rem',
                                borderRadius: '16px',
                                border: '1px solid #f1f5f9',
                            }}>
                                {selectedMessage.message}
                            </div>
                        </div>

                        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Received — {new Date(selectedMessage.created_at).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                        </div>
                    </div>
                ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                            <Mail size={32} style={{ color: '#cbd5e1' }} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Select a message</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', maxWidth: '240px', lineHeight: 1.6 }}>Choose an inquiry from the left to view the full details and respond.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InboxManager;
