import { toast } from '../../utils/toast';
import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { r2Service } from '../../utils/r2Service';
import { Upload, X, Loader2, Image as ImageIcon, Cloud, Maximize2, PlayCircle } from 'lucide-react';
import './ImageUploader.css';

const ImageUploader = ({ bucketName = 'portfolio_images', onUploadSuccess, currentImageUrl }) => {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const isVideo = (url) => {
        if (!url) return false;
        return url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('/videos/');
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = async (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            await handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = async (file) => {
        setError('');
        const isImg = file.type.startsWith('image/');
        const isVid = file.type.startsWith('video/');

        if (!isImg && !isVid) {
            const errMsg = 'Please upload a valid media file (Image or Video).';
            setError(errMsg);
            toast.error(errMsg);
            return;
        }

        if (!supabase) {
            const errMsg = 'Database connection not established.';
            setError(errMsg);
            toast.error(errMsg);
            return;
        }

        setUploading(true);

        try {
            let fileToUpload = file;

            // Convert images to WebP if not SVG or already WebP
            if (isImg && file.type !== 'image/svg+xml' && file.type !== 'image/webp') {
                try {
                    if (typeof createImageBitmap !== 'undefined') {
                        const bitmap = await createImageBitmap(file);
                        const canvas = document.createElement('canvas');
                        canvas.width = bitmap.width;
                        canvas.height = bitmap.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(bitmap, 0, 0);

                        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.85));
                        if (blob) {
                            fileToUpload = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });
                        }
                    }
                } catch (convErr) {
                    console.warn("WebP conversion failed, falling back to original format", convErr);
                }
            }

            // Upload via R2 Service
            const publicUrl = await r2Service.uploadFile(fileToUpload, bucketName);

            if (onUploadSuccess) {
                onUploadSuccess(publicUrl);
                toast.success('Media uploaded to Cloudflare R2');
            }
        } catch (error) {
            console.error('Error uploading media:', error);
            const errMsg = error.message || 'Error uploading media.';
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setUploading(false);
        }
    };

    const triggerFileSelect = () => {
        if (!uploading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemoveMedia = (e) => {
        e.stopPropagation();
        if (onUploadSuccess) {
            onUploadSuccess('');
            toast.info('Media removed');
        }
    };

    const viewFullSize = (e) => {
        e.stopPropagation();
        if (currentImageUrl) {
            window.open(currentImageUrl, '_blank');
        }
    };

    return (
        <div className={`image-uploader-wrapper ${bucketName === 'site-assets' ? 'contain' : ''}`}>
            {currentImageUrl ? (
                <div className={`image-preview-container ${bucketName === 'site-assets' ? 'contain' : ''}`}>
                    {isVideo(currentImageUrl) ? (
                        <>
                            <video src={currentImageUrl} className="video-preview" muted loop playsInline onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                            <div className="video-indicator">
                                <PlayCircle size={10} /> VIDEO
                            </div>
                        </>
                    ) : (
                        <img src={currentImageUrl} alt="Preview" className="image-preview" />
                    )}
                    
                    <div className="preview-actions-overlay">
                        <button type="button" className="preview-action-btn" onClick={viewFullSize} title="View full size">
                            <Maximize2 size={16} />
                        </button>
                        <button type="button" className="preview-action-btn remove" onClick={handleRemoveMedia} title="Remove media">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className={`drop-zone ${dragActive ? 'drag-active' : ''} ${error ? 'has-error' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                    />

                    {uploading ? (
                        <div className="upload-state">
                            <Loader2 size={24} className="spin text-accent" />
                            <p className="upload-text" style={{ fontSize: '0.8rem' }}>Uploading...</p>
                        </div>
                    ) : (
                        <div className="upload-state">
                            <div className="r2-badge-refined">
                                <Cloud size={10} /> CLOUDFLARE R2
                            </div>
                            <Upload size={24} style={{ color: '#000', marginBottom: '4px', opacity: 0.8 }} />
                            <p className="upload-text">Add Media</p>
                            <p className="upload-hint">Image or Video</p>
                        </div>
                    )}
                </div>
            )}
            {error && <div className="upload-error">{error}</div>}
        </div>
    );
};

export default ImageUploader;
