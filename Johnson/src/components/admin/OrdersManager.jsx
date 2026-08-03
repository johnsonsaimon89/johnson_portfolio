import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import emailService from '../../lib/emailService';
import { CheckCircle, Clock, Trash2, Sparkles } from 'lucide-react';
import './AdminComponents.css';

const OrdersManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();

        if (!supabase) return;

        const channel = supabase
            .channel('orders-db-changes')
            .on('postgres_changes', { event: '*', table: 'purchase_orders', schema: 'public' }, () => {
                fetchOrders();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchOrders = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('purchase_orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) console.error('Error fetching orders:', error);
        else setOrders(data || []);
        setLoading(false);
    };

    const handleApprove = async (id) => {
        toast.confirm('Approve this order? This will mark it confirmed and send the digital product via email.', async () => {
            const order = orders.find(o => o.id === id);
            if (!order) return;

            try {
                // Fetch product's current file_url if order doesn't have it
                let finalFileUrl = order.file_url;
                if (!finalFileUrl) {
                    const { data: prodData } = await supabase
                        .from('products')
                        .select('file_url')
                        .eq('id', order.product_id)
                        .single();
                    if (prodData && prodData.file_url) {
                        finalFileUrl = prodData.file_url;
                    }
                }

                // Update order with confirmed status and the correct file_url
                // This will fire the Supabase database trigger that handles email delivery
                const { error: updateError } = await supabase
                    .from('purchase_orders')
                    .update({ 
                        status: 'confirmed',
                        file_url: finalFileUrl
                    })
                    .eq('id', id);

                if (updateError) throw updateError;

                toast.success("Order approved! Email has been sent.");
                fetchOrders();
            } catch (err) {
                toast.error('Error updating order: ' + err.message);
            }
        });
    };

    const handleDelete = async (id) => {
        toast.confirm('Are you sure you want to delete this order record? This cannot be undone.', async () => {
            const { error } = await supabase
                .from('purchase_orders')
                .delete()
                .eq('id', id);

            if (error) toast.error('Error deleting order: ' + error.message);
            else {
                toast.success('Order deleted successfully');
                setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
                fetchOrders();
            }
        });
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;

        toast.confirm(`Are you sure you want to delete ${selectedIds.length} order records? This cannot be undone.`, async () => {
            const { error } = await supabase
                .from('purchase_orders')
                .delete()
                .in('id', selectedIds);

            if (error) toast.error('Error deleting orders: ' + error.message);
            else {
                toast.success(`${selectedIds.length} orders deleted successfully`);
                setSelectedIds([]);
                fetchOrders();
            }
        });
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredOrders.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredOrders.map(o => o.id));
        }
    };

    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'all') return true;
        return order.status === statusFilter;
    });

    return (
        <div className="admin-component-container">
            <div className="admin-panel mt-3">
                <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h3>Recent Orders</h3>
                        <div className="status-filters" style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                            {['all', 'pending', 'confirmed'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`filter-badge ${statusFilter === status ? 'active' : ''}`}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        fontSize: 'var(--fs-p2)',
                                        borderRadius: '20px',
                                        border: '1px solid #e2e8f0',
                                        background: statusFilter === status ? '#000' : '#fff',
                                        color: statusFilter === status ? '#fff' : '#64748b',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="btn-danger"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                fontSize: 'var(--fs-p2)',
                                borderRadius: '8px',
                                background: '#dc2626',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <Trash2 size={14} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="admin-loading">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="admin-empty">No orders found.</div>
                ) : (
                    <div className="admin-list">
                        <div className="admin-list-item" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', borderRadius: '0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                                    onChange={toggleSelectAll}
                                    style={{ cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: 'var(--fs-p2)', fontWeight: '700', color: '#64748b' }}>Select All</span>
                            </div>
                        </div>
                        {filteredOrders.map((order) => {
                            const isConfirmed = order.status === 'confirmed';
                            const isSelected = selectedIds.includes(order.id);
                            return (
                                 <div key={order.id} className={`admin-list-item ${isSelected ? 'selected' : ''}`} style={{ background: isSelected ? '#f1f5f9' : '' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelect(order.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <div className="item-content">
                                            <div className="item-title">
                                                {order.customer_email || order.customer_name || 'Unknown Customer'}
                                            </div>
                                            <div className="item-meta">
                                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{order.amount_tzs > 0 ? `${order.amount_tzs.toLocaleString()} TZS` : 'Free'}</span>
                                                <span style={{ color: '#cbd5e1' }}>•</span>
                                                {order.product_title || order.product_id}
                                                <span style={{ color: '#cbd5e1' }}>•</span>
                                                {new Date(order.created_at).toLocaleDateString()}
                                                {order.sale_event && (
                                                    <span className="trend-badge ml-2" style={{ marginLeft: '0.5rem', background: '#e0e7ff', color: '#4338ca', fontSize: 'var(--fs-p2)' }}>
                                                        <Sparkles size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} /> {order.sale_event}
                                                    </span>
                                                )}
                                                <span className={`indicator ${isConfirmed ? 'indicator-success' : 'indicator-warning'} ml-2`}>
                                                    {isConfirmed ? 'Confirmed' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        {!isConfirmed && (
                                            <button
                                                className="action-btn text-accent"
                                                type="button"
                                                onClick={() => handleApprove(order.id)}
                                                title="Approve Order"
                                                style={{ color: '#047857', borderColor: '#a7f3d0' }}
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                        )}
                                        <button className="action-btn delete" type="button" onClick={() => handleDelete(order.id)} title="Delete Record">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};


export default OrdersManager;
