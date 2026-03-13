import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Mail, Trash2, CheckCircle, Clock } from 'lucide-react';
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
        <div className="admin-content-section" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', height: '100%', alignItems: 'start' }}>
            {/* List Sidebar */}
            <div className="admin-list glass-panel" style={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Inbox <span style={{ color: 'var(--brand-accent)', fontSize: '0.9rem' }}>({messages.filter(m => m.status === 'unread').length} Unread)</span></h2>
                    <button onClick={fetchMessages} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Refresh</button>
                </div>

                {loading ? (
                    <p style={{ color: 'var(--muted-color)' }}>Loading messages...</p>
                ) : messages.length === 0 ? (
                    <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--muted-color)' }}>
                        <Mail size={40} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                        <p>Your inbox is empty.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`admin-list-item ${selectedMessage?.id === msg.id ? 'active' : ''}`}
                                style={{
                                    padding: '1rem',
                                    borderLeft: msg.status === 'unread' ? '3px solid var(--brand-accent)' : '3px solid transparent',
                                    background: msg.status === 'unread' ? 'rgba(255,255,255,0.03)' : 'transparent',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setSelectedMessage(msg);
                                    if (msg.status === 'unread') {
                                        handleMarkAsRead(msg.id, 'unread');
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: msg.status === 'unread' ? 700 : 500 }}>{msg.name}</h4>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-color)' }}>{formatDate(msg.created_at)}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-color)', fontWeight: msg.status === 'unread' ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {msg.subject || 'No Subject'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reading Pane */}
            <div className="glass-panel" style={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
                {selectedMessage ? (
                    <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>{selectedMessage.subject || 'No Subject'}</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--brand-accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {selectedMessage.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{selectedMessage.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--muted-color)' }}>
                                            <a href={`mailto:${selectedMessage.email}`} style={{ color: 'inherit' }}>{selectedMessage.email}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleMarkAsRead(selectedMessage.id, selectedMessage.status)}
                                    className="btn-outline"
                                    title={selectedMessage.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                                    style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    {selectedMessage.status === 'unread' ? <CheckCircle size={18} /> : <Clock size={18} />}
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedMessage.id)}
                                    className="btn-outline"
                                    style={{ padding: '0.5rem', borderColor: '#ff4444', color: '#ff4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="Delete Message"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div style={{ lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                            {selectedMessage.message}
                        </div>
                        <div style={{ marginTop: '3rem', fontSize: '0.8rem', color: 'var(--muted-color)' }}>
                            Received on {new Date(selectedMessage.created_at).toLocaleString()}
                        </div>
                    </div>
                ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-color)' }}>
                        <Mail size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                        <p>Select a message to read</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InboxManager;
