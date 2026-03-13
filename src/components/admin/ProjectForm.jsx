import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Trash2, Edit2, Plus, X } from 'lucide-react';
import ImageUploader from './ImageUploader';
import './AdminComponents.css'; // Shared CSS for admin components

const ProjectForm = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        client_name: '',
        challenge: '',
        solution: '',
        results: '',
        image_url: '',
        size: 'small',
        link: '',
        tags: '',
        is_upcoming: false,
        display_order: 0
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to load projects');
        }
        else setProjects(data || []);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: '',
            client_name: '',
            challenge: '',
            solution: '',
            results: '',
            image_url: '',
            size: 'small',
            link: '',
            tags: '',
            is_upcoming: false,
            display_order: 0
        });
        setIsEditing(false);
        setCurrentProject(null);
    };

    const handleEdit = (project) => {
        setFormData({
            title: project.title,
            category: project.category,
            client_name: project.client_name || '',
            challenge: project.challenge || '',
            solution: project.solution || '',
            results: project.results || '',
            image_url: project.image_url || '',
            size: project.size || 'small',
            link: project.link || '',
            tags: project.tags ? project.tags.join(', ') : '',
            is_upcoming: project.is_upcoming || false,
            display_order: project.display_order || 0
        });
        setCurrentProject(project);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        toast.confirm('Are you sure you want to delete this project?', async () => {
            if (!supabase) return;
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) {
                toast.error('Error deleting project: ' + error.message);
            } else {
                toast.success('Project deleted successfully');
                fetchProjects();
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supabase) return;

        // Process tags string to array
        const tagsArray = formData.tags
            ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            : [];

        const projectData = {
            title: formData.title,
            category: formData.category,
            client_name: formData.client_name,
            challenge: formData.challenge,
            solution: formData.solution,
            results: formData.results,
            image_url: formData.image_url,
            size: formData.size,
            link: formData.link,
            tags: tagsArray,
            is_upcoming: formData.is_upcoming,
            display_order: parseInt(formData.display_order) || 0
        };

        try {
            if (isEditing && currentProject) {
                const { error } = await supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', currentProject.id);

                if (error) throw error;
                toast.success('Project updated successfully');
                resetForm();
                fetchProjects();
            } else {
                const { error } = await supabase
                    .from('projects')
                    .insert([projectData]);

                if (error) throw error;
                toast.success('Project added successfully');
                resetForm();
                fetchProjects();
            }
        } catch (error) {
            toast.error('Operation failed: ' + error.message);
        }
    };

    return (
        <div className="admin-component-container">
            <div className="admin-panel">
                <div className="panel-header">
                    <h3>{isEditing ? 'Edit Client Case Study' : 'Add Client Case Study'}</h3>
                    {isEditing && (
                        <button className="icon-btn" onClick={resetForm} title="Cancel Edit">
                            <X size={20} />
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Project Title / Service Name</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Acme Corp Web Redesign" />
                        </div>
                        <div className="form-group half">
                            <label>Category (e.g., Web Design, Social Media Management)</label>
                            <input type="text" name="category" value={formData.category} onChange={handleInputChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Client Name (Optional)</label>
                            <input type="text" name="client_name" value={formData.client_name} onChange={handleInputChange} placeholder="e.g. Acme Corp" />
                        </div>
                        <div className="form-group half">
                            <label>External Link to Live Project</label>
                            <input type="text" name="link" value={formData.link} onChange={handleInputChange} placeholder="https://..." />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{ flex: '1 1 100%' }}>
                            <label>1. The Challenge (What problem was the client facing?)</label>
                            <textarea name="challenge" value={formData.challenge} onChange={handleInputChange} rows="2" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="They were struggling with low conversion rates and an outdated brand image..." />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{ flex: '1 1 100%' }}>
                            <label>2. The Solution (How did you help them?)</label>
                            <textarea name="solution" value={formData.solution} onChange={handleInputChange} rows="2" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="We designed a responsive ecommerce site on Next.js and rebranded their identity..." />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{ flex: '1 1 100%' }}>
                            <label>3. The Results (What was the measurable outcome?)</label>
                            <textarea name="results" value={formData.results} onChange={handleInputChange} rows="2" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="Increased conversions by 40% and improved mobile engagement drastically..." />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half" style={{ flex: '1 1 100%' }}>
                            <label>Cover Image</label>
                            <ImageUploader
                                bucketName="portfolio_images"
                                currentImageUrl={formData.image_url}
                                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Tags (comma separated)</label>
                            <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="React, Node, UI/UX" />
                        </div>
                        <div className="form-group half">
                            <label>Size / Layout variant</label>
                            <select name="size" value={formData.size} onChange={handleInputChange}>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row align-center mt-1">
                        <div className="form-group checkbox-group">
                            <input type="checkbox" id="is_upcoming" name="is_upcoming" checked={formData.is_upcoming} onChange={handleInputChange} />
                            <label htmlFor="is_upcoming">Mark as "Upcoming / In Development"</label>
                        </div>
                        <div className="form-group small">
                            <label>Display Order</label>
                            <input type="number" name="display_order" value={formData.display_order} onChange={handleInputChange} />
                        </div>
                    </div>

                    <button type="submit" className="admin-submit-btn mt-2">
                        {isEditing ? 'Update Case Study' : 'Save Client Case Study'}
                    </button>
                </form>
            </div >

            <div className="admin-panel mt-3">
                <div className="panel-header">
                    <h3>Existing Portfolio Items</h3>
                </div>

                {loading ? (
                    <div className="admin-loading">Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div className="admin-empty">No projects found. Add one above.</div>
                ) : (
                    <div className="admin-list">
                        {projects.map((project) => (
                            <div key={project.id} className="admin-list-item">
                                <div className="item-content">
                                    <div className="item-title">{project.title}</div>
                                    <div className="item-meta">{project.category} • Order: {project.display_order}</div>
                                </div>
                                <div className="item-actions">
                                    <button className="action-btn edit" onClick={() => handleEdit(project)} title="Edit">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDelete(project.id)} title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default ProjectForm;
