import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit, Trash2, Search, Check, X,
  Package, Image as ImageIcon, ShieldCheck, AlertCircle, Upload, Loader2, CheckCircle2
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { INITIAL_PRODUCTS } from '../data/initialData';
import { safeFetch } from '../utils/api';

export default function AdminProducts() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dehydrated Fruits');
  const [fobPrice, setFobPrice] = useState('12.80');
  const [moqKg, setMoqKg] = useState('25');
  const [moistureLevel, setMoistureLevel] = useState('< 10%');
  const [shelfLife, setShelfLife] = useState('24 Months');
  const [originRegion, setOriginRegion] = useState('Kurunegala & Dambulla');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/products/ceylon_mango.jpg');
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const data = await safeFetch('/api/products');
      if (data?.products && data.products.length > 0) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Dehydrated Fruits');
    setFobPrice('12.80');
    setMoqKg('25');
    setMoistureLevel('< 10%');
    setShelfLife('24 Months');
    setOriginRegion('Kurunegala');
    setShortDesc('');
    setDescription('');
    setImageUrl('/products/ceylon_mango.jpg');
    setInStock(true);
    setIsFeatured(false);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setFobPrice(p.fob_price_usd ? p.fob_price_usd.toString() : '10.00');
    setMoqKg(p.moq_kg ? p.moq_kg.toString() : '20');
    setMoistureLevel(p.moisture_level || '< 10%');
    setShelfLife(p.shelf_life || '24 Months');
    setOriginRegion(p.origin_region || 'Sri Lanka');
    setShortDesc(p.short_desc || '');
    setDescription(p.description || '');
    setImageUrl(p.images?.[0] || '/products/ceylon_mango.jpg');
    setInStock(Boolean(p.in_stock));
    setIsFeatured(Boolean(p.is_featured));
    setFormError('');
    setIsModalOpen(true);
  };

  // Upload product image file from device
  const handleProductImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const data = await safeFetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      setImageUrl(data.url);
    } catch (err) {
      setFormError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter a product name.');
      return;
    }

    const payload = {
      name: name.trim(),
      category,
      fob_price_usd: parseFloat(fobPrice) || 0,
      moq_kg: parseFloat(moqKg) || 1,
      moisture_level: moistureLevel,
      shelf_life: shelfLife,
      origin_region: originRegion,
      short_desc: shortDesc,
      description,
      images: [imageUrl || '/products/ceylon_mango.jpg'],
      in_stock: inStock,
      is_featured: isFeatured
    };

    try {
      if (editingProduct) {
        await safeFetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        setSuccessToast(`"${name}" updated successfully!`);
      } else {
        await safeFetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        setSuccessToast(`"${name}" created successfully!`);
      }

      setIsModalOpen(false);
      fetchProducts();
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      setFormError(err.message || 'Failed to save product. Please check the backend connection.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product from the catalog?')) return;
    try {
      await safeFetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessToast('Product deleted successfully.');
      fetchProducts();
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const filtered = products.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Success Notification Alert */}
      {successToast && (
        <div style={{ padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name or category..."
            style={{ width: '100%', padding: '0.55rem 0.85rem 0.55rem 2.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          />
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Create Product
        </button>
      </div>

      {/* Products Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product & Image</th>
                <th>Category</th>
                <th>Price ($/kg)</th>
                <th>Min. Order (kg)</th>
                <th>Moisture</th>
                <th>Origin</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={p.images?.[0] || '/products/ceylon_mango.jpg'}
                        alt={p.name}
                        style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                        onError={(e) => { e.target.src = '/products/ceylon_mango.jpg'; }}
                      />
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.shelf_life} Shelf Life</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-amber">{p.category}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>${(p.fob_price_usd || 0).toFixed(2)}</td>
                  <td>{p.moq_kg} kg</td>
                  <td>{p.moisture_level}</td>
                  <td>{p.origin_region}</td>
                  <td>
                    <span className={`badge ${p.in_stock ? 'badge-green' : 'badge-red'}`}>
                      {p.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn-secondary btn-sm" onClick={() => handleOpenEdit(p)} title="Edit Product">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(p.id)} title="Delete Product">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }} />

          <div
            className="glass-card"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              zIndex: 610,
              background: 'var(--bg-surface)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #EF4444', color: '#DC2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Product Image Attachment Section */}
              <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                  Product Photo (Upload directly from Laptop / Phone file picker) *
                </label>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <img
                    src={imageUrl || '/products/ceylon_mango.jpg'}
                    alt="Product preview"
                    style={{ width: '85px', height: '85px', borderRadius: '8px', objectFit: 'cover', border: '2px solid var(--border-subtle)' }}
                    onError={(e) => { e.target.src = '/products/ceylon_mango.jpg'; }}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProductImageSelect}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      style={{ alignSelf: 'flex-start', padding: '0.55rem 1.1rem' }}
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 size={15} className="live-pulse" /> Uploading image...
                        </>
                      ) : (
                        <>
                          <Upload size={15} /> Select Photo from Device
                        </>
                      )}
                    </button>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Click the button above to pick a photo (JPG, PNG, WebP) directly from your laptop or mobile storage.
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ceylon Dehydrated Golden Papaya Spears"
                  style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                  >
                    <option value="Dehydrated Fruits">Dehydrated Fruits</option>
                    <option value="Ceylon Spices">Ceylon Spices</option>
                    <option value="Herbal Infusions">Herbal Infusions</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Price ($/kg) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={fobPrice}
                    onChange={(e) => setFobPrice(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Minimum Order (kg)</label>
                  <input
                    type="number"
                    value={moqKg}
                    onChange={(e) => setMoqKg(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Moisture Spec</label>
                  <input
                    type="text"
                    value={moistureLevel}
                    onChange={(e) => setMoistureLevel(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Shelf Life</label>
                  <input
                    type="text"
                    value={shelfLife}
                    onChange={(e) => setShelfLife(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Harvest Origin Region</label>
                <input
                  type="text"
                  value={originRegion}
                  onChange={(e) => setOriginRegion(e.target.value)}
                  placeholder="e.g. Kurunegala Agri-Zone, Sri Lanka"
                  style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Short Summary</label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="1-sentence catalog description"
                  style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Product Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Full notes, flavor profile, and quality specs..."
                  style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '2rem', padding: '0.5rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
                  <span>Available in Stock</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
