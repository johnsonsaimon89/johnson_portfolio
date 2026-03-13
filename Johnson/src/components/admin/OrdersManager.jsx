import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { CheckCircle, Clock, Trash2 } from 'lucide-react';
import './AdminComponents.css';

const OrdersManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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
                // First mark confirmed
                const { error: updateError } = await supabase
                    .from('purchase_orders')
                    .update({ status: 'confirmed' })
                    .eq('id', id);

                if (updateError) throw updateError;

                // Optional: fetch product's current file_url if order doesn't have it
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

                // Trigger Edge Function
                const res = await supabase.functions.invoke('send-email', {
                    body: {
                        type: 'file_delivery',
                        email: order.customer_email,
                        name: order.customer_name || 'Customer',
                        product_title: order.product_title || 'Digital Product',
                        file_url: finalFileUrl || 'https://johnsonsaimon.com/contact',
                        order_id: order.id,
                        download_note: 'Your R2 hosted file is ready for download.'
                    }
                });

                if (res.error) {
                    console.error("Email delivery failed:", res.error);
                    toast.error("Order approved, but failed to send email: " + JSON.stringify(res.error));
                } else {
                    toast.success("Order approved and email sent successfully!");
                    fetchOrders();
                }
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
                fetchOrders();
            }
        });
    };

    return (
        <div className="admin-component-container">
            <div className="admin-panel mt-3">
                <div className="panel-header">
                    <h3>Recent Orders</h3>
                </div>

                {loading ? (
                    <div className="admin-loading">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="admin-empty">No orders found.</div>
                ) : (
                    <div className="admin-list">
                        {orders.map((order) => {
                            const isConfirmed = order.status === 'confirmed';
                            return (
                                <div key={order.id} className="admin-list-item" style={{ borderLeft: `4px solid ${isConfirmed ? '#10b981' : '#f59e0b'}` }}>
                                    <div className="item-content">
                                        <div className="item-title">
                                            {order.customer_email || order.customer_name || 'Unknown Customer'} - {order.amount_tzs > 0 ? `${order.amount_tzs.toLocaleString()} TZS` : 'Free'}
                                        </div>
                                        <div className="item-meta">
                                            Product: {order.product_title || order.product_id} • Sender: {order.transaction_id || 'N/A'} • Date: {new Date(order.created_at).toLocaleDateString()}
                                            <span
                                                className="trend-badge ml-2"
                                                style={{
                                                    marginLeft: '0.5rem',
                                                    background: isConfirmed ? '#d1fae5' : '#fef3c7',
                                                    color: isConfirmed ? '#047857' : '#b45309'
                                                }}
                                            >
                                                {isConfirmed ? 'Confirmed' : 'Pending'}
                                            </span>
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
