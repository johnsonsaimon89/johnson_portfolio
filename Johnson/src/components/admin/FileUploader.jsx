import { toast } from '../../utils/toast';
import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { megaService } from '../../utils/megaService';
import { r2Service } from '../../utils/r2Service';
import { Upload, X, Loader2, FileText, Cloud, HardDrive, Zap } from 'lucide-react';
import './ImageUploader.css';

const FileUploader = ({
    bucketName = 'digital_products',
    onUploadSuccess,
    currentFileUrl,
    accept = "*",
    storageType = 'r2',
    folderPath = 'ShopItems'
}) => {
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
        setUploading(true);

        try {
            if (storageType === 'mega') {
                const publicUrl = await megaService.uploadFile(file, folderPath);
                if (onUploadSuccess) {
                    onUploadSuccess(publicUrl);
                    toast.success('File uploaded to Mega.nz');
                }
            } else if (storageType === 'r2') {
                const publicUrl = await r2Service.uploadFile(file, folderPath);
                if (onUploadSuccess) {
                    onUploadSuccess(publicUrl);
                    toast.success('File uploaded to Cloudflare R2');
                }
            } else {
                if (!supabase) {
                    const errMsg = 'Database connection not established.';
                    setError(errMsg);
                    toast.error(errMsg);
                    return;
                }

                // Generate a unique file name to avoid collisions
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);

                if (onUploadSuccess) {
                    onUploadSuccess(data.publicUrl);
                    toast.success('File uploaded to Supabase');
                }
            }

        } catch (error) {
            console.error('Error uploading file:', error);
            const errMsg = error.message || 'Error uploading file.';
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

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        if (onUploadSuccess) onUploadSuccess('', '');
        toast.info('File removed from form');
    };

    const getFileName = (url) => {
        if (!url) return '';
        if (url.startsWith('https://mega.nz')) return 'Mega.nz File';
        // Handle R2 URLs which might have query params
        const cleanUrl = url.split('?')[0];
        return cleanUrl.split('/').pop();
    };

    const isVideo = (url) => {
        if (!url) return false;
        const ext = url.split('.').pop().toLowerCase();
        return ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
    };

    return (
        <div className="image-uploader-wrapper">
            <div className="storage-badge" style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                background: storageType === 'mega' ? '#ea4335' : (storageType === 'r2' ? '#f6821f' : '#3ecf8e'),
                color: 'white',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                marginBottom: '10px',
                fontWeight: '600',
                letterSpacing: '0.02em'
            }}>
                {storageType === 'mega' ? <HardDrive size={12} /> : (storageType === 'r2' ? <Zap size={12} /> : <Cloud size={12} />)}
                {storageType === 'mega' ? 'MEGA.NZ' : (storageType === 'r2' ? 'CLOUDFLARE R2' : 'SUPABASE')}
            </div>

            {currentFileUrl ? (
                <div className="image-preview-container" style={{ padding: '2rem', flexDirection: 'column', gap: '1rem', border: '1px solid #eee' }}>
                    {isVideo(currentFileUrl) ? (
                        <Zap size={48} className="text-accent" style={{ opacity: 0.8 }} />
                    ) : (
                        <FileText size={48} className="text-secondary" style={{ opacity: 0.5 }} />
                    )}
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#374151', wordBreak: 'break-all', textAlign: 'center', fontWeight: '500' }}>
                        {getFileName(currentFileUrl)}
                    </p>
                    <button type="button" className="remove-image-btn" onClick={handleRemoveFile} title="Remove file">
                        <X size={16} />
                    </button>
                    <p style={{ fontSize: '0.7rem', color: '#9ca3af' }}>File selected and ready</p>
                </div>
            ) : (
                <div
                    className={`drop-zone ${dragActive ? 'drag-active' : ''} ${error ? 'has-error' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    style={{ minHeight: '140px' }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleChange}
                        style={{ display: 'none' }}
                    />

                    {uploading ? (
                        <div className="upload-state">
                            <Loader2 size={24} className="spin text-accent" />
                            <p style={{ fontWeight: '500' }}>Uploading to {storageType === 'mega' ? 'Mega' : (storageType === 'r2' ? 'R2' : 'Supabase')}...</p>
                        </div>
                    ) : (
                        <div className="upload-state">
                            <Upload size={24} className="text-secondary mb-2" style={{ opacity: 0.7 }} />
                            <p className="upload-text"><strong>Click to upload</strong> or drag and drop</p>
                            <p className="upload-hint" style={{ fontSize: '0.75rem' }}>
                                {storageType === 'mega'
                                    ? `Direct to Mega.nz folder: ${folderPath}`
                                    : (storageType === 'r2' ? 'Lightning fast Cloudflare R2 storage' : 'Upload your digital product to Supabase')
                                }
                            </p>
                        </div>
                    )}
                </div>
            )}
            {error && <div className="upload-error" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '10px', padding: '8px', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fee2e2' }}>{error}</div>}
        </div>
    );
};

export default FileUploader;
