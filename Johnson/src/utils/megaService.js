import { Storage } from 'megajs';

/**
 * Service to handle Mega.nz storage operations.
 * Requires VITE_MEGA_EMAIL and VITE_MEGA_PASSWORD in .env
 */
class MegaService {
    constructor() {
        this.email = import.meta.env.VITE_MEGA_EMAIL;
        this.password = import.meta.env.VITE_MEGA_PASSWORD;
        this.storage = null;
        this.isLoggedIn = false;
    }

    async login() {
        if (this.isLoggedIn && this.storage) return this.storage;

        if (!this.email || !this.password) {
            throw new Error('Mega.nz credentials missing. Please add VITE_MEGA_EMAIL and VITE_MEGA_PASSWORD to your .env file.');
        }

        return new Promise((resolve, reject) => {
            this.storage = new Storage({
                email: this.email,
                password: this.password,
                userAgent: 'Johnson-Web-App'
            }, (error) => {
                if (error) {
                    console.error('Mega.nz login failed:', error);
                    reject(error);
                } else {
                    this.isLoggedIn = true;
                    console.log('Logged into Mega.nz successfully');
                    resolve(this.storage);
                }
            });
        });
    }

    /**
     * Finds or creates a folder structure within Mega.nz
     * @param {string} folderPath - e.g., "Items/Digital"
     * @returns {Promise<File>} - The folder object
     */
    async getOrCreateFolder(folderPath) {
        await this.login();
        const parts = folderPath.split('/').filter(p => p.length > 0);
        let currentFolder = this.storage.root;

        for (const part of parts) {
            let nextFolder = currentFolder.children.find(c => c.name === part && c.directory);
            if (!nextFolder) {
                console.log(`Creating folder: ${part}`);
                nextFolder = await new Promise((resolve, reject) => {
                    currentFolder.mkdir(part, (err, folder) => {
                        if (err) reject(err);
                        else resolve(folder);
                    });
                });
            }
            currentFolder = nextFolder;
        }

        return currentFolder;
    }

    /**
     * Uploads a file to a specific folder on Mega.nz
     * @param {File} file - Browser File object
     * @param {string} targetFolderLink - Optional link to find specific folder
     * @returns {Promise<string>} - Shareable link to the uploaded file
     */
    async uploadFile(file, folderPath = 'ShopItems') {
        const storage = await this.login();
        const folder = await this.getOrCreateFolder(folderPath);

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async () => {
                const buffer = Buffer.from(reader.result);

                const upload = folder.upload({
                    name: file.name,
                    size: file.size
                }, buffer, (err, uploadedFile) => {
                    if (err) {
                        reject(err);
                    } else {
                        // Get public link
                        uploadedFile.link((linkErr, url) => {
                            if (linkErr) {
                                // If link fails, just return success with an internal ID or name
                                resolve(`mega:file:${uploadedFile.name}`);
                            } else {
                                resolve(url);
                            }
                        });
                    }
                });

                upload.on('error', reject);
                upload.on('progress', (stats) => {
                    console.log(`Upload progress: ${Math.round(stats.bytesLoaded / stats.bytesTotal * 100)}%`);
                });
            };

            reader.onerror = () => reject(new Error('Failed to read file for upload'));
            reader.readAsArrayBuffer(file);
        });
    }
}

export const megaService = new MegaService();
