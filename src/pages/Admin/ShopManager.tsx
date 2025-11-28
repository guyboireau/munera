import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type Product = Database['public']['Tables']['products']['Row'];

const ShopManager = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        inventory: {} as Record<string, number>,
        images: [] as string[]
    });
    const [loading, setLoading] = useState(false);

    // Temporary state for adding a size
    const [tempSize, setTempSize] = useState('');
    const [tempQty, setTempQty] = useState(0);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (data) setProducts(data);
    };

    const [editingId, setEditingId] = useState<string | null>(null);

    const handleEdit = (product: Product) => {
        setNewProduct({
            name: product.name,
            description: product.description || '',
            price: product.price,
            category: product.category || '',
            inventory: (product.inventory as Record<string, number>) || {},
            images: product.images ? (product.images as string[]) : []
        });
        setEditingId(product.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setNewProduct({ name: '', description: '', price: 0, category: '', inventory: {}, images: [] });
        setEditingId(null);
        setTempSize('');
        setTempQty(0);
    };

    const handleAddSize = () => {
        if (!tempSize || tempQty < 0) return;
        setNewProduct(prev => ({
            ...prev,
            inventory: { ...prev.inventory, [tempSize.toUpperCase()]: tempQty }
        }));
        setTempSize('');
        setTempQty(0);
    };

    const handleRemoveSize = (size: string) => {
        const newInventory = { ...newProduct.inventory };
        delete newInventory[size];
        setNewProduct(prev => ({ ...prev, inventory: newInventory }));
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                // Update existing
                const { error } = await (supabase.from('products') as any).update({
                    ...newProduct,
                    active: true
                }).eq('id', editingId);

                if (error) throw error;
                alert("Product updated!");
            } else {
                // Create new
                const { error } = await (supabase.from('products') as any).insert({
                    ...newProduct,
                    active: true
                });

                if (error) throw error;
                alert("Product added!");
            }

            handleCancelEdit();
            fetchProducts();
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (product: Product) => {
        const { error } = await (supabase.from('products') as any).update({ active: !product.active }).eq('id', product.id);
        if (!error) fetchProducts();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) {
                alert("Error deleting product: " + error.message);
            } else {
                fetchProducts();
            }
        }
    };

    const getTotalStock = (inventory: any) => {
        if (!inventory) return 0;
        return Object.values(inventory as Record<string, number>).reduce((a, b) => a + b, 0);
    };

    return (
        <div className="space-y-8 text-white">
            <div className="bg-zinc-800/50 border border-white/10 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>👕</span> {editingId ? 'Edit Product' : 'Add Product'}
                </h3>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        className="bg-zinc-900 border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                    />
                    <input
                        className="bg-zinc-900 border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        placeholder="Category (e.g. T-Shirt)"
                        value={newProduct.category || ''}
                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    />
                    <input
                        type="number"
                        className="bg-zinc-900 border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        placeholder="Price (€)"
                        value={newProduct.price || ''}
                        onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                        required
                    />

                    {/* Inventory Management */}
                    <div className="md:col-span-2 bg-zinc-900/50 p-4 rounded-lg border border-white/5">
                        <label className="block text-sm text-zinc-400 mb-2">Inventory (Size & Stock)</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                className="bg-zinc-800 border border-white/10 p-2 rounded text-white w-24"
                                placeholder="Size (S)"
                                value={tempSize}
                                onChange={e => setTempSize(e.target.value)}
                            />
                            <input
                                type="number"
                                className="bg-zinc-800 border border-white/10 p-2 rounded text-white w-24"
                                placeholder="Qty"
                                value={tempQty}
                                onChange={e => setTempQty(parseInt(e.target.value) || 0)}
                            />
                            <button
                                type="button"
                                onClick={handleAddSize}
                                className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 rounded"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(newProduct.inventory).map(([size, qty]) => (
                                <span key={size} className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    <span className="font-bold">{size}</span>: {qty}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSize(size)}
                                        className="hover:text-white"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm text-zinc-400 mb-2">Product Image</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    try {
                                        setLoading(true);
                                        if (!e.target.files || e.target.files.length === 0) return;

                                        const file = e.target.files[0];
                                        const fileExt = file.name.split('.').pop();
                                        const fileName = `${Math.random()}.${fileExt}`;
                                        const filePath = `${fileName}`;

                                        const { error: uploadError } = await supabase.storage
                                            .from('product-images')
                                            .upload(filePath, file);

                                        if (uploadError) throw uploadError;

                                        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
                                        setNewProduct(prev => ({ ...prev, images: [data.publicUrl] }));
                                    } catch (error: any) {
                                        alert('Error uploading image: ' + error.message);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                                className="block w-full text-sm text-zinc-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-orange-500 file:text-white
                                hover:file:bg-orange-600
                                "
                            />
                            {loading && <span className="text-sm text-orange-400">Uploading...</span>}
                        </div>
                        {newProduct.images && newProduct.images[0] && (
                            <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-700">
                                <img src={newProduct.images[0]} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <textarea
                        className="bg-zinc-900 border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:border-orange-500 md:col-span-2"
                        placeholder="Description"
                        value={newProduct.description || ''}
                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                    <div className="md:col-span-2 flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (editingId ? 'Update Product' : 'Add Product')}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-zinc-800/50 border border-white/10 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>📦</span> Inventory
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-zinc-400 text-sm uppercase">
                                <th className="p-3">Product</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Total Stock</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-3 font-bold flex items-center gap-3">
                                        {p.images && p.images[0] && (
                                            <img src={p.images[0] as string} className="w-8 h-8 rounded object-cover" />
                                        )}
                                        {p.name}
                                    </td>
                                    <td className="p-3 text-zinc-400">{p.category}</td>
                                    <td className="p-3">{p.price} €</td>
                                    <td className="p-3">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{getTotalStock(p.inventory)}</span>
                                            <span className="text-xs text-zinc-500">
                                                {p.inventory ? Object.keys(p.inventory).join(', ') : ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${p.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {p.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-3 flex items-center gap-2">
                                        <button
                                            onClick={() => toggleActive(p)}
                                            className="text-sm text-zinc-400 hover:text-white underline mr-2"
                                        >
                                            {p.active ? 'Disable' : 'Enable'}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="text-blue-500 hover:text-blue-400 p-1"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="text-red-500 hover:text-red-400 p-1"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && <p className="text-zinc-500 text-center py-8">No products yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default ShopManager;
