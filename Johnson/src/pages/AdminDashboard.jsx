import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, LayoutList, BarChart3, Mail, MessageSquareQuote, Settings, ShoppingBag, ShoppingCart, LineChart, Shield, Users, Play, Send, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


import InboxManager from '../components/admin/InboxManager';
import TestimonialsManager from '../components/admin/TestimonialsManager';
import SettingsEditor from '../components/admin/SettingsEditor';
import ProductsManager from '../components/admin/ProductsManager';
import OrdersManager from '../components/admin/OrdersManager';
import NewsletterManager from '../components/admin/NewsletterManager';
import FinancialAnalytics from '../components/admin/FinancialAnalytics';
import BlogManager from '../components/admin/cms/BlogManager';
import MediaLibrary from '../components/admin/MediaLibrary';
import PageImagesManager from '../components/admin/PageImagesManager';
import CaseStudiesManager from '../components/admin/CaseStudiesManager';
import ProjectsManager from '../components/admin/ProjectsManager';
import RoleManager from '../components/admin/RoleManager';
import CommunityContentManager from '../components/admin/CommunityContentManager';
import EmailBroadcastManager from '../components/admin/EmailBroadcastManager';
import EmailTemplatesManager from '../components/admin/EmailTemplatesManager';
import ShortFormManager from '../components/admin/ShortFormManager';
import HeroManager from '../components/admin/HeroManager';
import Toast from '../components/admin/Toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('blog_manager');
    const [expandedNav, setExpandedNav] = useState({ case_studies: false });
    const [counts, setCounts] = useState({
        inbox: 0,
        orders: 0
    });

    const tabThemes = {
        blog_manager: '#10b981',
        hero_manager: '#ec4899',
        media: '#0ea5e9',
        page_images: '#f59e0b',
        case_studies: '#6366f1',
        testimonials: '#f59e0b',
        community: '#8b5cf6',
        short_form: '#f43f5e',
        products: '#f97316',
        orders: '#0d9488',
        inbox: '#3b82f6',
        newsletter: '#ec4899',
        email_templates: '#06b6d4',
        campaigns: '#a855f7',
        financials: '#10b981',
        settings: '#64748b',
        roles: '#e11d48'
    };

    React.useEffect(() => {
        // Apply active tab theme to CSS variable
        const accent = tabThemes[activeTab] || '#000000';
        document.documentElement.style.setProperty('--tab-accent', accent);
    }, [activeTab]);

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
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="brand-logo" 
                        style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #fff, #e2e8f0)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    >
                        J
                    </motion.div>
                    <h2>Admin Panel</h2>
                </div>

                <div className="admin-user-profile">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div className="user-avatar">
                            <Users size={18} />
                        </div>
                        <div className="user-info" style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: 'var(--fs-p2)', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Johnson</div>
                            <div style={{ fontSize: 'var(--fs-p2)', color: '#71717a', textTransform: 'capitalize' }}>Administrator</div>
                        </div>
                    </div>
                </div>

                <nav className="admin-nav">
                    <div className="admin-nav-group-title">Core Management</div>
                    
                    {/* Blog Manager */}
                    <motion.button
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`admin-nav-item ${activeTab === 'blog_manager' ? 'active' : ''}`}
                        onClick={() => setActiveTab('blog_manager')}
                        style={{ '--tab-accent': tabThemes['blog_manager'] }}
                    >
                        <LayoutList size={18} color={tabThemes['blog_manager']} style={{ opacity: activeTab === 'blog_manager' ? 1 : 0.8 }} />
                        <span>Blog CMS</span>
                        {activeTab === 'blog_manager' && <motion.div layoutId="active-pill" className="active-pill" />}
                    </motion.button>
                                        {/* Media Library */}
                    <motion.button
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.05 }}
                        className={`admin-nav-item ${activeTab === 'media' ? 'active' : ''}`}
                        onClick={() => setActiveTab('media')}
                        style={{ '--tab-accent': tabThemes['media'] }}
                    >
                        <LayoutList size={18} color={tabThemes['media']} style={{ opacity: activeTab === 'media' ? 1 : 0.8 }} />
                        <span>Media Library</span>
                        {activeTab === 'media' && <motion.div layoutId="active-pill" className="active-pill" />}
                    </motion.button>


                    {/* My Work (Dropdown) */}
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="nav-dropdown-container"
                    >
                        <button
                            className={`admin-nav-item ${activeTab.startsWith('case_studies') || activeTab === 'projects' ? 'active' : ''}`}
                            onClick={() => {
                                setExpandedNav(prev => ({ ...prev, case_studies: !prev.case_studies }));
                                if (!activeTab.startsWith('case_studies') && activeTab !== 'projects') {
                                    setActiveTab('case_studies_all');
                                }
                            }}
                            style={{ '--tab-accent': tabThemes['case_studies'] }}
                        >
                            <LayoutList size={18} color={tabThemes['case_studies']} style={{ opacity: activeTab.startsWith('case_studies') || activeTab === 'projects' ? 1 : 0.8 }} />
                            <span>My Work</span>
                            <ChevronRight size={14} style={{ marginLeft: 'auto', transform: expandedNav.case_studies ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', color: '#71717a' }} />
                            {(activeTab.startsWith('case_studies') || activeTab === 'projects') && <motion.div layoutId="active-pill" className="active-pill" />}
                        </button>
                        
                        <AnimatePresence>
                            {expandedNav.case_studies && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    style={{ overflow: 'hidden', marginLeft: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.2rem', marginBottom: '0.5rem' }}
                                >
                                    {[
                                        { id: 'case_studies_all', label: 'Case Studies' },
                                        { id: 'projects', label: 'Slideshow Carousel' }
                                    ].map(sub => (
                                        <button 
                                            key={sub.id}
                                            className={`admin-nav-subitem ${activeTab === sub.id ? 'active' : ''}`} 
                                            onClick={() => setActiveTab(sub.id)}
                                            style={{ 
                                                background: 'transparent', border: 'none', color: activeTab === sub.id ? '#fff' : '#a1a1aa', 
                                                textAlign: 'left', padding: '0.4rem 0.8rem', fontSize: 'var(--fs-p2)', fontWeight: activeTab === sub.id ? '600' : '400',
                                                cursor: 'pointer', borderRadius: '0 6px 6px 0', transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => { if(activeTab !== sub.id) e.target.style.color = '#fff'; }}
                                            onMouseLeave={(e) => { if(activeTab !== sub.id) e.target.style.color = '#a1a1aa'; }}
                                        >
                                            {sub.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <div className="admin-nav-group-title mt-4">Engagement</div>
                    {[
                        { id: 'testimonials', label: 'Testimonials', icon: <MessageSquareQuote size={18} /> },
                        { id: 'community', label: 'Community', icon: <Users size={18} /> },
                    ].map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: (index + 3) * 0.05 }}
                            className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                            style={{ '--tab-accent': tabThemes[item.id] }}
                        >
                            {React.cloneElement(item.icon, { color: tabThemes[item.id], style: { opacity: activeTab === item.id ? 1 : 0.8 } })}
                            <span>{item.label}</span>
                            {activeTab === item.id && <motion.div layoutId="active-pill" className="active-pill" />}
                        </motion.button>
                    ))}

                    <div className="admin-nav-group-title">Commerce</div>
                    {[
                        { id: 'products', label: 'Digital Products', icon: <ShoppingBag size={18} /> },
                        { id: 'orders', label: 'Orders', icon: <ShoppingCart size={18} />, badge: counts.orders },
                    ].map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: (index + 6) * 0.05 }}
                            className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                            style={{ '--tab-accent': tabThemes[item.id] }}
                        >
                            {React.cloneElement(item.icon, { color: tabThemes[item.id], style: { opacity: activeTab === item.id ? 1 : 0.8 } })}
                            <span>{item.label}</span>
                            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                            {activeTab === item.id && <motion.div layoutId="active-pill" className="active-pill" />}
                        </motion.button>
                    ))}

                    <div className="admin-nav-group-title">Communication</div>
                    {[
                        { id: 'inbox', label: 'Inbox', icon: <Mail size={18} />, badge: counts.inbox },
                        { id: 'newsletter', label: 'Subscribers', icon: <Users size={18} /> },
                        { id: 'email_templates', label: 'Templates', icon: <Mail size={18} /> },
                        { id: 'campaigns', label: 'Campaigns', icon: <Send size={18} /> },
                    ].map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: (index + 8) * 0.05 }}
                            className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                            style={{ '--tab-accent': tabThemes[item.id] }}
                        >
                            {React.cloneElement(item.icon, { color: tabThemes[item.id], style: { opacity: activeTab === item.id ? 1 : 0.8 } })}
                            <span>{item.label}</span>
                            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                            {activeTab === item.id && <motion.div layoutId="active-pill" className="active-pill" />}
                        </motion.button>
                    ))}

                    <div className="admin-nav-group-title">System</div>
                    {[
                        { id: 'financials', label: 'Financials', icon: <LineChart size={18} /> },
                        { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
                    ].map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: (index + 12) * 0.05 }}
                            className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                            style={{ '--tab-accent': tabThemes[item.id] }}
                        >
                            {React.cloneElement(item.icon, { color: tabThemes[item.id], style: { opacity: activeTab === item.id ? 1 : 0.8 } })}
                            <span>{item.label}</span>
                            {activeTab === item.id && <motion.div layoutId="active-pill" className="active-pill" />}
                        </motion.button>
                    ))}
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
                    <div className="header-title">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: 'var(--fs-p2)', fontWeight: '800', textTransform: 'uppercase', color: '#71717a', letterSpacing: '0.05em' }}>Dashboard</span>
                            <ChevronRight size={12} style={{ color: '#a1a1aa' }} />
                            <span style={{ fontSize: 'var(--fs-p2)', fontWeight: '900', textTransform: 'uppercase', color: tabThemes[activeTab], letterSpacing: '0.08em', transition: 'color 0.3s ease' }}>
                                {activeTab.replace('_', ' ')}
                            </span>
                        </div>
                        <h1>
                            {activeTab === 'blog_manager' && 'Blog CMS Manager'}
                            {activeTab === 'media' && 'Media Library'}
                            {activeTab === 'case_studies' && 'Manage Case Studies'}
                            {activeTab === 'projects' && 'Manage Carousel Projects'}
                            {activeTab === 'testimonials' && 'Client Testimonials'}
                            {activeTab === 'products' && 'Digital Products'}
                            {activeTab === 'orders' && 'Purchase Orders'}
                            {activeTab === 'inbox' && 'Message Inbox'}
                            {activeTab === 'newsletter' && 'Newsletter Audience'}
                            {activeTab === 'financials' && 'Financial Analytics'}
                            {activeTab === 'settings' && 'Global Site Settings'}
                            {activeTab === 'email_templates' && 'Email Templates'}
                            {activeTab === 'campaigns' && 'Email Campaign Broadcast'}
                            {activeTab === 'community' && 'Community Building Content'}
                        </h1>
                    </div>
                    <div className="header-actions">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                        >
                            <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                                <div style={{ fontSize: 'var(--fs-p2)', color: '#71717a', fontWeight: '500' }}>System Status</div>
                                <div style={{ fontSize: 'var(--fs-p2)', fontWeight: '600', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <div className="header-status-dot"></div>
                                    Operational
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </header>

                <div className="admin-content">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{ height: '100%' }}
                        >
                            {activeTab === 'blog_manager' && <BlogManager />}
                            {activeTab === 'media' && <MediaLibrary />}
                            {activeTab.startsWith('case_studies') && <CaseStudiesManager initialFilter={activeTab.split('_')[2] || 'all'} />}
                            {activeTab === 'projects' && <ProjectsManager />}
                            {activeTab === 'testimonials' && <TestimonialsManager />}
                            {activeTab === 'products' && <ProductsManager />}
                            {activeTab === 'orders' && <OrdersManager />}
                            {activeTab === 'inbox' && <InboxManager />}
                            {activeTab === 'newsletter' && <NewsletterManager />}
                            {activeTab === 'financials' && <FinancialAnalytics />}
                            {activeTab === 'settings' && <SettingsEditor />}
                            {activeTab === 'email_templates' && <EmailTemplatesManager />}
                            {activeTab === 'campaigns' && <EmailBroadcastManager />}
                            {activeTab === 'community' && <CommunityContentManager />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
