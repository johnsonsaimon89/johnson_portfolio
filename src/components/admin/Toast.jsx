import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleToast = (e) => {
            const { id: eventId, message, type } = e.detail;
            const id = eventId || (Date.now() + Math.random());
            setToasts(prev => [...prev, { id, message, type, persistent: type === 'confirm' }]);

            // Auto remove after 4s (unless persistent)
            if (type !== 'confirm') {
                setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== id));
                }, 4000);
            }
        };


        window.addEventListener('admin-toast', handleToast);
        return () => window.removeEventListener('admin-toast', handleToast);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const confirmAction = (id) => {
        window.dispatchEvent(new CustomEvent('admin-confirm-success', { detail: { id } }));
        removeToast(id);
    };


    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            <AnimatePresence>
                {toasts.map(t => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        style={{
                            background: t.type === 'error' ? '#fee2e2' : t.type === 'success' ? '#10b981' : '#3b82f6',
                            color: t.type === 'error' ? '#991b1b' : '#ffffff',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            minWidth: '300px',
                            maxWidth: '400px',
                        }}
                    >
                        {t.type === 'success' && <CheckCircle size={20} />}
                        {t.type === 'error' && <XCircle size={20} />}
                        {(t.type === 'info' || t.type === 'confirm') && <Info size={20} />}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontWeight: 500, fontSize: '14px', lineHeight: 1.4 }}>{t.message}</span>
                            {t.type === 'confirm' && (
                                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                    <button
                                        onClick={() => confirmAction(t.id)}
                                        style={{
                                            background: '#ffffff',
                                            color: '#111',
                                            border: 'none',
                                            padding: '4px 12px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => removeToast(t.id)}
                                        style={{
                                            background: 'rgba(255,255,255,0.2)',
                                            color: '#ffffff',
                                            border: 'none',
                                            padding: '4px 12px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => removeToast(t.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'inherit',
                                opacity: 0.8,
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Toast;
