import { toast } from '../../utils/toast';
import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { r2Service } from '../../utils/r2Service';
import { Upload, X, Loader2, Image as ImageIcon, Cloud } from 'lucide-react';
import './ImageUploader.css';

const ImageUploader = ({ bucketName = 'portfolio_images', onUploadSuccess, currentImageUrl }) => {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

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
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        if (!isImage && !isVideo) {
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

            // Convert to WebP if not SVG or already WebP
            if (file.type !== 'image/svg+xml' && file.type !== 'image/webp') {
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
                toast.success('Image uploaded to Cloudflare R2');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            const errMsg = error.message || 'Error uploading image.';
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

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        if (onUploadSuccess) {
            onUploadSuccess('');
            toast.info('Image removed');
        }
    };

    return (
        <div className="image-uploader-wrapper">
            {currentImageUrl ? (
                <div className="image-preview-container">
                    <img src={currentImageUrl} alt="Preview" className="image-preview" />
                    <button type="button" className="remove-image-btn" onClick={handleRemoveImage} title="Remove image">
                        <X size={16} />
                    </button>
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
                        accept="image/*"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                    />

                    {uploading ? (
                        <div className="upload-state">
                            <Loader2 size={24} className="spin text-accent" />
                            <p>Uploading to R2...</p>
                        </div>
                    ) : (
                        <div className="upload-state">
                            <div className="r2-badge" style={{ fontSize: '0.65rem', background: '#f6821f', color: 'white', padding: '2px 6px', borderRadius: '4px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Cloud size={10} /> CLOUDFLARE R2
                            </div>
                            <Upload size={24} className="text-secondary mb-2" />
                            <p className="upload-text"><strong>Click to upload</strong> or drag and drop</p>
                            <p className="upload-hint">Images or Videos (Cloudflare R2)</p>
                        </div>
                    )}
                </div>
            )}
            {error && <div className="upload-error">{error}</div>}
        </div>
    );
};

export default ImageUploader;
