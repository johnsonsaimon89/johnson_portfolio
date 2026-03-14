import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import * as XLSX from 'xlsx';
import { 
    DollarSign, 
    TrendingUp, 
    Package, 
    Users, 
    ArrowUpRight, 
    BarChart3,
    PieChart as PieIcon,
    Calendar,
    Filter,
    Clock,
    UserPlus,
    Download,
    Trophy,
    Zap,
    FileSpreadsheet,
    FileText
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { toast } from '../../utils/toast';
import './AdminComponents.css';

const FinancialAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30d'); // '7d', '30d', '90d', 'all'
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'confirmed', 'pending'
    
    const [metrics, setMetrics] = useState({
        totalRevenue: 0,
        pendingRevenue: 0,
        totalSales: 0,
        activeProducts: 0,
        totalSubscribers: 0,
        conversionRate: 0,
        averageOrderValue: 0,
        uniqueCustomers: 0
    });

    const [chartData, setChartData] = useState([]);
    const [productPerformance, setProductPerformance] = useState([]);
    const [subscriberTrend, setSubscriberTrend] = useState([]);
    const [allOrders, setAllOrders] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        if (!supabase) return;
        setLoading(true);

        try {
            // Calculate date threshold
            let dateThreshold = new Date();
            if (dateRange === '7d') dateThreshold.setDate(dateThreshold.getDate() - 7);
            else if (dateRange === '30d') dateThreshold.setDate(dateThreshold.getDate() - 30);
            else if (dateRange === '90d') dateThreshold.setDate(dateThreshold.getDate() - 90);
            else dateThreshold = new Date(0); // All time

            // Fetch Orders
            let query = supabase
                .from('purchase_orders')
                .select('amount_tzs, status, created_at, customer_email, product_id, product_title')
                .order('created_at', { ascending: false });
            
            if (dateRange !== 'all') {
                query = query.gte('created_at', dateThreshold.toISOString());
            }

            const { data: ordersData, error: ordersError } = await query;
            if (ordersError) throw ordersError;

            // Fetch Products (Global)
            const { count: productsCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true);

            // Fetch Subscribers (Global count)
            const { count: subscribersCount } = await supabase
                .from('newsletter_subscribers')
                .select('*', { count: 'exact', head: true });

            // Fetch Subscriber Trend (Filtered by date if needed)
            const { data: subData } = await supabase
                .from('newsletter_subscribers')
                .select('created_at')
                .gte('created_at', dateThreshold.toISOString());

            let totalRev = 0;
            let pendingRev = 0;
            let salesCount = 0;
            const uniqueCustomerEmails = new Set();
            const orders = ordersData || [];

            const dailyRevenue = {};
            const productSales = {};

            orders.forEach(order => {
                const amount = parseFloat(order.amount_tzs) || 0;
                const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                if (order.status === 'confirmed') {
                    totalRev += amount;
                    salesCount += 1;
                    if (order.customer_email) uniqueCustomerEmails.add(order.customer_email);
                    
                    dailyRevenue[date] = (dailyRevenue[date] || 0) + amount;
                    
                    const pKey = order.product_title || `ID: ${order.product_id}`;
                    productSales[pKey] = (productSales[pKey] || 0) + amount;
                } else if (order.status === 'pending') {
                    pendingRev += amount;
                }
            });

            const sortedRevChart = Object.entries(dailyRevenue)
                .map(([name, value]) => ({ name, value }))
                .reverse();

            const sortedProductChart = Object.entries(productSales)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5);

            const dailySubs = {};
            (subData || []).forEach(sub => {
                const date = new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                dailySubs[date] = (dailySubs[date] || 0) + 1;
            });
            const subChart = Object.entries(dailySubs)
                .map(([name, value]) => ({ name, value }))
                .reverse()
                .slice(-10);

            setMetrics({
                totalRevenue: totalRev,
                pendingRevenue: pendingRev,
                totalSales: salesCount,
                activeProducts: productsCount || 0,
                totalSubscribers: subscribersCount || 0,
                conversionRate: subscribersCount > 0 ? (salesCount / subscribersCount * 100).toFixed(1) : 0,
                averageOrderValue: salesCount > 0 ? Math.round(totalRev / salesCount) : 0,
                uniqueCustomers: uniqueCustomerEmails.size
            });

            setChartData(sortedRevChart);
            setProductPerformance(sortedProductChart);
            setSubscriberTrend(subChart);
            setAllOrders(orders);

        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error("Failed to update analytics.");
        } finally {
            setLoading(false);
        }
    };

    const filteredRecentOrders = useMemo(() => {
        const filtered = statusFilter === 'all' ? allOrders : allOrders.filter(o => o.status === statusFilter);
        return filtered.slice(0, 15);
    }, [allOrders, statusFilter]);

    // Vibrant Palette
    const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

    // --- REFINED EXPORT LOGIC ---

    const handleExportExcel = () => {
        if (!allOrders || allOrders.length === 0) {
            toast.error("No data to export.");
            return;
        }

        try {
            const data = allOrders.map(o => ({
                'Date': new Date(o.created_at).toLocaleDateString(),
                'Customer Email': o.customer_email || 'Unknown',
                'Product': o.product_title || o.product_id || 'N/A',
                'Amount (TZS)': o.amount_tzs || 0,
                'Status': o.status || 'unknown'
            }));

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, "Financial_Report");

            // Forcing filename via library-level trigger to avoid UUID naming issues
            const filename = `finance_report_${dateRange}.xlsx`;
            XLSX.writeFile(wb, filename);
            
            toast.success("Excel report saved. Check your Downloads.");
        } catch (e) {
            console.error('Excel Export Error:', e);
            toast.error("Excel export failed.");
        }
    };

    const handleExportCSV = () => {
        if (!allOrders || allOrders.length === 0) {
            toast.error("No data to export.");
            return;
        }

        try {
            const data = allOrders.map(o => ({
                'Date': new Date(o.created_at).toLocaleDateString(),
                'Customer Email': o.customer_email || 'Unknown',
                'Product': o.product_title || o.product_id || 'N/A',
                'Amount (TZS)': o.amount_tzs || 0,
                'Status': o.status || 'unknown'
            }));

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, "Financial_Ledger");

            // Using writeFile for CSV as well to ensure consistent naming across systems
            const filename = `finance_ledger_${dateRange}.csv`;
            XLSX.writeFile(wb, filename, { bookType: 'csv' });
            
            toast.success("CSV ledger saved. Check your Downloads.");
        } catch (e) {
            console.error('CSV Export Error:', e);
            toast.error("CSV export failed.");
        }
    };

    if (loading && allOrders.length === 0) return <div className="admin-loading">Vibrating the data streams...</div>;

    return (
        <div className="admin-component-container">
            <div className="panel-header" style={{ marginBottom: '2rem', border: 'none' }}>
                <div>
                    <h3 style={{ border: 'none', margin: 0, fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Financial Ecosystem</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Real-time organic performance tracking</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className="date-range-btns" style={{ display: 'flex', background: '#f8fafc', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        {['7d', '30d', '90d', 'all'].map(range => (
                            <button 
                                key={range}
                                onClick={() => setDateRange(range)}
                                style={{ 
                                    padding: '0.4rem 0.8rem', 
                                    fontSize: '0.75rem', 
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    background: dateRange === range ? '#000' : 'transparent',
                                    color: dateRange === range ? '#fff' : '#64748b',
                                    fontWeight: '700',
                                    transition: 'all 0.2s',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    
                    <button className="icon-btn" onClick={fetchAnalytics} title="Refresh Data" style={{ background: '#fff' }}>
                        <Filter size={18} />
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={handleExportCSV} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '10px', fontSize: '0.8rem', padding: '0.6rem 1rem' }}>
                            <FileText size={14} /> CSV
                        </button>
                        <button onClick={handleExportExcel} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '10px', fontSize: '0.8rem', padding: '0.6rem 1rem' }}>
                            <FileSpreadsheet size={14} /> Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* Vibrant KPI Cards */}
            <div className="admin-grid-4" style={{ marginBottom: '2rem' }}>
                <div className="stat-card vibrant grad-emerald">
                    <div className="stat-header">
                        <span className="stat-label">Net Sales</span>
                        <div className="stat-icon">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{metrics.totalRevenue.toLocaleString()} <small style={{ fontSize: '0.5em', opacity: 0.8 }}>TZS</small></div>
                    <div className="stat-footer">
                        <Trophy size={14} style={{ marginRight: '4px' }} />
                        {metrics.totalSales} confirmed orders
                    </div>
                </div>

                <div className="stat-card vibrant grad-amber">
                    <div className="stat-header">
                        <span className="stat-label">Pipeline Value</span>
                        <div className="stat-icon">
                            <Clock size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{metrics.pendingRevenue.toLocaleString()} <small style={{ fontSize: '0.5em', opacity: 0.8 }}>TZS</small></div>
                    <div className="stat-footer">
                        Awaiting manual verification
                    </div>
                </div>

                <div className="stat-card vibrant grad-indigo">
                    <div className="stat-header">
                        <span className="stat-label">Unique Customers</span>
                        <div className="stat-icon">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{metrics.uniqueCustomers}</div>
                    <div className="stat-footer">
                        {metrics.totalSubscribers} total ecosystem leads
                    </div>
                </div>

                <div className="stat-card vibrant grad-violet">
                    <div className="stat-header">
                        <span className="stat-label">Conversion Power</span>
                        <div className="stat-icon">
                            <Zap size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{metrics.conversionRate}%</div>
                    <div className="stat-footer">
                        Subscribers to customers ratio
                    </div>
                </div>
            </div>

            {/* Colorful Charts Row */}
            <div className="admin-grid-2" style={{ marginBottom: '2rem' }}>
                <div className="admin-panel" style={{ borderRadius: '24px', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }}>
                    <div className="panel-header">
                        <h3 style={{ fontWeight: '700' }}>Revenue Velocity</h3>
                        <BarChart3 size={18} color="#6366f1" />
                    </div>
                    <div style={{ height: '320px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`${value.toLocaleString()} TZS`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="admin-panel" style={{ borderRadius: '24px', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }}>
                    <div className="panel-header">
                        <h3 style={{ fontWeight: '700' }}>Dominant Assets</h3>
                        <PieIcon size={18} color="#10b981" />
                    </div>
                    <div style={{ height: '320px', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={productPerformance}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {productPerformance.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none' }}
                                    formatter={(value) => [`${value.toLocaleString()} TZS`, 'Revenue']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ width: '45%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {productPerformance.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></div>
                                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px', fontWeight: '700', color: '#334155' }}>{item.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Refined Master Ledger */}
            <div className="admin-grid-3">
                <div className="admin-panel" style={{ gridColumn: 'span 2', borderRadius: '24px' }}>
                    <div className="panel-header" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <h3 style={{ fontWeight: '700' }}>Master Transaction Ledger</h3>
                            <select 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                <option value="all">All Real-time Triggers</option>
                                <option value="confirmed">Confirmed Success</option>
                                <option value="pending">Verification Queue</option>
                            </select>
                        </div>
                    </div>
                    <div className="admin-list" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {filteredRecentOrders.length === 0 ? (
                            <div className="admin-empty">The ledger is currently silent.</div>
                        ) : filteredRecentOrders.map((order, idx) => (
                            <div key={idx} className="admin-list-item" style={{ 
                                borderLeft: `6px solid ${order.status === 'confirmed' ? '#10b981' : '#f59e0b'}`, 
                                padding: '1.25rem',
                                borderRadius: '12px',
                                background: order.status === 'confirmed' ? 'rgba(16, 185, 129, 0.02)' : 'rgba(245, 158, 11, 0.02)',
                                marginBottom: '0.75rem'
                            }}>
                                <div className="item-content">
                                    <div className="item-title" style={{ fontSize: '1rem', fontWeight: '700' }}>{order.customer_email}</div>
                                    <div className="item-meta">
                                        <Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}
                                        <Package size={14} /> {order.product_title || 'Uncategorized Digital Asset'}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#0f172a' }}>{parseFloat(order.amount_tzs).toLocaleString()}</div>
                                    <span style={{ 
                                        padding: '0.25rem 0.6rem', 
                                        borderRadius: '6px', 
                                        fontSize: '0.65rem', 
                                        fontWeight: '800', 
                                        textTransform: 'uppercase',
                                        background: order.status === 'confirmed' ? '#d1fae5' : '#fef3c7',
                                        color: order.status === 'confirmed' ? '#065f46' : '#92400e'
                                    }}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="admin-panel" style={{ borderRadius: '24px' }}>
                    <div className="panel-header">
                        <h3 style={{ fontWeight: '700' }}>Lead Acquisition</h3>
                        <UserPlus size={18} color="#8b5cf6" />
                    </div>
                    <div style={{ height: '240px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subscriberTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-1" style={{ fontSize: '0.8rem', color: '#475569', textAlign: 'center', fontWeight: '500' }}>
                        Organic lead velocity in the {dateRange} window.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialAnalytics;
