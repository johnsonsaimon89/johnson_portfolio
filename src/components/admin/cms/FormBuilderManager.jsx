import { toast } from '../../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { FilePlus, Trash2, Link } from 'lucide-react';

const FormBuilderManager = () => {
    const [forms, setForms] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [selectedFormId, setSelectedFormId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('custom_forms').select('*').order('created_at', { ascending: false });
        if (data) setForms(data);
        else if (error) {
            console.error('Error fetching forms:', error);
            toast.error('Failed to load forms');
        }
        setLoading(false);
    };

    const fetchSubmissions = async (formId) => {
        const { data, error } = await supabase.from('form_submissions').select('*').eq('form_id', formId).order('created_at', { ascending: false });
        if (data) setSubmissions(data);
        else if (error) {
            toast.error('Failed to load submissions');
        }
    };

    const handleCreateForm = async () => {
        const name = prompt('Enter new form name (e.g., Contact Form, Newsletter Signup):');
        if (!name) return;

        // Default fields for a new form
        const defaultFields = [
            { id: 'f_name', type: 'text', label: 'Full Name', required: true },
            { id: 'f_email', type: 'email', label: 'Email Address', required: true }
        ];

        const { error } = await supabase.from('custom_forms').insert([{ name, fields: defaultFields }]);
        if (!error) {
            toast.success('Form created successfully');
            fetchForms();
        } else {
            toast.error('Error creating form: ' + error.message);
        }
    };

    const deleteForm = async (id) => {
        toast.confirm('Delete this form? This will also delete all its submissions.', async () => {
            const { error } = await supabase.from('custom_forms').delete().eq('id', id);
            if (!error) {
                toast.success('Form and submissions deleted');
                fetchForms();
                if (selectedFormId === id) setSelectedFormId(null);
            } else {
                toast.error('Error deleting form: ' + error.message);
            }
        });
    };

    const viewSubmissions = (id) => {
        setSelectedFormId(id);
        fetchSubmissions(id);
    };

    return (
        <div className="form-builder-manager">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0 }}>Custom Forms & Leads</h3>
                <button
                    onClick={handleCreateForm}
                    style={{ background: '#4A90E2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FilePlus size={16} /> Create New Form
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1, background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>Available Forms</div>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {forms.map(form => (
                            <li key={form.id} style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0' }}>{form.name}</h4>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>Form ID: {form.id}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => viewSubmissions(form.id)} style={{ padding: '6px 12px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                        View Submissions
                                    </button>
                                    <button onClick={() => deleteForm(form.id)} style={{ padding: '6px', background: '#fecaca', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </li>
                        ))}
                        {forms.length === 0 && <li style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No forms created yet.</li>}
                    </ul>
                </div>

                <div style={{ flex: 1, background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', minHeight: '300px' }}>
                    <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {selectedFormId ? `Submissions` : 'Select a form to view submissions'}
                    </div>
                    {selectedFormId && (
                        <div style={{ padding: '16px' }}>
                            {submissions.length === 0 ? <p style={{ color: '#64748b' }}>No submissions yet.</p> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {submissions.map(sub => (
                                        <div key={sub.id} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: sub.is_read ? 'transparent' : '#f0fdf4' }}>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                                                {new Date(sub.created_at).toLocaleString()}
                                            </div>
                                            {Object.entries(sub.data).map(([key, value]) => (
                                                <div key={key} style={{ fontSize: '14px', marginBottom: '4px' }}>
                                                    <strong>{key}:</strong> {value?.toString()}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormBuilderManager;
