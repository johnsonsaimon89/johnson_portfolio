/**
 * Service to handle Cloudflare R2 uploads via a Worker proxy.
 */

const R2_WORKER_URL = import.meta.env.VITE_R2_WORKER_URL;
const R2_AUTH_KEY = import.meta.env.VITE_R2_AUTH_KEY;

export const r2Service = {
    /**
     * Upload a file to R2
     * @param {File} file The file object from input
     * @param {string} folder Optional folder path
     * @returns {Promise<string>} The public URL of the uploaded file
     */
    async uploadFile(file, folder = 'uploads') {
        if (!R2_WORKER_URL) {
            throw new Error('Cloudflare R2 Worker URL is not configured in .env');
        }

        // Remove trailing slash if present
        const baseUrl = R2_WORKER_URL.replace(/\/$/, '');
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const key = folder ? `${folder}/${fileName}` : fileName;

        try {
            const response = await fetch(`${baseUrl}/${key}`, {
                method: 'PUT',
                body: file,
                headers: {
                    'X-Auth-Key': R2_AUTH_KEY || '',
                    'Content-Type': file.type
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${errorText || response.statusText}`);
            }

            // Return the URL to access the file
            return `${baseUrl}/${key}`;
        } catch (error) {
            console.error('R2 Upload Error:', error);
            throw error;
        }
    },

    /**
     * List files in the R2 bucket
     * @param {string} folder Optional folder prefix
     * @returns {Promise<Array>} List of file objects
     */
    async listFiles(folder = '') {
        if (!R2_WORKER_URL) {
            throw new Error('Cloudflare R2 Worker URL is not configured in .env');
        }

        const baseUrl = R2_WORKER_URL.replace(/\/$/, '');
        const url = `${baseUrl}/?list=true${folder ? `&prefix=${folder}` : ''}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Auth-Key': R2_AUTH_KEY || ''
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch file list');
            }

            const data = await response.json();
            return data.objects.map(obj => ({
                id: obj.key,
                name: obj.key.split('/').pop(),
                publicUrl: `${baseUrl}/${obj.key}`,
                metadata: { 
                    mimetype: obj.httpMetadata?.contentType || 'application/octet-stream',
                    size: obj.size,
                    uploadedAt: obj.uploaded
                }
            }));
        } catch (error) {
            console.error('R2 List Error:', error);
            throw error;
        }
    }
};
