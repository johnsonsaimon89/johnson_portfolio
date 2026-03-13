import { toast } from '../../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Users, Trash2, Tag } from 'lucide-react';

const SubscriberCRM = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');
    const [newTags, setNewTags] = useState('');

    useEffect(() => {
        fetchSubscribers();

        if (supabase) {
            const channel = supabase
                .channel('subscribers-db-changes')
                .on('postgres_changes', { event: '*', table: 'newsletter_subscribers', schema: 'public' }, () => {
                    fetchSubscribers();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, []);

    const fetchSubscribers = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching subscribers:', error);
            if (error.code === '42P01') {
                setSubscribers([]);
            } else {
                toast.error('Failed to load subscribers');
            }
        } else {
            setSubscribers(data || []);
        }
        setLoading(false);
    };

    const handleAddSubscriber = async (e) => {
        e.preventDefault();
        if (!newEmail) return;

        const tagsArray = newTags.split(',').map(t => t.trim()).filter(t => t);

        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert([{
                email: newEmail,
                name: newName || null,
                source: 'admin_manual',
                tags: tagsArray
            }]);

        if (error) {
            if (error.code === '23505') toast.error('Subscriber already exists.');
            else toast.error('Error adding subscriber: ' + error.message);
        } else {
            toast.success('Subscriber added successfully');
            setNewEmail('');
            setNewName('');
            setNewTags('');
            fetchSubscribers();
        }
    };

    const handleDelete = async (id) => {
        toast.confirm('Remove this subscriber?', async () => {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .delete()
                .eq('id', id);

            if (error) toast.error('Error: ' + error.message);
            else {
                toast.success('Subscriber removed');
                fetchSubscribers();
            }
        });
    };

    return (
        <div className="admin-component-container">
            <div className="admin-panel mt-3">
                <div className="panel-header">
                    <h3>➕ Add Manually</h3>
                </div>
                <form onSubmit={handleAddSubscriber} className="admin-form" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ flex: '1 1 200px' }}>
                        <label>Email *</label>
                        <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required placeholder="user@example.com" />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 150px' }}>
                        <label>Name</label>
                        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Jane Doe" />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 200px' }}>
                        <label>Tags (comma separated)</label>
                        <input type="text" value={newTags} onChange={e => setNewTags(e.target.value)} placeholder="VIP, workshop, customer" />
                    </div>
                    <div className="form-group" style={{ flex: '0 0 auto', paddingBottom: '2px' }}>
                        <button type="submit" className="admin-submit-btn" style={{ padding: '0.75rem 1.5rem', margin: 0 }}>Add</button>
                    </div>
                </form>
            </div>

            <div className="admin-panel mt-3">
                <div className="panel-header">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={20} /> Subscriber Database ({subscribers.length})
                    </h3>
                </div>

                {loading ? (
                    <div className="admin-loading">Loading subscribers...</div>
                ) : subscribers.length === 0 ? (
                    <div className="admin-empty">No subscribers yet.</div>
                ) : (
                    <div className="admin-list">
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                                    <th style={{ padding: '0.75rem 0.5rem', color: '#6b7280', fontWeight: 600, fontSize: '0.875rem' }}>Email</th>
                                    <th style={{ padding: '0.75rem 0.5rem', color: '#6b7280', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
                                    <th style={{ padding: '0.75rem 0.5rem', color: '#6b7280', fontWeight: 600, fontSize: '0.875rem' }}>Tags</th>
                                    <th style={{ padding: '0.75rem 0.5rem', color: '#6b7280', fontWeight: 600, fontSize: '0.875rem' }}>Source</th>
                                    <th style={{ padding: '0.75rem 0.5rem', color: '#6b7280', fontWeight: 600, fontSize: '0.875rem' }}>Date</th>
                                    <th style={{ padding: '0.75rem 0.5rem', color: '#6b7280', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribers.map((sub) => (
                                    <tr key={sub.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>{sub.email}</td>
                                        <td style={{ padding: '1rem 0.5rem', color: '#4b5563' }}>{sub.name || '-'}</td>
                                        <td style={{ padding: '1rem 0.5rem' }}>
                                            {sub.tags && sub.tags.length > 0 ? (
                                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                    {sub.tags.map((t, i) => (
                                                        <span key={i} style={{ background: '#f3f4f6', color: '#374151', fontSize: '11px', padding: '2px 8px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                            <Tag size={10} /> {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : <span style={{ color: '#9ca3af', fontSize: '12px' }}>No tags</span>}
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem', color: '#4b5563', fontSize: '14px' }}>
                                            <span style={{ textTransform: 'capitalize' }}>{sub.source.replace('_', ' ')}</span>
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem', color: '#6b7280', fontSize: '14px' }}>
                                            {new Date(sub.created_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                                            <button className="action-btn delete" onClick={() => handleDelete(sub.id)} title="Remove Subscriber" style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriberCRM;
