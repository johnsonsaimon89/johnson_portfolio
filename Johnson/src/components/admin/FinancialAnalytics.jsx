import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { DollarSign, TrendingUp, Clock, Package } from 'lucide-react';
import { toast } from '../../utils/toast';
import './AdminComponents.css';

const FinancialAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        totalRevenue: 0,
        pendingRevenue: 0,
        totalSales: 0,
        activeProducts: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        if (!supabase) return;
        setLoading(true);

        try {
            // Fetch Orders
            const { data: ordersData, error: ordersError } = await supabase
                .from('purchase_orders')
                .select('amount_tzs, status, created_at, customer_email, product_id')
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;

            // Fetch Products
            const { count: productsCount, error: productsError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true);

            if (productsError) throw productsError;

            let totalRev = 0;
            let pendingRev = 0;
            let salesCount = 0;

            const orders = ordersData || [];

            orders.forEach(order => {
                const amount = parseFloat(order.amount_tzs) || 0;
                if (order.status === 'confirmed') {
                    totalRev += amount;
                    salesCount += 1;
                } else {
                    pendingRev += amount;
                }
            });

            setMetrics({
                totalRevenue: totalRev,
                pendingRevenue: pendingRev,
                totalSales: salesCount,
                activeProducts: productsCount || 0
            });

            // Keep all for reports
            setAllOrders(orders);

            // Set top 5 recent confirmed orders
            const confirmedOnly = orders.filter(o => o.status === 'confirmed').slice(0, 5);
            setRecentOrders(confirmedOnly);

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (!allOrders || allOrders.length === 0) {
            toast.error("No transactions found to export.");
            return;
        }

        try {
            const headers = ['Date', 'Customer', 'Product ID', 'Amount (TZS)', 'Status'];
            
            const escapeCSV = (val) => {
                if (val === null || val === undefined) return '""';
                let str = String(val);
                // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
                if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            };

            const csvRows = [
                headers.join(','),
                ...allOrders.map(order => [
                    escapeCSV(new Date(order.created_at).toISOString().split('T')[0]),
                    escapeCSV(order.customer_email || 'Unknown'),
                    escapeCSV(order.product_id || 'N/A'),
                    escapeCSV(order.amount_tzs || 0),
                    escapeCSV(order.status || 'unknown')
                ].join(','))
            ];

            const csvContent = csvRows.join('\r\n');
            const blob = new Blob(['\uFEFF', csvContent], { type: 'text/csv;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Johnson_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.success("Report generated and downloaded.");
        } catch (error) {
            console.error('Export error:', error);
            toast.error("Failed to generate CSV: " + error.message);
        }
    };

    const handleExportJSON = () => {
        if (!allOrders || allOrders.length === 0) {
            toast.error("No transactions found to export.");
            return;
        }
        const dataStr = JSON.stringify(allOrders, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Johnson_Financial_Data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("JSON data downloaded.");
    };

    const handlePrintReport = () => {
        if (!allOrders || allOrders.length === 0) {
            toast.error("No transactions found to print.");
            return;
        }
        
        const printWindow = window.open('', '_blank');
        const reportHtml = `
            <html>
                <head>
                    <title>Financial Report - ${new Date().toLocaleDateString()}</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; color: #111; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                        th { background-color: #f8f9fa; }
                        h1 { color: #111; margin-bottom: 5px; }
                        .meta { color: #666; margin-bottom: 30px; }
                        .total { font-weight: bold; font-size: 1.2rem; margin-top: 30px; text-align: right; }
                    </style>
                </head>
                <body>
                    <h1>Financial Transaction Report</h1>
                    <p class="meta">Generated on ${new Date().toLocaleString()}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Product ID</th>
                                <th>Amount (TZS)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allOrders.map(order => `
                                <tr>
                                    <td>${new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>${order.customer_email || 'Unknown'}</td>
                                    <td>${order.product_id || 'N/A'}</td>
                                    <td>${parseFloat(order.amount_tzs || 0).toLocaleString()}</td>
                                    <td>${order.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="total">Total Revenue: ${metrics.totalRevenue.toLocaleString()} TZS</div>
                    <script>window.onload = () => { window.print(); window.close(); }</script>
                </body>
            </html>
        `;
        printWindow.document.write(reportHtml);
        printWindow.document.close();
    };

    if (loading) {
        return <div className="admin-loading">Calculating financials...</div>;
    }

    return (
        <div className="admin-component-container">
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="admin-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue</span>
                        <div style={{ background: '#d1fae5', color: '#047857', padding: '0.5rem', borderRadius: '6px' }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111' }}>
                        {metrics.totalRevenue.toLocaleString()} <span style={{ fontSize: '1rem', color: '#6b7280' }}>TZS</span>
                    </div>
                </div>

                <div className="admin-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Revenue</span>
                        <div style={{ background: '#fef3c7', color: '#b45309', padding: '0.5rem', borderRadius: '6px' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111' }}>
                        {metrics.pendingRevenue.toLocaleString()} <span style={{ fontSize: '1rem', color: '#6b7280' }}>TZS</span>
                    </div>
                </div>

                <div className="admin-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Sales</span>
                        <div style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.5rem', borderRadius: '6px' }}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111' }}>
                        {metrics.totalSales}
                    </div>
                </div>

                <div className="admin-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Products</span>
                        <div style={{ background: '#f3f4f6', color: '#4b5563', padding: '0.5rem', borderRadius: '6px' }}>
                            <Package size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111' }}>
                        {metrics.activeProducts}
                    </div>
                </div>
            </div>

            {/* Recent Transactions list */}
            <div className="admin-panel">
                <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3>Transaction History</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                            onClick={handleExportCSV} 
                            className="btn-outline" 
                            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                            title="Download as Excel-ready CSV"
                        >
                            CSV
                        </button>
                        <button 
                            onClick={handleExportJSON} 
                            className="btn-outline" 
                            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                            title="Download as JSON data"
                        >
                            JSON
                        </button>
                        <button 
                            onClick={handlePrintReport} 
                            className="btn-outline" 
                            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                            title="Open printable report (Save as PDF)"
                        >
                            Print/PDF
                        </button>
                    </div>
                </div>
                {recentOrders.length === 0 ? (
                    <div className="admin-empty">No confirmed transactions yet.</div>
                ) : (
                    <div className="admin-list">
                        {recentOrders.map((order, idx) => (
                            <div key={idx} className="admin-list-item" style={{ borderLeft: '4px solid #10b981' }}>
                                <div className="item-content">
                                    <div className="item-title">{order.customer_email || 'Unknown Customer'}</div>
                                    <div className="item-meta">Product ID: {order.product_id} • {new Date(order.created_at).toLocaleDateString()}</div>
                                </div>
                                <div className="item-actions">
                                    <span style={{ fontWeight: '600', color: '#111' }}>+{parseFloat(order.amount_tzs || 0).toLocaleString()} TZS</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinancialAnalytics;
