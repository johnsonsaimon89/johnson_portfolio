import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Trash2, Edit2, X } from 'lucide-react';

const StatsManager = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentStat, setCurrentStat] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        metric_name: '',
        metric_value: '',
        category: 'general',
        trend: '',
        display_order: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('performances')
            .select('*')
            .order('display_order', { ascending: true })
            .order('category', { ascending: true });

        if (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load metrics');
        }
        else setStats(data || []);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            metric_name: '',
            metric_value: '',
            category: 'general',
            trend: '',
            display_order: 0
        });
        setIsEditing(false);
        setCurrentStat(null);
    };

    const handleEdit = (stat) => {
        setFormData({
            metric_name: stat.metric_name,
            metric_value: stat.metric_value,
            category: stat.category || 'general',
            trend: stat.trend || '',
            display_order: stat.display_order || 0
        });
        setCurrentStat(stat);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        toast.confirm('Are you sure you want to delete this metric?', async () => {
            if (!supabase) return;
            const { error } = await supabase.from('performances').delete().eq('id', id);
            if (error) {
                toast.error('Error deleting metric: ' + error.message);
            } else {
                toast.success('Metric deleted successfully');
                fetchStats();
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supabase) return;

        const statData = {
            metric_name: formData.metric_name,
            metric_value: formData.metric_value,
            category: formData.category,
            trend: formData.trend,
            display_order: parseInt(formData.display_order) || 0
        };

        try {
            if (isEditing && currentStat) {
                const { error } = await supabase
                    .from('performances')
                    .update(statData)
                    .eq('id', currentStat.id);

                if (error) throw error;
                toast.success('Metric updated successfully');
                resetForm();
                fetchStats();
            } else {
                const { error } = await supabase
                    .from('performances')
                    .insert([statData]);

                if (error) throw error;
                toast.success('Metric added successfully');
                resetForm();
                fetchStats();
            }
        } catch (error) {
            toast.error('Operation failed: ' + error.message);
        }
    };

    // Group stats by category for display
    const groupedStats = stats.reduce((acc, stat) => {
        const cat = stat.category || 'general';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(stat);
        return acc;
    }, {});

    return (
        <div className="admin-component-container">
            <div className="admin-panel">
                <div className="panel-header">
                    <h3>{isEditing ? 'Edit Metric' : 'Add New Metric'}</h3>
                    {isEditing && (
                        <button className="icon-btn" onClick={resetForm} title="Cancel Edit">
                            <X size={20} />
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Metric Name (e.g. Followers, Reach)</label>
                            <input type="text" name="metric_name" value={formData.metric_name} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group half">
                            <label>Metric Value (e.g. 50K+, 1.3M)</label>
                            <input type="text" name="metric_value" value={formData.metric_value} onChange={handleInputChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group third">
                            <label>Category (e.g. general, social)</label>
                            <input type="text" name="category" value={formData.category} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group third">
                            <label>Trend (optional, e.g. +15% MoM)</label>
                            <input type="text" name="trend" value={formData.trend} onChange={handleInputChange} />
                        </div>
                        <div className="form-group third">
                            <label>Display Order</label>
                            <input type="number" name="display_order" value={formData.display_order} onChange={handleInputChange} />
                        </div>
                    </div>

                    <button type="submit" className="admin-submit-btn mt-2">
                        {isEditing ? 'Update Metric' : 'Add Metric'}
                    </button>
                </form>
            </div>

            <div className="admin-panel mt-3">
                <div className="panel-header">
                    <h3>Existing Metrics</h3>
                </div>

                {loading ? (
                    <div className="admin-loading">Loading metrics...</div>
                ) : stats.length === 0 ? (
                    <div className="admin-empty">No metrics found. Add one above.</div>
                ) : (
                    <div className="admin-list-grouped">
                        {Object.entries(groupedStats).map(([category, items]) => (
                            <div key={category} className="admin-group">
                                <h4 className="admin-group-title">Category: {category}</h4>
                                 <div className="admin-grid-3">
                                    {items.map((stat) => (
                                        <div key={stat.id} className="admin-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                                            <div className="item-content">
                                                <div className="item-title" style={{ fontSize: 'var(--fs-p1)', fontWeight: '800' }}>{stat.metric_value}</div>
                                                <div className="item-subtitle" style={{ fontSize: 'var(--fs-p2)', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{stat.metric_name}</div>
                                                <div className="item-meta mt-1">
                                                    {stat.trend && <span className="indicator indicator-success">{stat.trend}</span>}
                                                </div>
                                            </div>
                                            <div className="item-actions" style={{ width: '100%', justifyContent: 'flex-end', borderTop: '1px solid var(--admin-border)', paddingTop: '0.75rem' }}>
                                                <button className="action-btn edit" onClick={() => handleEdit(stat)} title="Edit">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="action-btn delete" onClick={() => handleDelete(stat.id)} title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsManager;
