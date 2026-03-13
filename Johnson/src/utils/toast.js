export const toast = {
    success: (message) => {
        window.dispatchEvent(new CustomEvent('admin-toast', { detail: { message, type: 'success' } }));
    },
    error: (message) => {
        window.dispatchEvent(new CustomEvent('admin-toast', { detail: { message, type: 'error' } }));
    },
    info: (message) => {
        window.dispatchEvent(new CustomEvent('admin-toast', { detail: { message, type: 'info' } }));
    },
    confirm: (message, onConfirm) => {
        const id = Date.now();
        const handleConfirm = (e) => {
            if (e.detail.id === id) {
                onConfirm();
                window.removeEventListener('admin-confirm-success', handleConfirm);
            }
        };
        window.addEventListener('admin-confirm-success', handleConfirm);
        window.dispatchEvent(new CustomEvent('admin-toast', {
            detail: { id, message, type: 'confirm' }
        }));
    }
};

