import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { r2Service } from '../../utils/r2Service';
import { Upload, Image as ImageIcon, Video, File, Trash2, Copy, Cloud, Maximize2, PlayCircle, Loader2 } from 'lucide-react';
import ImageUploader from './ImageUploader';

const MediaLibrary = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploader, setShowUploader] = useState(false);

    const BUCKET_NAME = 'media-library';

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const r2Files = await r2Service.listFiles(BUCKET_NAME);
            setFiles(r2Files || []);
        } catch (err) {
            console.error("Error fetching from R2:", err);
            toast.error("Failed to load R2 media files");
        }
        setLoading(false);
    };

    const handleUploadSuccess = (url) => {
        if (url) {
            fetchFiles(); // Refresh list
            setShowUploader(false);
        }
    };

    const copyUrl = (url) => {
        navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard!');
    };

    const viewFull = (url) => {
        window.open(url, '_blank');
    };

    const isVideo = (name, mime) => {
        return mime?.startsWith('video') || name.match(/\.(mp4|webm|ogg|mov)$/i);
    };

    const isImage = (name, mime) => {
        return mime?.startsWith('image') || name.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
    };

    return (
        <div className="media-library-manager">
            <div className="panel-header-refined" style={{ marginBottom: '2rem' }}>
                <div className="header-text">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 style={{ margin: 0 }}>Media Assets</h3>
                        <span style={{ fontSize: '0.65rem', background: '#f6821f', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                            POWERED BY R2
                        </span>
                    </div>
                    <p style={{ marginTop: '0.5rem' }}>View and manage all uploaded imagery and video content.</p>
                </div>
                {!showUploader ? (
                    <button className="premium-add-btn" onClick={() => setShowUploader(true)}>
                        <Upload size={18} /> Upload New Media
                    </button>
                ) : (
                    <button className="premium-add-btn secondary-outline" onClick={() => setShowUploader(false)}>
                        Close Uploader
                    </button>
                )}
            </div>

            {showUploader && (
                <div style={{ marginBottom: '3rem', maxWidth: '600px' }}>
                    <ImageUploader 
                        bucketName={BUCKET_NAME}
                        onUploadSuccess={handleUploadSuccess}
                        currentImageUrl=""
                    />
                </div>
            )}

            {loading ? (
                <div className="admin-loading-shimmer">
                    <div className="shimmer-item" style={{ height: '200px' }}></div>
                    <div className="shimmer-item" style={{ height: '200px' }}></div>
                    <div className="shimmer-item" style={{ height: '200px' }}></div>
                </div>
            ) : files.length === 0 ? (
                <div className="admin-empty-state">
                    <div className="empty-icon">📂</div>
                    <h4>Your library is clear</h4>
                    <p>Start by uploading your first project assets.</p>
                    {!showUploader && (
                        <button className="premium-add-btn" style={{ margin: '0 auto' }} onClick={() => setShowUploader(true)}>
                            <Upload size={18} /> Upload File
                        </button>
                    )}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {files.map(file => (
                        <div key={file.id} className="admin-panel" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                            <div className="image-preview-container" style={{ border: 'none', borderRadius: 0, minHeight: '180px' }}>
                                {isImage(file.name, file.metadata?.mimetype) ? (
                                    <img src={file.publicUrl} alt={file.name} className="image-preview" />
                                ) : isVideo(file.name, file.metadata?.mimetype) ? (
                                    <>
                                        <video src={file.publicUrl} className="video-preview" muted loop playsInline onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                                        <div className="video-indicator">
                                            <PlayCircle size={12} /> VIDEO
                                        </div>
                                    </>
                                ) : (
                                    <div className="upload-state">
                                        <File size={48} color="#94a3b8" />
                                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Document</p>
                                    </div>
                                )}
                                
                                <div className="preview-actions-overlay">
                                    <button className="preview-action-btn" onClick={() => viewFull(file.publicUrl)} title="Verify full size">
                                        <Maximize2 size={18} />
                                    </button>
                                    <button className="preview-action-btn" onClick={() => copyUrl(file.publicUrl)} title="Copy Public URL">
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>
                            
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                <div style={{ 
                                    whiteSpace: 'nowrap', 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    fontSize: '0.85rem', 
                                    fontWeight: 600,
                                    color: 'var(--text-color)',
                                    marginBottom: '0.5rem'
                                }}>
                                    {file.name}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--muted-color)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Cloud size={10} color="#f6821f" /> R2 STORAGE
                                    </span>
                                    <span>{file.metadata?.size ? `${(file.metadata.size / 1024 / 1024).toFixed(2)} MB` : ''}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .premium-add-btn.secondary-outline {
                    background: transparent;
                    border: 1px solid var(--glass-border);
                    color: var(--muted-color);
                }
                .premium-add-btn.secondary-outline:hover {
                    border-color: var(--text-color);
                    color: var(--text-color);
                }
            `}</style>
        </div>
    );
};

export default MediaLibrary;
