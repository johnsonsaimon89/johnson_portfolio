import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Trash2, Edit2, Plus, X, GripVertical, Database } from 'lucide-react';
import CaseStudyForm from './CaseStudyForm';
import { toast } from '../../utils/toast';
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
import { webData } from '../../data/webData';

const SortableItem = ({ study, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: study.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 1,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="premium-list-item">
            <div className="item-main">
                <div className="drag-handle" {...attributes} {...listeners}>
                    <GripVertical size={20} color="#999" />
                </div>
                <div className="item-type-indicator" data-type={study.type}>
                    {study.type === 'web' ? 'W' : 'S'}
                </div>
                <div className="item-info">
                    <div className="item-title-row">
                        <span className="item-title">{study.organization_name}</span>
                        {!study.is_active && <span className="draft-badge">Draft</span>}
                    </div>
                    <div className="item-subtitle">{study.organization_type}</div>
                    {study.content.tool_stack && (
                        <div className="item-tools-preview">
                            {study.content.tool_stack.split(',').slice(0, 3).map((t, i) => (
                                <span key={i} className="tool-tag-sm">{t.trim()}</span>
                            ))}
                            {study.content.tool_stack.split(',').length > 3 && (
                                <span className="tool-more">+{study.content.tool_stack.split(',').length - 3}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="item-actions-premium">
                <button className="icon-action-btn edit" onClick={() => onEdit(study)} title="Edit">
                    <Edit2 size={18} />
                </button>
                <button className="icon-action-btn delete" onClick={() => onDelete(study.id)} title="Delete">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

const CaseStudiesManager = () => {
    const [caseStudies, setCaseStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCaseStudy, setCurrentCaseStudy] = useState(null);
    const [filterType, setFilterType] = useState('all');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchCaseStudies();
    }, []);

    const fetchCaseStudies = async (retryCount = 0) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('case_studies')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            setCaseStudies(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching case studies:', error);
            if (retryCount < 2) {
                console.log(`Retrying fetch (${retryCount + 1})...`);
                setTimeout(() => fetchCaseStudies(retryCount + 1), 2000);
            } else {
                toast.error('Failed to load case studies. Please check your connection.');
                setLoading(false);
            }
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setCaseStudies((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                
                // Proactively update database
                updateOrderInDB(newItems);
                
                return newItems;
            });
        }
    };

    const updateOrderInDB = async (items) => {
        if (filterType !== 'all') {
            toast.warning('Reordering is disabled when filtering');
            return;
        }

        const updates = items.map((item, index) => ({
            id: item.id,
            display_order: index
        }));

        for (const update of updates) {
            const { error } = await supabase
                .from('case_studies')
                .update({ display_order: update.display_order })
                .eq('id', update.id);
            if (error) console.error('Error updating order:', error);
        }
        toast.success('Order synchronized');
    };

    const handleSeedData = async () => {
        toast.confirm('This will seed existing web projects into your database. Continue?', async () => {
            const projects = webData.projects.map((p, index) => ({
                type: 'web',
                organization_name: p.client,
                organization_type: p.industry,
                is_active: true,
                display_order: index,
                content: {
                    paragraphs: [p.challenge, p.solution, p.outcome],
                    metrics: {
                        visitors: p.results.mobileEngagement || p.results.interactionTime || '',
                        sales: p.results.conversion || '',
                        signups: p.results.formSubmissions || ''
                    },
                    custom_metrics: Object.entries(p.results)
                        .filter(([k]) => !['mobileEngagement', 'interactionTime', 'conversion', 'formSubmissions'].includes(k))
                        .map(([k, v]) => ({ label: k, value: v })),
                    colors: p.colors || ['#6366f1', '#1e293b', '#f8fafc'],
                    tool_stack: p.tools?.join(', ') || ''
                }
            }));

            const { error } = await supabase.from('case_studies').insert(projects);
            if (error) {
                toast.error('Seed failed: ' + error.message);
            } else {
                toast.success('Database seeded successfully');
                fetchCaseStudies();
            }
        });
    };

    const handleSave = async (formData) => {
        if (isEditing && currentCaseStudy) {
            const { error } = await supabase
                .from('case_studies')
                .update(formData)
                .eq('id', currentCaseStudy.id);

            if (error) {
                toast.error('Error updating case study: ' + error.message);
            } else {
                toast.success('Case study updated successfully');
                setIsEditing(false);
                setCurrentCaseStudy(null);
                fetchCaseStudies();
            }
        } else {
            const { error } = await supabase
                .from('case_studies')
                .insert([formData]);

            if (error) {
                toast.error('Error adding case study: ' + error.message);
            } else {
                toast.success('Case study added successfully');
                setIsAdding(false);
                fetchCaseStudies();
            }
        }
    };

    const handleDelete = async (id) => {
        toast.confirm('Are you sure you want to delete this case study?', async () => {
            const { error } = await supabase
                .from('case_studies')
                .delete()
                .eq('id', id);

            if (error) {
                toast.error('Error deleting case study: ' + error.message);
            } else {
                toast.success('Case study deleted successfully');
                fetchCaseStudies();
            }
        });
    };

    const filteredStudies = filterType === 'all' 
        ? caseStudies 
        : caseStudies.filter(s => s.type === filterType);

    return (
        <div className="admin-component-container refined-manager">
            <div className="admin-panel premium-panel">
                <div className="panel-header-refined">
                    <div className="header-text">
                        <h3>Case Studies</h3>
                        <p>Manage your portfolio projects and social media impact stories.</p>
                    </div>
                    {!isAdding && !isEditing && (
                        <div className="header-actions">
                            <button className="premium-add-btn secondary-outline" onClick={handleSeedData} title="Seed existing data">
                                <Database size={18} /> Seed Data
                            </button>
                            <button className="premium-add-btn" onClick={() => setIsAdding(true)}>
                                <Plus size={18} /> New Case Study
                            </button>
                        </div>
                    )}
                </div>

                {(isAdding || isEditing) ? (
                    <div className="form-container-fade">
                        <CaseStudyForm 
                            initialData={currentCaseStudy} 
                            onSave={handleSave} 
                            onCancel={() => {
                                setIsAdding(false);
                                setIsEditing(false);
                                setCurrentCaseStudy(null);
                            }} 
                        />
                    </div>
                ) : (
                    <>
                        <div className="manager-toolbar">
                            <div className="filter-group">
                                <label>Content Category</label>
                                <div className="tab-filters">
                                    {['all', 'web', 'social'].map(type => (
                                        <button 
                                            key={type}
                                            className={`tab-filter-btn ${filterType === type ? 'active' : ''}`}
                                            onClick={() => setFilterType(type)}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="admin-loading-shimmer">
                                <div className="shimmer-item"></div>
                                <div className="shimmer-item"></div>
                                <div className="shimmer-item"></div>
                            </div>
                        ) : filteredStudies.length === 0 ? (
                            <div className="admin-empty-state">
                                <div className="empty-icon">📁</div>
                                <h4>No case studies found</h4>
                                <p>Start by adding your first project or campaign.</p>
                                <button className="premium-add-btn secondary" onClick={() => setIsAdding(true)}>
                                    <Plus size={18} /> Add Your First Item
                                </button>
                            </div>
                        ) : (
                            <DndContext 
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext 
                                    items={filteredStudies.map(s => s.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="premium-list">
                                        {filteredStudies.map((study) => (
                                            <SortableItem 
                                                key={study.id} 
                                                study={study} 
                                                onEdit={(s) => {
                                                    setCurrentCaseStudy(s);
                                                    setIsEditing(true);
                                                }}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                    </>
                )}
            </div>

            <style jsx>{`
                .drag-handle {
                    cursor: grab;
                    padding: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    transition: background 0.2s;
                }
                .drag-handle:hover {
                    background: #f3f4f6;
                }
                .drag-handle:active {
                    cursor: grabbing;
                }
                .header-actions {
                    display: flex;
                    gap: 1rem;
                }
                .premium-add-btn.secondary-outline {
                    background: transparent;
                    border: 1px solid #ddd;
                    color: #666;
                }
                .premium-add-btn.secondary-outline:hover {
                    background: #f9fafb;
                    border-color: #000;
                    color: #000;
                }
                .refined-manager {
                    padding: 1rem 0;
                }
                .premium-panel {
                    border-radius: 16px !important;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
                }
                .panel-header-refined {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 3rem;
                }
                .header-text h3 {
                    font-size: 1.5rem;
                    margin: 0 0 0.5rem 0;
                    color: #111;
                }
                .header-text p {
                    margin: 0;
                    color: #666;
                    font-size: 0.95rem;
                }
                .premium-add-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    background: #000;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .premium-add-btn:hover {
                    background: #333;
                    transform: translateY(-1px);
                }
                .manager-toolbar {
                    margin-bottom: 2rem;
                    background: #f9fafb;
                    padding: 1.5rem;
                    border-radius: 12px;
                }
                .filter-group label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #9ca3af;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.75rem;
                }
                .tab-filters {
                    display: flex;
                    gap: 0.5rem;
                    background: #eee;
                    padding: 0.25rem;
                    border-radius: 8px;
                    width: fit-content;
                }
                .tab-filter-btn {
                    padding: 0.5rem 1rem;
                    border: none;
                    background: transparent;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #666;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tab-filter-btn.active {
                    background: #fff;
                    color: #000;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .premium-list {
                    display: grid;
                    gap: 1rem;
                }
                .premium-list-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem;
                    background: #fff;
                    border: 1px solid #eee;
                    border-radius: 12px;
                    transition: all 0.2s;
                }
                .premium-list-item:hover {
                    border-color: #000;
                    transform: translateX(4px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                }
                .item-main {
                    display: flex;
                    gap: 1.25rem;
                    align-items: center;
                }
                .item-type-indicator {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    font-weight: 800;
                    font-size: 1rem;
                }
                .item-type-indicator[data-type="web"] {
                    background: #eff6ff;
                    color: #3b82f6;
                }
                .item-type-indicator[data-type="social"] {
                    background: #fef2f2;
                    color: #ef4444;
                }
                .item-title {
                    font-weight: 700;
                    font-size: 1.05rem;
                    color: #111;
                }
                .draft-badge {
                    font-size: 0.7rem;
                    background: #f3f4f6;
                    color: #6b7280;
                    padding: 0.1rem 0.4rem;
                    border-radius: 4px;
                    font-weight: 600;
                    margin-left: 0.5rem;
                }
                .item-subtitle {
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin: 0.1rem 0 0.5rem 0;
                }
                .item-tools-preview {
                    display: flex;
                    gap: 0.4rem;
                    align-items: center;
                }
                .tool-tag-sm {
                    font-size: 0.7rem;
                    background: #f1f5f9;
                    border: 1px solid #cbd5e1;
                    padding: 0.1rem 0.5rem;
                    border-radius: 4px;
                    color: #475569;
                }
                .tool-more {
                    font-size: 0.7rem;
                    color: #94a3b8;
                    font-weight: 600;
                }
                .item-actions-premium {
                    display: flex;
                    gap: 0.75rem;
                }
                .icon-action-btn {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    border: 1px solid #eee;
                    background: #fff;
                    color: #666;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .icon-action-btn:hover {
                    background: #000;
                    color: #fff;
                    border-color: #000;
                }
                .icon-action-btn.delete:hover {
                    background: #ef4444;
                    border-color: #ef4444;
                }
                .admin-empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: #f9fafb;
                    border-radius: 16px;
                    border: 2px dashed #e5e7eb;
                }
                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 1.5rem;
                }
                .admin-empty-state h4 {
                    margin: 0 0 0.5rem 0;
                    color: #111;
                }
                .admin-empty-state p {
                    color: #666;
                    margin-bottom: 2rem;
                }
                .admin-empty-state .premium-add-btn.secondary {
                    margin: 0 auto;
                }
            `}</style>
        </div>
    );
};

export default CaseStudiesManager;
