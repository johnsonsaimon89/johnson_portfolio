import { toast } from '../../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Users, Trash2, Tag, Loader2, Mail, Plus, Search } from 'lucide-react';

const SubscriberCRM = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');
    const [newTags, setNewTags] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredSubscribers = subscribers.filter(s => 
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="admin-component-container" style={{ gap: '2rem' }}>
            {/* Stats Overview */}
            <div className="admin-grid-3">
                <div className="stat-card vibrant grad-emerald">
                    <div className="stat-header">
                        <span className="stat-label">Total Audience</span>
                        <div className="stat-icon"><Users size={18} /></div>
                    </div>
                    <div className="stat-value">{subscribers.length}</div>
                    <div className="stat-footer">Active Subscribers</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Growth Rate</span>
                    </div>
                    <div className="stat-value" style={{ color: '#10b981' }}>+12%</div>
                    <div className="stat-footer">Last 30 days</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Main Source</span>
                    </div>
                    <div className="stat-value">Direct</div>
                    <div className="stat-footer">Organic Signup</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
                {/* Database List */}
                <div className="admin-panel" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
                    <div className="panel-header" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ padding: '8px', background: '#000', borderRadius: '8px', color: '#fff', display: 'flex' }}>
                                <Users size={18} />
                            </div>
                            <h3 style={{ margin: 0 }}>Subscriber Database</h3>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="text" 
                                placeholder="Search by email..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ padding: '0.5rem 1rem 0.5rem 2.2rem', fontSize: 'var(--fs-p2)', width: '200px', borderRadius: '100px', border: '1px solid #e2e8f0' }}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="admin-loading" style={{ border: 'none', background: 'transparent' }}>
                            <Loader2 size={24} className="spin" style={{ opacity: 0.2 }} />
                        </div>
                    ) : filteredSubscribers.length === 0 ? (
                        <div className="admin-empty" style={{ border: 'none', background: 'transparent', padding: '4rem 0' }}>
                            <Mail size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                            <p style={{ color: '#94a3b8' }}>{searchTerm ? 'No results found' : 'Audience is empty'}</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {filteredSubscribers.map((sub) => (
                                <div key={sub.id} className="admin-list-item" style={{ padding: '1rem 1.5rem', border: '1px solid #f1f5f9', background: '#fff' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 'var(--fs-p2)', color: '#64748b' }}>
                                            {sub.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: 'var(--fs-p2)', color: '#0f172a' }}>{sub.email}</div>
                                            <div style={{ fontSize: 'var(--fs-p2)', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {sub.name && <span>{sub.name} •</span>}
                                                <span style={{ textTransform: 'capitalize' }}>via {sub.source}</span>
                                            </div>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                            {sub.tags?.map((t, i) => (
                                                <span key={i} className="r2-badge-refined" style={{ margin: 0, padding: '2px 8px', fontSize: '10px', background: 'rgba(0,0,0,0.04)', color: '#475569', border: 'none' }}>
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: 'var(--fs-p2)', color: '#94a3b8', textAlign: 'right', minWidth: '100px', fontWeight: 500 }}>
                                            {new Date(sub.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="item-actions" style={{ marginLeft: '1.5rem' }}>
                                        <button className="action-btn delete" onClick={() => handleDelete(sub.id)} title="Remove" style={{ width: '32px', height: '32px' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Manual Add Sidebar */}
                <div className="admin-panel" style={{ background: '#fff', border: '1px solid #f1f5f9' }}>
                    <div className="panel-header" style={{ marginBottom: '1.5rem', border: 'none', padding: 0 }}>
                        <h3 style={{ fontSize: 'var(--fs-p2)', fontWeight: 800 }}>Quick Add</h3>
                    </div>
                    <form onSubmit={handleAddSubscriber} className="admin-form" style={{ gap: '1.25rem' }}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required placeholder="user@example.com" />
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Jane Doe" />
                        </div>
                        <div className="form-group">
                            <label>Tags</label>
                            <input type="text" value={newTags} onChange={e => setNewTags(e.target.value)} placeholder="VIP, Customer..." />
                        </div>
                        <button type="submit" className="admin-submit-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.85rem' }}>
                            <Plus size={18} /> Add Subscriber
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubscriberCRM;
