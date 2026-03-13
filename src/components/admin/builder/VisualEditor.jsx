import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical, Plus, Trash2, Edit3, Image, Type, Layout, Settings, Code, Copy, Link as LinkIcon } from 'lucide-react';
import EditableBlock from './EditableBlock';
import './VisualEditor.css';

const VisualEditor = ({ pageData, onSave }) => {
    const [blocks, setBlocks] = useState(pageData?.content_blocks || []);
    const [activeId, setActiveId] = useState(null);
    const [editingBlock, setEditingBlock] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const addBlock = (type) => {
        const newBlock = {
            id: `block-${Date.now()}`,
            type: type,
            data: getDefaultDataForType(type),
            style: { padding: '2rem', backgroundColor: 'transparent', color: 'inherit', textAlign: 'left', linkUrl: '' }
        };
        setBlocks([...blocks, newBlock]);
    };

    const duplicateBlock = (id) => {
        const blockToDuplicate = blocks.find(b => b.id === id);
        if (!blockToDuplicate) return;

        const newBlock = {
            ...JSON.parse(JSON.stringify(blockToDuplicate)), // Deep copy data and styles
            id: `block-${Date.now()}`
        };

        const index = blocks.findIndex(b => b.id === id);
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock); // Insert exactly below
        setBlocks(newBlocks);
    };

    const getDefaultDataForType = (type) => {
        switch (type) {
            case 'hero': return { title: 'New Hero Section', subtitle: 'Add a captivating subtitle here.', primaryButtonText: 'Learn More', primaryButtonLink: '#' };
            case 'text': return { content: 'Double click to edit this text block.' };
            case 'image': return { url: 'https://via.placeholder.com/800x400', alt: 'Placeholder image' };
            case 'gallery': return { images: [] };
            case 'form': return { formId: null, title: 'Contact Us' };
            case 'custom_code': return { html: '<!-- Enter your custom HTML here -->\n<div style="padding: 20px; background: #eee;">\n  <h3>Custom HTML Snippet</h3>\n</div>' };
            default: return {};
        }
    };

    const updateBlockData = (id, newData) => {
        setBlocks(blocks.map(block => block.id === id ? { ...block, data: { ...block.data, ...newData } } : block));
    };

    const updateBlockStyle = (id, newStyle) => {
        setBlocks(blocks.map(block => block.id === id ? { ...block, style: { ...block.style, ...newStyle } } : block));
    };

    const deleteBlock = (id) => {
        setBlocks(blocks.filter(block => block.id !== id));
        if (editingBlock === id) setEditingBlock(null);
    };

    const handleSave = () => {
        onSave(blocks);
    };

    return (
        <div className="visual-editor-container">
            <div className="editor-sidebar">
                <h3>Add Elements</h3>
                <div className="element-palette">
                    <button onClick={() => addBlock('hero')}><Layout size={18} /> Hero Section</button>
                    <button onClick={() => addBlock('text')}><Type size={18} /> Text Block</button>
                    <button onClick={() => addBlock('image')}><Image size={18} /> Image</button>
                    <button onClick={() => addBlock('form')}><Layout size={18} /> Custom Form</button>
                    <button onClick={() => addBlock('custom_code')}><Code size={18} /> Custom HTML</button>
                </div>

                {editingBlock && (
                    <div className="block-settings">
                        <h3>Block Settings</h3>
                        {/* Render simple style controls based on editingBlock */}
                        <div className="setting-group">
                            <label>Background Color</label>
                            <input
                                type="color"
                                onChange={(e) => updateBlockStyle(editingBlock, { backgroundColor: e.target.value })}
                            />
                        </div>
                        <div className="setting-group">
                            <label>Text Color</label>
                            <input
                                type="color"
                                onChange={(e) => updateBlockStyle(editingBlock, { color: e.target.value })}
                            />
                        </div>
                        <div className="setting-group">
                            <label>Text Align</label>
                            <select onChange={(e) => updateBlockStyle(editingBlock, { textAlign: e.target.value })}>
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div className="setting-group">
                            <label><LinkIcon size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Hyperlink URL</label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={blocks.find(b => b.id === editingBlock)?.style?.linkUrl || ''}
                                onChange={(e) => updateBlockStyle(editingBlock, { linkUrl: e.target.value })}
                            />
                        </div>
                        <button className="close-settings" onClick={() => setEditingBlock(null)}>Done</button>
                    </div>
                )}
            </div>

            <div className="editor-canvas">
                <div className="canvas-header">
                    <h2>Page Editor</h2>
                    <button className="save-button" onClick={handleSave}>Save Changes</button>
                </div>

                <div className="canvas-body">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                    >
                        <SortableContext
                            items={blocks.map(b => b.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {blocks.map((block) => (
                                <EditableBlock
                                    key={block.id}
                                    block={block}
                                    onUpdate={(data) => updateBlockData(block.id, data)}
                                    onDelete={() => deleteBlock(block.id)}
                                    onDuplicate={() => duplicateBlock(block.id)}
                                    onEditSettings={() => setEditingBlock(block.id)}
                                    isActive={editingBlock === block.id}
                                />
                            ))}
                        </SortableContext>

                        <DragOverlay>
                            {activeId ? (
                                <div className="drag-overlay-block">
                                    <GripVertical size={24} /> Moving block...
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>

                    {blocks.length === 0 && (
                        <div className="empty-canvas">
                            <Layout size={48} />
                            <p>Drag elements from the sidebar or click to add your first section.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisualEditor;
