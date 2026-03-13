import { toast } from '../../utils/toast';
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Trash2, Edit2, Plus, X, GripVertical } from 'lucide-react';
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

const SortableTestimonial = ({ item, onEdit, onDelete }) => {
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
                    <div className="item-title" style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                        "{item.quote}"
                    </div>
                    <div className="item-meta">
                        <strong>{item.author}</strong> {item.role && `- ${item.role}`} {item.company && `at ${item.company}`} •
                        <span style={{ marginLeft: '4px', padding: '2px 6px', background: '#e0e7ff', color: '#4338ca', borderRadius: '4px', fontSize: '11px' }}>
                            {item.category?.replace('_', ' ').toUpperCase() || 'GENERAL'}
                        </span> • Order: {item.display_order}
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

const TestimonialsManager = () => {
    const [testimonials, setTestimonials] = useState([]);
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
        quote: '',
        author: '',
        role: '',
        company: '',
        category: 'general',
        display_order: 0
    });

    useEffect(() => {
        fetchTestimonials();

        if (!supabase) return;

        const channel = supabase
            .channel('testimonials-db-changes')
            .on('postgres_changes', { event: '*', table: 'testimonials', schema: 'public' }, () => {
                fetchTestimonials();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchTestimonials = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching testimonials:', error);
        else setTestimonials(data || []);
        setLoading(false);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = testimonials.findIndex((t) => t.id === active.id);
            const newIndex = testimonials.findIndex((t) => t.id === over.id);

            const newTestimonials = arrayMove(testimonials, oldIndex, newIndex);
            
            // Optimistically update UI
            setTestimonials(newTestimonials);

            // Update database
            const updates = newTestimonials.map((t, index) => ({
                id: t.id,
                display_order: index + 1
            }));

            const { error } = await supabase.from('testimonials').upsert(updates);
            
            if (error) {
                toast.error('Failed to save new order');
                fetchTestimonials(); // Revert on error
            } else {
                toast.success('Order updated');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ quote: '', author: '', role: '', company: '', category: 'general', display_order: 0 });
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleEdit = (item) => {
        setFormData({
            quote: item.quote,
            author: item.author,
            role: item.role || '',
            company: item.company || '',
            category: item.category || 'general',
            display_order: item.display_order || 0
        });
        setCurrentId(item.id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        toast.confirm('Are you sure you want to delete this testimonial? This action cannot be undone.', async () => {
            if (!supabase) return;
            
            try {
                const { error } = await supabase.from('testimonials').delete().eq('id', id);
                if (error) throw error;
                
                toast.success('Testimonial deleted successfully');
                fetchTestimonials();
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
                    .from('testimonials')
                    .update(dataToSave)
                    .eq('id', currentId);
                if (error) throw error;
                toast.success('Testimonial updated');
            } else {
                const { error } = await supabase
                    .from('testimonials')
                    .insert([dataToSave]);
                if (error) throw error;
                toast.success('Testimonial added');
            }
            resetForm();
            fetchTestimonials();
        } catch (error) {
            toast.error('Operation failed: ' + error.message);
        }
    };

    return (
        <div className="admin-component-container">
            <div className="admin-panel">
                <div className="panel-header">
                    <h3>{isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
                    {isEditing && (
                        <button className="icon-btn" onClick={resetForm} title="Cancel">
                            <X size={20} />
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Quote</label>
                        <textarea
                            name="quote"
                            value={formData.quote}
                            onChange={handleInputChange}
                            required
                            rows="4"
                            placeholder="What did the client say?"
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Author Name</label>
                            <input type="text" name="author" value={formData.author} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group half">
                            <label>Role (e.g., CEO, Director)</label>
                            <input type="text" name="role" value={formData.role} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Category (Where should this show?)</label>
                            <select name="category" value={formData.category} onChange={handleInputChange}>
                                <option value="general">General (Homepage)</option>
                                <option value="web_design">Web Design Services</option>
                                <option value="social_media">Social Media Services</option>
                            </select>
                        </div>
                        <div className="form-group half">
                            <label>Company</label>
                            <input type="text" name="company" value={formData.company} onChange={handleInputChange} />
                        </div>
                        <div className="form-group half">
                            <label>Display Order</label>
                            <input type="number" name="display_order" value={formData.display_order} onChange={handleInputChange} />
                        </div>
                    </div>
                    <button type="submit" className="admin-submit-btn mt-2">
                        {isEditing ? 'Update Testimonial' : 'Add Testimonial'}
                    </button>
                </form>
            </div>

            <div className="admin-panel mt-3">
                <div className="panel-header">
                    <h3>Existing Testimonials</h3>
                    <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>Drag the handle <GripVertical size={14} style={{ verticalAlign: 'middle' }} /> to reorder.</p>
                </div>
                {loading ? (
                    <div className="admin-loading">Loading...</div>
                ) : testimonials.length === 0 ? (
                    <div className="admin-empty">No testimonials yet.</div>
                ) : (
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext 
                            items={testimonials.map(t => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="admin-list">
                                {testimonials.map((item) => (
                                    <SortableTestimonial 
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

export default TestimonialsManager;
