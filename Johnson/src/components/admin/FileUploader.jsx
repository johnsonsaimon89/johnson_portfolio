import { toast } from '../../utils/toast';
import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { megaService } from '../../utils/megaService';
import { r2Service } from '../../utils/r2Service';
import { Upload, X, Loader2, FileText, Cloud, HardDrive, Zap, Maximize2, PlayCircle, File as FileIcon } from 'lucide-react';
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

                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

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
        toast.info('File removed');
    };

    const getFileName = (url) => {
        if (!url) return '';
        if (url.startsWith('https://mega.nz')) return 'Mega.nz File';
        const cleanUrl = url.split('?')[0];
        return decodeURIComponent(cleanUrl.split('/').pop());
    };

    const isVideo = (url) => {
        if (!url) return false;
        const ext = url.split('.').pop().toLowerCase();
        return ['mp4', 'webm', 'ogg', 'mov', 'm4v'].includes(ext);
    };

    const isImage = (url) => {
        if (!url) return false;
        const ext = url.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext);
    };

    const viewFullSize = (e) => {
        e.stopPropagation();
        if (currentFileUrl) {
            window.open(currentFileUrl, '_blank');
        }
    };

    const getStorageIcon = () => {
        switch (storageType) {
            case 'mega': return <HardDrive size={12} />;
            case 'r2': return <Zap size={12} />;
            default: return <Cloud size={12} />;
        }
    };

    const getStorageColor = () => {
        switch (storageType) {
            case 'mega': return '#ea4335';
            case 'r2': return '#f6821f';
            default: return '#3ecf8e';
        }
    };

    const getStorageBadgeClass = () => {
        switch (storageType) {
            case 'mega': return 'mega-badge-refined';
            case 'r2': return 'r2-badge-refined';
            default: return 'supabase-badge-refined';
        }
    };

    return (
        <div className="image-uploader-wrapper">
            {currentFileUrl ? (
                <div className="image-preview-container">
                    {isImage(currentFileUrl) ? (
                        <img src={currentFileUrl} alt="Preview" className="image-preview" />
                    ) : isVideo(currentFileUrl) ? (
                        <>
                            <video src={currentFileUrl} className="video-preview" muted loop playsInline onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                            <div className="video-indicator">
                                <PlayCircle size={10} /> VIDEO
                            </div>
                        </>
                    ) : (
                        <div className="upload-state">
                            <FileIcon size={32} style={{ color: '#000', marginBottom: '0.5rem', opacity: 0.8 }} />
                            <p className="upload-text" style={{ fontSize: 'var(--fs-p2)' }}>{getFileName(currentFileUrl)}</p>
                        </div>
                    )}
                    
                    <div className="preview-actions-overlay">
                        <button type="button" className="preview-action-btn" onClick={viewFullSize} title="View/Download file">
                            <Maximize2 size={16} />
                        </button>
                        <button type="button" className="preview-action-btn remove" onClick={handleRemoveFile} title="Remove file">
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
                            <p className="upload-text" style={{ fontSize: 'var(--fs-p2)' }}>Uploading...</p>
                        </div>
                    ) : (
                        <div className="upload-state">
                            <div className={getStorageBadgeClass()}>
                                {getStorageIcon()} {storageType.toUpperCase()} STORAGE
                            </div>
                            <Upload size={24} style={{ color: '#000', marginBottom: '4px', opacity: 0.8 }} />
                            <p className="upload-text">Add File</p>
                            <p className="upload-hint" style={{ fontSize: 'var(--fs-p2)' }}>
                                {storageType === 'mega' ? 'Mega.nz Secure' : (storageType === 'r2' ? 'R2 Edge' : 'Supabase Stack')}
                            </p>
                        </div>
                    )}
                </div>
            )}
            {error && <div className="upload-error">{error}</div>}
        </div>
    );
};

export default FileUploader;
