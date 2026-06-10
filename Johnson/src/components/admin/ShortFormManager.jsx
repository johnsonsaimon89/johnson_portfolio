import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Trash2, Edit2, Plus, X, GripVertical, Video, Maximize2 } from 'lucide-react';
import ImageUploader from './ImageUploader';
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
                        {item.era && (
                            <span style={{ marginLeft: '8px', padding: '2px 6px', background: '#d1fae5', color: '#065f46', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase' }}>
                                {item.era}
                            </span>
                        )}
                    </div>
                    <div className="item-meta">
                        Views: {item.views || '0'}
                    </div>
                </div>
            </div>
            <div className="item-actions">
                <button className="action-btn edit" onClick={() => onEdit(item)} title="Edit"><Edit2 size={16} /></button>
                <button className="action-btn delete" onClick={() => onDelete(item.id)} title="Delete"><Trash2 size={16} /></button>
            </div>
        </div>
    );
};

const ShortFormManager = () => {
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
        title: '',
        views: '',
        era: 'The Era of Short-Form',
        category: 'Technique',
        video_url: '',
        media_items: [],
        display_order: 0
    });

    useEffect(() => {
        fetchItems();

        if (!supabase) return;

        const channel = supabase
            .channel('short-form-db-changes')
            .on('postgres_changes', { event: '*', table: 'short_form_content', schema: 'public' }, () => {
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
            .from('short_form_content')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching short-form content:', error);
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

            const { error } = await supabase.from('short_form_content').upsert(updates);
            
            if (error) {
                toast.error('Failed to save new order');
                fetchItems();
            } else {
                toast.success('Order updated');
            }
        }
    };

    const addMediaItem = (url) => {
        setFormData(prev => {
            const newItems = [...(prev.media_items || []), url];
            return {
                ...prev,
                media_items: newItems,
                video_url: prev.video_url || url // Sync first item to video_url
            };
        });
    };

    const removeMediaItem = (index) => {
        setFormData(prev => {
            const newItems = prev.media_items.filter((_, i) => i !== index);
            return {
                ...prev,
                media_items: newItems,
                video_url: newItems.length > 0 ? newItems[0] : ''
            };
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            views: '',
            era: 'The Era of Short-Form',
            category: 'Technique',
            video_url: '',
            media_items: [],
            display_order: 0
        });
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            views: item.views || '',
            era: item.era || 'The Era of Short-Form',
            category: item.category || 'Technique',
            video_url: item.video_url || '',
            media_items: item.media_items || [],
            display_order: item.display_order || 0
        });
        setCurrentId(item.id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        toast.confirm('Are you sure you want to delete this content? This action cannot be undone.', async () => {
            if (!supabase) return;
            
            try {
                const { error } = await supabase.from('short_form_content').delete().eq('id', id);
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
                    .from('short_form_content')
                    .update(dataToSave)
                    .eq('id', currentId);
                if (error) throw error;
                toast.success('Content updated');
            } else {
                const { error } = await supabase
                    .from('short_form_content')
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
                    <h3>{isEditing ? 'Edit Short-Form' : 'Add New Short-Form'}</h3>
                    {isEditing && (
                        <button className="icon-btn" onClick={resetForm} title="Cancel">
                            <X size={20} />
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Title (Caption)</label>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Viral Hook Strategy" />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Views Count</label>
                            <input type="text" name="views" value={formData.views} onChange={handleInputChange} placeholder="e.g. 2.1M" />
                        </div>
                        <div className="form-group half">
                            <label>Era / Section Label</label>
                            <input type="text" name="era" value={formData.era} onChange={handleInputChange} placeholder="The Era of Short-Form" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Category / Label (e.g. Technique, Distribution)</label>
                        <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="Technique" />
                    </div>

                    <div className="form-group">
                        <label>Media Items (Vertical Videos/Reels)</label>
                        <div className="media-items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            {formData.media_items?.map((item, idx) => (
                                <div key={idx} className="media-preview-container refined vertical" style={{ position: 'relative', aspectRatio: '9/16', borderRadius: '12px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <video src={item} muted loop playsInline onMouseEnter={e => e.target.play()} onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    
                                    <div className="preview-actions-overlay">
                                        <button 
                                            type="button" 
                                            className="preview-action-btn zoom"
                                            onClick={() => window.open(item, '_blank')}
                                            title="View Full Size"
                                        >
                                            <Maximize2 size={14} />
                                        </button>
                                        <button 
                                            type="button" 
                                            className="preview-action-btn delete"
                                            onClick={() => removeMediaItem(idx)}
                                            title="Remove"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="media-type-badge">VIDEO</div>
                                </div>
                            ))}
                            <div className="media-add-box" style={{ aspectRatio: '9/16' }}>
                                <ImageUploader
                                    bucketName="social_media"
                                    onUploadSuccess={addMediaItem}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Display Order</label>
                            <input type="number" name="display_order" value={formData.display_order} onChange={handleInputChange} />
                        </div>
                    </div>

                    <button type="submit" className="admin-submit-btn mt-2">
                        {isEditing ? 'Update Short-Form' : 'Add Short-Form'}
                    </button>
                </form>
            </div>

            <div className="admin-panel mt-3">
                <div className="panel-header">
                    <h3>Existing Content</h3>
                    <p style={{ fontSize: 'var(--fs-p2)', color: '#666', margin: 0 }}>Drag to reorder.</p>
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

export default ShortFormManager;
