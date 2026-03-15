import { toast } from '../../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { FileText, Edit, Trash2 } from 'lucide-react';
import VisualEditor from '../builder/VisualEditor'; // Reusing visual editor for post content

const BlogManager = () => {
    const [posts, setPosts] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (data) setPosts(data);
        setLoading(false);
    };

    const handleCreatePost = async () => {
        const title = prompt('Enter post title:');
        if (!title) return;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const { data: existing } = await supabase.from('blog_posts').select('id').eq('slug', slug).single();
        if (existing) {
            toast.error('A post with a similar title/slug already exists.');
            return;
        }

        const { error } = await supabase.from('blog_posts').insert([{
            title,
            slug,
            content_blocks: [],
            excerpt: '',
            is_published: false
        }]);

        if (!error) {
            toast.success('Post created successfully!');
            fetchPosts();
        } else {
            toast.error('Error creating post: ' + error.message);
        }
    };

    const togglePublish = async (post) => {
        const { error } = await supabase.from('blog_posts').update({
            is_published: !post.is_published,
            published_at: !post.is_published ? new Date().toISOString() : null
        }).eq('id', post.id);
        
        if (!error) {
            toast.success(`Post ${!post.is_published ? 'published' : 'moved to drafts'}`);
            fetchPosts();
        } else {
            toast.error('Failed to update status: ' + error.message);
        }
    };

    const deletePost = async (id) => {
        toast.confirm('Are you sure you want to delete this post?', async () => {
            const { error } = await supabase.from('blog_posts').delete().eq('id', id);
            if (!error) {
                toast.success('Post deleted successfully');
                fetchPosts();
            } else {
                toast.error('Error deleting post: ' + error.message);
            }
        });
    };

    const handleSaveBlocks = async (blocks, postId) => {
        const { error } = await supabase.from('blog_posts').update({ content_blocks: blocks }).eq('id', postId);
        if (error) {
            toast.error('Error saving post: ' + error.message);
        } else {
            toast.success('Post saved successfully!');
            setEditingPostId(null);
        }
    };

    if (editingPostId) {
        // Fetch full post data to pass into edit
        const PostEditorWrapper = () => {
            const [postData, setPostData] = useState(null);
            useEffect(() => {
                const getPost = async () => {
                    const { data } = await supabase.from('blog_posts').select('*').eq('id', editingPostId).single();
                    setPostData(data);
                };
                getPost();
            }, []);

            if (!postData) return <div>Loading editor...</div>;

            return (
                <div className="page-builder-workspace">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                            <h2>Editing Post: {postData.title}</h2>
                            <p style={{ margin: 0, color: '#64748b' }}>Design the content below using the visual builder.</p>
                        </div>
                        <button onClick={() => setEditingPostId(null)} style={{ padding: '8px 16px', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer', height: 'fit-content' }}>Back to Posts</button>
                    </div>
                    {/* Reusing the VisualEditor for blog content! */}
                    <VisualEditor pageData={postData} onSave={(blocks) => handleSaveBlocks(blocks, editingPostId)} />
                </div>
            );
        };
        return <PostEditorWrapper />;
    }

    return (
        <div className="admin-component-container">
            {/* Vibrant Multi-Metrics Row */}
            <div className="admin-grid-3" style={{ marginBottom: '1.5rem' }}>
                <div className="stat-card themed-vibrant">
                    <div className="stat-header">
                        <span className="stat-label">Total Articles</span>
                        <div className="stat-icon"><FileText size={18} /></div>
                    </div>
                    <div className="stat-value">{posts.length}</div>
                    <div className="stat-footer">Organic content assets</div>
                </div>
                <div className="stat-card themed-vibrant">
                    <div className="stat-header">
                        <span className="stat-label">Live Content</span>
                        <div className="stat-icon"><Edit size={18} /></div>
                    </div>
                    <div className="stat-value">{posts.filter(p => p.is_published).length}</div>
                    <div className="stat-footer">Currently visible to public</div>
                </div>
                <div className="stat-card themed-vibrant">
                    <div className="stat-header">
                        <span className="stat-label">Draft Archive</span>
                        <div className="stat-icon"><Trash2 size={18} /></div>
                    </div>
                    <div className="stat-value">{posts.filter(p => !p.is_published).length}</div>
                    <div className="stat-footer">Pending final review</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0 }}>Blog Posts</h3>
                <button
                    onClick={handleCreatePost}
                    style={{ background: '#4A90E2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FileText size={16} /> Create New Post
                </button>
            </div>

            {loading ? <p>Loading posts...</p> : (
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '12px 16px', fontWeight: 500, color: '#64748b' }}>Title</th>
                                <th style={{ padding: '12px 16px', fontWeight: 500, color: '#64748b' }}>Date</th>
                                <th style={{ padding: '12px 16px', fontWeight: 500, color: '#64748b' }}>Status</th>
                                <th style={{ padding: '12px 16px', fontWeight: 500, color: '#64748b', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                                        {post.title}
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>/{post.slug}</div>
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '14px' }}>
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <button
                                            onClick={() => togglePublish(post)}
                                            style={{
                                                background: post.is_published ? '#dcfce7' : '#f1f5f9',
                                                color: post.is_published ? '#166534' : '#475569',
                                                border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer'
                                            }}
                                        >
                                            {post.is_published ? 'Published' : 'Draft'}
                                        </button>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <button onClick={() => setEditingPostId(post.id)} style={{ marginRight: '8px', padding: '6px 10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <Edit size={14} /> Edit Content
                                        </button>
                                        <button onClick={() => deletePost(post.id)} style={{ padding: '6px 10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No posts found. Create one.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BlogManager;
