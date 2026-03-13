import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, LayoutList, BarChart3, Mail, MessageSquareQuote, Settings, ShoppingBag, ShoppingCart, LineChart, Shield, Users, Play } from 'lucide-react';
import ProjectForm from '../components/admin/ProjectForm';
import StatsManager from '../components/admin/StatsManager';
import InboxManager from '../components/admin/InboxManager';
import TestimonialsManager from '../components/admin/TestimonialsManager';
import SettingsEditor from '../components/admin/SettingsEditor';
import ProductsManager from '../components/admin/ProductsManager';
import OrdersManager from '../components/admin/OrdersManager';
import NewsletterManager from '../components/admin/NewsletterManager';
import FinancialAnalytics from '../components/admin/FinancialAnalytics';
import BlogManager from '../components/admin/cms/BlogManager';
import MediaLibrary from '../components/admin/MediaLibrary';
import CaseStudiesManager from '../components/admin/CaseStudiesManager';
import RoleManager from '../components/admin/RoleManager';
import CommunityContentManager from '../components/admin/CommunityContentManager';
import ShortFormManager from '../components/admin/ShortFormManager';
import Toast from '../components/admin/Toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects');
    const [counts, setCounts] = useState({
        inbox: 0,
        orders: 0
    });

    React.useEffect(() => {
        // Initial fetch
        const fetchCounts = async () => {
            if (!supabase) return;
            
            const { count: inboxCount } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'unread');
                
            const { count: ordersCount } = await supabase
                .from('purchase_orders')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');
                
            setCounts({
                inbox: inboxCount || 0,
                orders: ordersCount || 0
            });
        };

        fetchCounts();

        // Real-time subscription
        const inboxChannel = supabase
            .channel('inbox-changes')
            .on('postgres_changes', { event: '*', table: 'messages', schema: 'public' }, () => {
                fetchCounts();
            })
            .subscribe();

        const ordersChannel = supabase
            .channel('orders-changes')
            .on('postgres_changes', { event: '*', table: 'purchase_orders', schema: 'public' }, () => {
                fetchCounts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(inboxChannel);
            supabase.removeChannel(ordersChannel);
        };
    }, []);

    const handleLogout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        navigate('/admin/login');
    };

    return (
        <div className="admin-dashboard">
            <Toast />
            <div className="admin-sidebar">
                <div className="admin-brand">
                    <h2>Admin Control</h2>
                </div>
                <nav className="admin-nav">
                    <div className="admin-nav-group-title">Content</div>
                    <button
                        className={`admin-nav-item ${activeTab === 'blog_manager' ? 'active' : ''}`}
                        onClick={() => setActiveTab('blog_manager')}
                    >
                        <LayoutList size={18} />
                        <span>Blog CMS</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'media' ? 'active' : ''}`}
                        onClick={() => setActiveTab('media')}
                    >
                        <LayoutList size={18} />
                        <span>Media Library</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                        onClick={() => setActiveTab('projects')}
                    >
                        <LayoutList size={18} />
                        <span>Projects</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'case_studies' ? 'active' : ''}`}
                        onClick={() => setActiveTab('case_studies')}
                    >
                        <LayoutList size={18} />
                        <span>Case Studies</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        <BarChart3 size={18} />
                        <span>Performances</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'testimonials' ? 'active' : ''}`}
                        onClick={() => setActiveTab('testimonials')}
                    >
                        <MessageSquareQuote size={18} />
                        <span>Testimonials</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'community' ? 'active' : ''}`}
                        onClick={() => setActiveTab('community')}
                    >
                        <Users size={18} />
                        <span>Community Content</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'short_form' ? 'active' : ''}`}
                        onClick={() => setActiveTab('short_form')}
                    >
                        <Play size={18} />
                        <span>Short-Form Content</span>
                    </button>

                    <div className="admin-nav-group-title">Commerce</div>
                    <button
                        className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <ShoppingBag size={18} />
                        <span>Digital Products</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <ShoppingCart size={18} />
                        <span>Orders</span>
                        {counts.orders > 0 && <span className="nav-badge">{counts.orders}</span>}
                    </button>

                    <div className="admin-nav-group-title">Marketing & CRM</div>

                    <button
                        className={`admin-nav-item ${activeTab === 'inbox' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inbox')}
                    >
                        <Mail size={18} />
                        <span>Inbox</span>
                        {counts.inbox > 0 && <span className="nav-badge">{counts.inbox}</span>}
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'newsletter' ? 'active' : ''}`}
                        onClick={() => setActiveTab('newsletter')}
                    >
                        <Users size={18} />
                        <span>Subscribers</span>
                    </button>

                    <div className="admin-nav-group-title">Analytics</div>
                    <button
                        className={`admin-nav-item ${activeTab === 'financials' ? 'active' : ''}`}
                        onClick={() => setActiveTab('financials')}
                    >
                        <LineChart size={18} />
                        <span>Financials</span>
                    </button>

                    <div className="admin-nav-group-title">Configuration</div>
                    <button
                        className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings size={18} />
                        <span>Site Settings</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'roles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('roles')}
                    >
                        <Shield size={18} />
                        <span>User Roles</span>
                    </button>
                </nav>
                <div className="admin-sidebar-footer">
                    <button className="admin-nav-item" onClick={() => navigate('/')}>
                        <Home size={18} />
                        <span>View Live Site</span>
                    </button>
                    <button className="admin-nav-item logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>

            <main className="admin-main">
                <header className="admin-header">
                    <h1>
                        {activeTab === 'blog_manager' && 'Blog CMS Manager'}
                        {activeTab === 'media' && 'Media Library'}
                        {activeTab === 'projects' && 'Manage Projects'}
                        {activeTab === 'case_studies' && 'Manage Case Studies'}
                        {activeTab === 'stats' && 'Manage Statistics'}
                        {activeTab === 'testimonials' && 'Client Testimonials'}
                        {activeTab === 'products' && 'Digital Products'}
                        {activeTab === 'orders' && 'Purchase Orders'}
                        {activeTab === 'inbox' && 'Message Inbox'}
                        {activeTab === 'newsletter' && 'Newsletter Audience'}
                        {activeTab === 'financials' && 'Financial Analytics'}
                        {activeTab === 'settings' && 'Global Site Settings'}
                        {activeTab === 'roles' && 'Team Access Roles'}
                        {activeTab === 'community' && 'Community Building Content'}
                        {activeTab === 'short_form' && 'The Era of Short-Form'}
                    </h1>
                </header>

                <div className="admin-content">
                    {activeTab === 'blog_manager' && <BlogManager />}
                    {activeTab === 'media' && <MediaLibrary />}
                    {activeTab === 'projects' && <ProjectForm />}
                    {activeTab === 'case_studies' && <CaseStudiesManager />}
                    {activeTab === 'stats' && <StatsManager />}
                    {activeTab === 'testimonials' && <TestimonialsManager />}
                    {activeTab === 'products' && <ProductsManager />}
                    {activeTab === 'orders' && <OrdersManager />}
                    {activeTab === 'inbox' && <InboxManager />}
                    {activeTab === 'newsletter' && <NewsletterManager />}
                    {activeTab === 'financials' && <FinancialAnalytics />}
                    {activeTab === 'settings' && <SettingsEditor />}
                    {activeTab === 'roles' && <RoleManager />}
                    {activeTab === 'community' && <CommunityContentManager />}
                    {activeTab === 'short_form' && <ShortFormManager />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
