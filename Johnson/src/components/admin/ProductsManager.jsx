import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Trash2, Edit2, X, Plus } from 'lucide-react';
import ImageUploader from './ImageUploader';
import FileUploader from './FileUploader';
import './AdminComponents.css';

const ProductsManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [uploadMode, setUploadMode] = useState('upload'); // 'upload' or 'link'
    const [storageType, setStorageType] = useState('r2'); // 'r2', 'supabase' or 'mega'
    const [globalPayment, setGlobalPayment] = useState({
        bank_name: '',
        bank_account: '',
        lipa_number: ''
    });
    const [paymentLoading, setPaymentLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        description: '',
        price_tzs: 0,
        image_url: '',
        file_url: '',
        is_active: true,
        display_order: 0,
        is_on_sale: false,
        sale_price_tzs: 0,
        sale_label: '',
        sale_event: '',
        sales_count: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchGlobalPayment();

        if (!supabase) return;

        const channel = supabase
            .channel('products-db-changes')
            .on('postgres_changes', { event: '*', table: 'products', schema: 'public' }, () => {
                fetchProducts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchProducts = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching products:', error);
        else setProducts(data || []);
        setLoading(false);
    };

    const fetchGlobalPayment = async () => {
        if (!supabase) return;
        const { data, error } = await supabase.from('site_settings').select('payment_bank_name, payment_bank_account, payment_lipa_number').eq('id', 1).single();
        if (data) {
            setGlobalPayment({
                bank_name: data.payment_bank_name || '',
                bank_account: data.payment_bank_account || '',
                lipa_number: data.payment_lipa_number || ''
            });
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setPaymentLoading(true);
        const { error } = await supabase.from('site_settings').update({
            payment_bank_name: globalPayment.bank_name,
            payment_bank_account: globalPayment.bank_account,
            payment_lipa_number: globalPayment.lipa_number
        }).eq('id', 1);

        if (error) {
            toast.error('Failed to save payment settings: ' + error.message);
        } else {
            toast.success('Payment settings saved globally!');
        }
        setPaymentLoading(false);
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
            type: '',
            description: '',
            price_tzs: 0,
            image_url: '',
            file_url: '',
            is_active: true,
            display_order: 0,
            is_on_sale: false,
            sale_price_tzs: 0,
            sale_label: '',
            sale_event: '',
            sales_count: ''
        });
        setIsEditing(false);
        setCurrentProduct(null);
    };

    const handleEdit = (product) => {
        setFormData({
            title: product.title,
            type: product.type || '',
            description: product.description || '',
            price_tzs: product.price_tzs || 0,
            image_url: product.image_url || '',
            file_url: product.file_url || '',
            is_active: product.is_active || false,
            display_order: product.display_order || 0,
            is_on_sale: product.is_on_sale || false,
            sale_price_tzs: product.sale_price_tzs || 0,
            sale_label: product.sale_label || '',
            sale_event: product.sale_event || '',
            sales_count: product.sales_count || ''
        });

        // Determine upload mode based on existing URL
        if (product.file_url && !product.file_url.includes('supabase.co')) {
            setUploadMode('link');
        } else {
            setUploadMode('upload');
        }

        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        toast.confirm('Are you sure you want to delete this product? This cannot be undone.', async () => {
            if (!supabase) return;
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) {
                toast.error('Error deleting product: ' + error.message);
            } else {
                toast.success('Product deleted successfully');
                fetchProducts();
            }
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supabase) return;

        const productData = {
            title: formData.title,
            type: formData.type || 'Digital',
            description: formData.description,
            price_tzs: parseInt(formData.price_tzs) || 0,
            image_url: formData.image_url,
            file_url: formData.file_url,
            is_active: formData.is_active,
            display_order: parseInt(formData.display_order) || 0,
            is_on_sale: formData.is_on_sale,
            sale_price_tzs: parseInt(formData.sale_price_tzs) || 0,
            sale_label: formData.sale_label,
            sale_event: formData.sale_event,
            sales_count: formData.sales_count
        };

        if (isEditing && currentProduct) {
            const { error: updateError } = await supabase
                .from('products')
                .update(productData)
                .eq('id', currentProduct.id);

            if (updateError) {
                toast.error('Error updating product: ' + updateError.message);
            } else {
                toast.success('Product updated successfully!');
                resetForm();
                fetchProducts();
            }
        } else {
            const { error } = await supabase
                .from('products')
                .insert([productData]);

            if (error) {
                toast.error('Error adding product: ' + error.message);
            } else {
                toast.success('Product added successfully!');
                resetForm();
                fetchProducts();
            }
        }
    };

    return (
        <div className="admin-component-container">
            {/* Vibrant Multi-Metrics Row */}
            <div className="admin-grid-3" style={{ marginBottom: '1.5rem' }}>
                <div className="stat-card themed-vibrant">
                    <div className="stat-header">
                        <span className="stat-label">Inventory Size</span>
                        <div className="stat-icon"><Plus size={18} /></div>
                    </div>
                    <div className="stat-value">{products.length}</div>
                    <div className="stat-footer">Total digital products</div>
                </div>
                <div className="stat-card themed-vibrant">
                    <div className="stat-header">
                        <span className="stat-label">Active Presence</span>
                        <div className="stat-icon"><Edit2 size={18} /></div>
                    </div>
                    <div className="stat-value">{products.filter(p => p.is_active).length}</div>
                    <div className="stat-footer">Live in the storefront</div>
                </div>
                <div className="stat-card themed-vibrant">
                    <div className="stat-header">
                        <span className="stat-label">Promotion Pulse</span>
                        <div className="stat-icon"><Trash2 size={18} /></div>
                    </div>
                    <div className="stat-value">{products.filter(p => p.is_on_sale).length}</div>
                    <div className="stat-footer">Items currently on sale</div>
                </div>
            </div>

            {/* Global Payment Settings Section */}
            <div className="admin-panel mb-3">
                <div className="panel-header">
                    <h3>Global Payment Details (Checkout)</h3>
                </div>
                <form onSubmit={handlePaymentSubmit} className="admin-form">
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
                        These details appear in the checkout modal for all digital products.
                    </p>
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Bank Name</label>
                            <input 
                                type="text" 
                                value={globalPayment.bank_name} 
                                onChange={(e) => setGlobalPayment({...globalPayment, bank_name: e.target.value})} 
                                placeholder="e.g. NBC, NMB"
                            />
                        </div>
                        <div className="form-group half">
                            <label>Account Number</label>
                            <input 
                                type="text" 
                                value={globalPayment.bank_account} 
                                onChange={(e) => setGlobalPayment({...globalPayment, bank_account: e.target.value})} 
                                placeholder="0142..."
                            />
                        </div>
                    </div>
                    <div className="form-row mt-1">
                        <div className="form-group">
                            <label>Lipa Number / Mobile Money (Flexible)</label>
                            <input 
                                type="text" 
                                value={globalPayment.lipa_number} 
                                onChange={(e) => setGlobalPayment({...globalPayment, lipa_number: e.target.value})} 
                                placeholder="e.g. Lipa: 5566, Phone: 07..."
                            />
                        </div>
                    </div>
                    <button type="submit" className="admin-submit-btn mt-2" disabled={paymentLoading}>
                        {paymentLoading ? 'Saving...' : 'Save Global Payment Details'}
                    </button>
                </form>
            </div>

            <div className="admin-panel">
                <div className="panel-header">
                    <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                    {isEditing && (
                        <button className="icon-btn" onClick={resetForm} title="Cancel Edit">
                            <X size={20} />
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Product Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group half">
                            <label>Product Type (e.g. E-book, Template)</label>
                            <input type="text" name="type" value={formData.type} onChange={handleInputChange} required />
                        </div>
                    </div>

                    <div className="form-row mt-1">
                        <div className="form-group half">
                            <label>Price (TZS)</label>
                            <input type="number" name="price_tzs" value={formData.price_tzs} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group half">
                            <label>Display Order</label>
                            <input type="number" name="display_order" value={formData.display_order} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="form-row mt-1">
                        <div className="form-group">
                            <label>Social Proof / Stats (e.g. 15-30 per month or 120+ downloads)</label>
                            <input type="text" name="sales_count" value={formData.sales_count} onChange={handleInputChange} placeholder="Appears below the price" />
                        </div>
                    </div>

                    <div className="form-row mt-1">
                        <div className="form-group" style={{ flex: '1 1 100%' }}>
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                style={{
                                    background: '#ffffff',
                                    border: '1px solid #d1d5db',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '6px',
                                    width: '100%',
                                    fontFamily: 'inherit',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-row mt-1">
                        <div className="form-group half">
                            <label>Product Cover Image</label>
                            <ImageUploader
                                bucketName="portfolio_images"
                                currentImageUrl={formData.image_url}
                                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                            />
                        </div>
                        <div className="form-group half">
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Digital Product Delivery</span>
                                <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setUploadMode('upload')}
                                        style={{ background: uploadMode === 'upload' ? '#111827' : '#f3f4f6', color: uploadMode === 'upload' ? '#fff' : '#4b5563', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
                                    >File</button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadMode('link')}
                                        style={{ background: uploadMode === 'link' ? '#111827' : '#f3f4f6', color: uploadMode === 'link' ? '#fff' : '#4b5563', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
                                    >Link</button>
                                </div>
                            </label>

                            {uploadMode === 'upload' ? (
                                <>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', marginTop: '4px' }}>
                                        <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="storageType"
                                                checked={storageType === 'r2'}
                                                onChange={() => setStorageType('r2')}
                                            />
                                            Cloudflare R2
                                        </label>
                                        <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="storageType"
                                                checked={storageType === 'supabase'}
                                                onChange={() => setStorageType('supabase')}
                                            />
                                            Supabase
                                        </label>
                                        <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="storageType"
                                                checked={storageType === 'mega'}
                                                onChange={() => setStorageType('mega')}
                                            />
                                            Mega.nz
                                        </label>
                                    </div>
                                    <FileUploader
                                        bucketName="digital_products"
                                        currentFileUrl={formData.file_url}
                                        onUploadSuccess={(url) => setFormData(prev => ({ ...prev, file_url: url }))}
                                        accept=".zip,.pdf,.rar,.fig,.psd,.ai,.txt,image/*"
                                        storageType={storageType}
                                        folderPath="JohnsonShop"
                                    />
                                </>
                            ) : (
                                <input
                                    type="url"
                                    name="file_url"
                                    value={formData.file_url}
                                    onChange={handleInputChange}
                                    placeholder="https://mega.nz/file/..."
                                    style={{ marginTop: '0.5rem' }}
                                />
                            )}
                            {uploadMode === 'link' && <small style={{ color: '#6b7280', display: 'block', marginTop: '4px' }}>Paste a link to Notion, Google Drive, Gumroad, etc. that users receive after purchase.</small>}
                        </div>
                    </div>

                    <div className="form-row align-center mt-2" style={{ gap: '2rem' }}>
                        <div className="form-group checkbox-group">
                            <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleInputChange} />
                            <label htmlFor="is_active">Product is Active (Available for sale)</label>
                        </div>
                        <div className="form-group checkbox-group">
                            <input type="checkbox" id="is_on_sale" name="is_on_sale" checked={formData.is_on_sale} onChange={handleInputChange} />
                            <label htmlFor="is_on_sale">Enable Discount / Sale</label>
                        </div>
                    </div>

                    {formData.is_on_sale && (
                        <div className="form-row mt-1 animate-fade-in" style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                            <div className="form-group third">
                                <label>Sale Price (TZS)</label>
                                <input type="number" name="sale_price_tzs" value={formData.sale_price_tzs} onChange={handleInputChange} placeholder="Reduced price" />
                            </div>
                            <div className="form-group third">
                                <label>Sale Label (e.g. 50% OFF)</label>
                                <input type="text" name="sale_label" value={formData.sale_label} onChange={handleInputChange} placeholder="Badge text" />
                            </div>
                            <div className="form-group third">
                                <label>Event Name (e.g. Easter Week)</label>
                                <input type="text" name="sale_event" value={formData.sale_event} onChange={handleInputChange} placeholder="For emails & UI" />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="admin-submit-btn mt-2">
                        {isEditing ? 'Update Product' : 'Add Product'}
                    </button>
                </form>
            </div >

            <div className="admin-panel mt-3">
                <div className="panel-header">
                    <h3>Existing Products</h3>
                </div>

                {loading ? (
                    <div className="admin-loading">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="admin-empty">No products found. Add one above.</div>
                ) : (
                    <div className="admin-list-grouped">
                        <div className="admin-list">
                            {products.map((product) => (
                                <div key={product.id} className="admin-list-item">
                                    <div className="item-content">
                                        <div className="item-title">{product.title}</div>
                                        <div className="item-meta">
                                            {product.is_on_sale ? (
                                                <>
                                                    <span style={{ fontWeight: '800', color: '#10b981' }}>{product.sale_price_tzs.toLocaleString()} TZS</span>
                                                    <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{product.price_tzs.toLocaleString()}</span>
                                                    <span className="trend-badge ml-2" style={{ marginLeft: '0.5rem', background: '#dcfce7', color: '#166534' }}>{product.sale_label || 'SALE'}</span>
                                                </>
                                            ) : (
                                                <>{product.price_tzs.toLocaleString()} TZS</>
                                            )}
                                            {!product.is_active && <span className="trend-badge ml-2" style={{ marginLeft: '0.5rem', background: '#fee2e2', color: '#b91c1c' }}>Inactive</span>}
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        <button className="action-btn edit" type="button" onClick={() => handleEdit(product)} title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="action-btn delete" type="button" onClick={() => handleDelete(product.id)} title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default ProductsManager;
