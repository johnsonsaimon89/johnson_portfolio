import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import VisualEditor from './builder/VisualEditor';
import { Layout } from 'lucide-react';

const PageBuilderManager = () => {
    const [pages, setPages] = useState([]);
    const [editingPageId, setEditingPageId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('pages').select('id, title, slug, is_published').order('created_at', { ascending: false });
        if (data) setPages(data);
        else if (error) {
            console.error('Error fetching pages:', error);
            toast.error('Failed to load pages');
        }
        setLoading(false);
    };

    const handleCreatePage = async () => {
        const title = prompt('Enter page title:');
        if (!title) return;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const { data: existing } = await supabase.from('pages').select('id').eq('slug', slug).single();
        if (existing) {
            toast.error('A page with a similar title/slug already exists.');
            return;
        }

        const { error } = await supabase.from('pages').insert([{ title, slug, content_blocks: [] }]);
        if (!error) {
            toast.success('Page created successfully');
            fetchPages();
        } else {
            toast.error('Error creating page: ' + error.message);
        }
    };

    const handleEditBlocks = (pageId) => {
        setEditingPageId(pageId);
    };

    const handleSaveBlocks = async (blocks, pageId) => {
        const { error } = await supabase.from('pages').update({ content_blocks: blocks }).eq('id', pageId);
        if (error) {
            toast.error('Error saving page: ' + error.message);
        } else {
            toast.success('Page saved successfully!');
            setEditingPageId(null);
        }
    };

    const togglePublish = async (page) => {
        const { error } = await supabase.from('pages').update({ is_published: !page.is_published }).eq('id', page.id);
        if (!error) {
            toast.success(`Page ${!page.is_published ? 'published' : 'moved to drafts'}`);
            fetchPages();
        } else {
            toast.error('Failed to update status: ' + error.message);
        }
    };

    const deletePage = async (id) => {
        toast.confirm('Are you sure you want to delete this page?', async () => {
            const { error } = await supabase.from('pages').delete().eq('id', id);
            if (!error) {
                toast.success('Page deleted successfully');
                fetchPages();
            } else {
                toast.error('Error deleting page: ' + error.message);
            }
        });
    };

    if (editingPageId) {
        // Fetch full page data to pass into edit
        const PageEditorWrapper = () => {
            const [pageData, setPostData] = useState(null);
            useEffect(() => {
                const getPage = async () => {
                    const { data } = await supabase.from('pages').select('*').eq('id', editingPageId).single();
                    setPostData(data);
                };
                getPage();
            }, []);

            if (!pageData) return <div>Loading editor...</div>;

            return (
                <div className="page-builder-workspace">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2>Editing: {pageData.title}</h2>
                        <button onClick={() => setEditingPageId(null)} style={{ padding: '8px 16px', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Back to Pages</button>
                    </div>
                    <VisualEditor pageData={pageData} onSave={(blocks) => handleSaveBlocks(blocks, editingPageId)} />
                </div>
            );
        };
        return <PageEditorWrapper />;
    }

    return (
        <div className="page-builder-manager">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0 }}>Website Pages</h3>
                <button
                    onClick={handleCreatePage}
                    style={{ background: '#4A90E2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Layout size={16} /> Create New Page
                </button>
            </div>

            {loading ? <p>Loading pages...</p> : (
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '12px 16px', fontWeight: 500, color: '#64748b' }}>Title</th>
                                <th style={{ padding: '12px 16px', fontWeight: 500, color: '#64748b' }}>Slug</th>
                                <th style={{ padding: '12px 16px', fontWeight: 500, color: '#64748b' }}>Status</th>
                                <th style={{ padding: '12px 16px', fontWeight: 500, color: '#64748b', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map(page => (
                                <tr key={page.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{page.title}</td>
                                    <td style={{ padding: '12px 16px', color: '#64748b' }}>/{page.slug}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <button
                                            onClick={() => togglePublish(page)}
                                            style={{
                                                background: page.is_published ? '#dcfce7' : '#f1f5f9',
                                                color: page.is_published ? '#166534' : '#475569',
                                                border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer'
                                            }}
                                        >
                                            {page.is_published ? 'Published' : 'Draft'}
                                        </button>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <button onClick={() => handleEditBlocks(page.id)} style={{ marginRight: '8px', padding: '4px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit Design</button>
                                        <button onClick={() => deletePage(page.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {pages.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No pages found. Create one.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PageBuilderManager;
