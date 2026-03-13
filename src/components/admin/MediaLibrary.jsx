import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { r2Service } from '../../utils/r2Service';
import { Upload, Image as ImageIcon, Video, File, Trash2, Copy, Cloud } from 'lucide-react';

const MediaLibrary = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    // Using a placeholder bucket named 'media-library'
    const BUCKET_NAME = 'media-library';

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const r2Files = await r2Service.listFiles(BUCKET_NAME);
            setFiles(r2Files);
        } catch (err) {
            console.error("Error fetching from R2:", err);
            toast.error("Failed to load R2 media files");
            
            // Fallback to Supabase if R2 fails
            try {
                const { data } = await supabase.storage.from(BUCKET_NAME).list('', {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' },
                });

                if (data) {
                    const filesWithUrls = data.map(file => {
                        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
                        return { ...file, publicUrl: urlData.publicUrl };
                    });
                    setFiles(filesWithUrls.filter(f => f.name !== '.emptyFolderPlaceholder'));
                }
            } catch (supaErr) {
                console.warn("Could not fetch from Supabase storage either");
            }
        }
        setLoading(false);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const publicUrl = await r2Service.uploadFile(file, BUCKET_NAME);
            toast.success('File uploaded to Cloudflare R2!');
            
            // Optimistically add to list
            const newFile = {
                id: Math.random().toString(),
                name: file.name,
                publicUrl,
                metadata: { mimetype: file.type }
            };
            setFiles(prev => [newFile, ...prev]);
        } catch (error) {
            toast.error('Upload failed: ' + error.message);
            console.error(error);
        }
        setUploading(false);
    };

    const deleteFile = async (fileName) => {
        // R2 Deletion usually requires a server-side route
        toast.info('Direct deletion from R2 requires additional backend setup.');
    };

    const copyUrl = (url) => {
        navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard!');
    };

    return (
        <div className="media-library-manager">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h3 style={{ margin: 0 }}>Media Library</h3>
                    <span style={{ fontSize: '0.65rem', background: '#f6821f', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                        POWERED BY R2
                    </span>
                </div>
                <div>
                    <input
                        type="file"
                        id="media-upload"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        accept="image/*,video/*"
                    />
                    <label
                        htmlFor="media-upload"
                        style={{ background: '#f6821f', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: uploading ? 0.7 : 1 }}
                    >
                        <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload File'}
                    </label>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {files.map(file => (
                    <div key={file.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: 'white' }}>
                        <div style={{ height: '140px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '5px', right: '5px', zIndex: 1 }}>
                                {file.publicUrl?.includes('r2') && <Cloud size={14} color="#f6821f" />}
                            </div>
                            {file.metadata?.mimetype?.startsWith('image') || file.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                <img src={file.publicUrl} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : file.metadata?.mimetype?.startsWith('video') || file.name.match(/\.(mp4|webm|ogg)$/i) ? (
                                <Video size={48} color="#94a3b8" />
                            ) : (
                                <File size={48} color="#94a3b8" />
                            )}
                        </div>
                        <div style={{ padding: '12px', fontSize: '12px' }}>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '8px', fontWeight: 500 }}>{file.name}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button onClick={() => copyUrl(file.publicUrl)} title="Copy URL" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><Copy size={16} /></button>
                                <button onClick={() => deleteFile(file.name)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && files.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: '#64748b', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                    <ImageIcon size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                    <p>Your media library is empty. Upload images or videos to use them on your site.</p>
                </div>
            )}
        </div>
    );
};

export default MediaLibrary;
