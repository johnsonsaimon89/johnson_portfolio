import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Settings, Copy } from 'lucide-react';

const EditableBlock = ({ block, onUpdate, onDelete, onDuplicate, onEditSettings, isActive }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        ...block.style,
        cursor: block.style?.linkUrl ? 'pointer' : 'default', // Hint that it is a link
    };

    const renderContent = () => {
        switch (block.type) {
            case 'hero':
                return (
                    <div className="rendered-hero" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
                        <h1
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => onUpdate({ title: e.target.innerText })}
                            style={{ fontSize: '3rem', marginBottom: '1rem', fontFamily: 'var(--heading-font)' }}
                        >{block.data.title}</h1>
                        <p
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => onUpdate({ subtitle: e.target.innerText })}
                            style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.8 }}
                        >{block.data.subtitle}</p>

                        {/* Interactive WYSIWYG Button Editor */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <div style={{ padding: '0.8rem 2rem', backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '50px', display: 'inline-block' }}>
                                <span
                                    contentEditable suppressContentEditableWarning
                                    onBlur={(e) => onUpdate({ primaryButtonText: e.target.innerText })}
                                >{block.data.primaryButtonText || 'Button Text'}</span>
                            </div>
                        </div>
                    </div>
                );
            case 'text':
                return (
                    <div
                        className="rendered-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdate({ content: e.target.innerText })}
                        style={{ fontSize: '1.1rem', lineHeight: 1.6 }}
                    >
                        {block.data.content}
                    </div>
                );
            case 'image':
                const isVideo = block.data.url?.match(/\.(mp4|webm|ogg|mov)$/i);
                return (
                    <div className="rendered-image" style={{ textAlign: 'center', position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                        {isVideo ? (
                            <video src={block.data.url} className="video-preview" muted loop playsInline autoPlay style={{ width: '100%', maxHeight: '500px', display: 'block' }} />
                        ) : (
                            <img src={block.data.url} alt={block.data.alt} style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
                        )}
                        <div className="image-placeholder-overlay" onClick={onEditSettings} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', color: 'white', opacity: 0, transition: 'all 0.3s ease', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                        >
                            <div style={{ background: 'white', color: 'black', padding: '8px 20px', borderRadius: '50px', fontWeight: '600', fontSize: '0.9rem' }}>
                                Change Media
                            </div>
                        </div>
                    </div>
                );
            case 'form':
                return (
                    <div className="rendered-form" style={{ padding: '2rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px dashed #ccc' }}>
                        <h3>{block.data.title || 'Contact Form'}</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>(Form Placeholder - The actual form will render on the live site)</p>

                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ height: '40px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', maxWidth: '300px' }}></div>
                            <div style={{ height: '40px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', maxWidth: '300px' }}></div>
                            <div style={{ height: '100px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', maxWidth: '300px' }}></div>
                            <div style={{ height: '40px', background: 'var(--primary-color)', color: 'white', borderRadius: '4px', width: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Submit</div>
                        </div>
                    </div>
                );
            case 'custom_code':
                return (
                    <div className="rendered-custom-code" style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '10px', background: '#333', color: 'lime', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>HTML INJECTED</div>
                        {/* We use a textarea to edit the HTML directly in the builder, but warn the user it might break layout */}
                        <textarea
                            value={block.data.html}
                            onChange={(e) => onUpdate({ html: e.target.value })}
                            style={{ width: '100%', minHeight: '150px', fontFamily: 'monospace', fontSize: '12px', padding: '10px', background: '#1e1e1e', color: '#d4d4d4', border: '1px solid #444', borderRadius: '4px' }}
                        />
                        <div style={{ marginTop: '10px', padding: '10px', border: '1px dashed #ccc' }}>
                            <p style={{ fontSize: '10px', margin: '0 0 5px 0', color: '#888' }}>Live Preview:</p>
                            <div dangerouslySetInnerHTML={{ __html: block.data.html }} />
                        </div>
                    </div>
                )
            default:
                return <div>Unknown Block Type</div>;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`editable-block-wrapper ${isActive ? 'active-block' : ''}`}
        >
            <div className="block-controls" {...attributes} {...listeners}>
                <GripVertical size={16} className="drag-handle" />
                <span className="block-type-label">{block.type}</span>
            </div>

            <div className="block-actions">
                <button onClick={onDuplicate} title="Duplicate"><Copy size={14} /></button>
                <button onClick={onEditSettings} title="Settings"><Settings size={14} /></button>
                <button onClick={onDelete} title="Delete" className="delete-btn"><Trash2 size={14} /></button>
            </div>

            <div className="block-inner-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default EditableBlock;
