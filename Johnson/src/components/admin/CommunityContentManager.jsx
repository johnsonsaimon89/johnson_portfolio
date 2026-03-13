import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Trash2, Edit2, Plus, X, GripVertical, Image as ImageIcon } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './AdminComponents.css';

const SortableItem = ({ item, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 2 : 1,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`admin-list-item ${isDragging ? 'is-dragging' : ''}`}
        >
            <div className="item-main">
                <div className="drag-handle" {...attributes} {...listeners}>
                    <GripVertical size={20} />
                </div>
                <div className="item-content">
                    <div className="item-title">
                        {item.title}
                        <span style={{ marginLeft: '8px', padding: '2px 6px', background: '#e0e7ff', color: '#4338ca', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase' }}>
                            {item.type}
                        </span>
                    </div>
                    <div className="item-meta">
                        {item.description?.substring(0, 100)}{item.description?.length > 100 ? '...' : ''}
                    </div>
                    {item.metrics && (
                        <div className="item-meta" style={{ fontSize: '11px', color: 'var(--brand-accent)' }}>
                            {Object.entries(item.metrics).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                        </div>
                    )}
                </div>
            </div>
            <div className="item-actions">
                <button className="action-btn edit" onClick={() => onEdit(item)} title="Edit"><Edit2 size={16} /></button>
                <button className="action-btn delete" onClick={() => onDelete(item.id)} title="Delete"><Trash2 size={16} /></button>
            </div>
        </div>
    );
};

const CommunityContentManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [formData, setFormData] = useState({
        type: 'image',
        title: '',
        description: '',
        hook: '',
        metrics: { likes: '', comments: '', saves: '' },
        image_url: '',
        display_order: 0
    });

    useEffect(() => {
        fetchItems();

        if (!supabase) return;

        const channel = supabase
            .channel('community-content-db-changes')
            .on('postgres_changes', { event: '*', table: 'community_content', schema: 'public' }, () => {
                fetchItems();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchItems = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('community_content')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching community content:', error);
        else setItems(data || []);
        setLoading(false);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = items.findIndex((t) => t.id === active.id);
            const newIndex = items.findIndex((t) => t.id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            
            setItems(newItems);

            const updates = newItems.map((t, index) => ({
                id: t.id,
                display_order: index + 1
            }));

            const { error } = await supabase.from('community_content').upsert(updates);
            
            if (error) {
                toast.error('Failed to save new order');
                fetchItems();
            } else {
                toast.success('Order updated');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('metric_')) {
            const metricKey = name.replace('metric_', '');
            setFormData(prev => ({
                ...prev,
                metrics: { ...prev.metrics, [metricKey]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'image',
            title: '',
            description: '',
            hook: '',
            metrics: { likes: '', comments: '', saves: '' },
            image_url: '',
            display_order: 0
        });
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleEdit = (item) => {
        setFormData({
            type: item.type,
            title: item.title,
            description: item.description || '',
            hook: item.hook || '',
            metrics: item.metrics || { likes: '', comments: '', saves: '' },
            image_url: item.image_url || '',
            display_order: item.display_order || 0
        });
        setCurrentId(item.id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        toast.confirm('Are you sure you want to delete this content? This action cannot be undone.', async () => {
            if (!supabase) return;
            
            try {
                const { error } = await supabase.from('community_content').delete().eq('id', id);
                if (error) throw error;
                
                toast.success('Content deleted successfully');
                fetchItems();
            } catch (error) {
                toast.error('Error deleting: ' + error.message);
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supabase) return;

        const dataToSave = {
            ...formData,
            display_order: parseInt(formData.display_order) || 0
        };

        try {
            if (isEditing && currentId) {
                const { error } = await supabase
                    .from('community_content')
                    .update(dataToSave)
                    .eq('id', currentId);
                if (error) throw error;
                toast.success('Content updated');
            } else {
                const { error } = await supabase
                    .from('community_content')
                    .insert([dataToSave]);
                if (error) throw error;
                toast.success('Content added');
            }
            resetForm();
            fetchItems();
        } catch (error) {
            toast.error('Operation failed: ' + error.message);
        }
    };

    return (
        <div className="admin-component-container">
            <div className="admin-panel">
                <div className="panel-header">
                    <h3>{isEditing ? 'Edit Community Content' : 'Add New Community Content'}</h3>
                    {isEditing && (
                        <button className="icon-btn" onClick={resetForm} title="Cancel">
                            <X size={20} />
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Type</label>
                            <select name="type" value={formData.type} onChange={handleInputChange}>
                                <option value="image">Image</option>
                                <option value="carousel">Carousel</option>
                                <option value="quote">Quote</option>
                                <option value="reel">Reel</option>
                            </select>
                        </div>
                        <div className="form-group half">
                            <label>Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Hook (Short punchy line)</label>
                        <input type="text" name="hook" value={formData.hook} onChange={handleInputChange} placeholder="e.g. I use macro photography to highlight features that stop the scroll." />
                    </div>

                    <div className="form-group">
                        <label>Description (Detailed version for modal)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Explain the strategy behind this content..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Image URL</label>
                            <input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://..." />
                        </div>
                        <div className="form-group half">
                            <label>Display Order</label>
                            <input type="number" name="display_order" value={formData.display_order} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="panel-header" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Metrics</h4>
                    </div>
                    <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Likes</label>
                            <input type="text" name="metric_likes" value={formData.metrics.likes} onChange={handleInputChange} placeholder="e.g. 4.2k" />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Comments</label>
                            <input type="text" name="metric_comments" value={formData.metrics.comments} onChange={handleInputChange} placeholder="e.g. 128" />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Saves</label>
                            <input type="text" name="metric_saves" value={formData.metrics.saves} onChange={handleInputChange} placeholder="e.g. 2.1k" />
                        </div>
                    </div>

                    <button type="submit" className="admin-submit-btn mt-2">
                        {isEditing ? 'Update Content' : 'Add Content'}
                    </button>
                </form>
            </div>

            <div className="admin-panel mt-3">
                <div className="panel-header">
                    <h3>Existing Content</h3>
                    <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>Drag to reorder.</p>
                </div>
                {loading ? (
                    <div className="admin-loading">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="admin-empty">No content yet.</div>
                ) : (
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext 
                            items={items.map(t => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="admin-list">
                                {items.map((item) => (
                                    <SortableItem 
                                        key={item.id} 
                                        item={item} 
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
};

export default CommunityContentManager;
