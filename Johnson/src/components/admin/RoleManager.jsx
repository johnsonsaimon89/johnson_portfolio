import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Shield, ShieldAlert, User, Trash2 } from 'lucide-react';

const RoleManager = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        setLoading(true);
        // We join with auth.users if possible, but standard Supabase JS client cannot easily 
        // read auth.users without service_role key. So we just display the user_id from user_roles.
        // In a real production app with service_role, we would create a secure edge function to list emails.
        const { data, error } = await supabase.from('user_roles').select('*').order('created_at', { ascending: false });
        if (data) setRoles(data);
        else if (error) {
            console.error('Error fetching roles:', error);
            toast.error('Failed to load roles');
        }
        setLoading(false);
    };

    const handleAssignRole = async () => {
        const userId = prompt('Enter the User UID to assign a role:');
        if (!userId) return;

        const role = prompt('Enter role (admin or editor):')?.toLowerCase();
        if (role !== 'admin' && role !== 'editor') {
            toast.error('Invalid role! Must be admin or editor.');
            return;
        }

        const { error } = await supabase.from('user_roles').upsert([{ user_id: userId, role }]);
        if (error) {
            toast.error('Error assigning role: ' + error.message);
        } else {
            toast.success('Role assigned/updated successfully');
            fetchRoles();
        }
    };

    const removeRole = async (userId) => {
        toast.confirm('Remove role from this user?', async () => {
            const { error } = await supabase.from('user_roles').delete().eq('user_id', userId);
            if (!error) {
                toast.success('Role removed');
                fetchRoles();
            } else {
                toast.error('Error removing role: ' + error.message);
            }
        });
    };

    return (
        <div className="role-manager">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0 }}>Team Roles & Access</h3>
                <button
                    onClick={handleAssignRole}
                    style={{ background: '#4A90E2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Shield size={16} /> Assign Role
                </button>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                    <strong>Security Notice:</strong> Role assignment requires knowing the user's secure UID. Admins have full access to global settings and user management. Editors can only create and manage content.
                </div>
            </div>

            {loading ? <p>Loading roles...</p> : (
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '12px 16px', fontWeight: 500, color: '#64748b' }}>User ID</th>
                                <th style={{ padding: '12px 16px', fontWeight: 500, color: '#64748b' }}>Role</th>
                                <th style={{ padding: '12px 16px', fontWeight: 500, color: '#64748b', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map(r => (
                                <tr key={r.user_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={16} color="#94a3b8" />
                                        <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{r.user_id}</span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            background: r.role === 'admin' ? '#fee2e2' : '#fef3c7',
                                            color: r.role === 'admin' ? '#991b1b' : '#92400e',
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase'
                                        }}>
                                            {r.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <button onClick={() => removeRole(r.user_id)} style={{ padding: '6px 10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {roles.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No roles assigned. Only system owner has access.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RoleManager;
