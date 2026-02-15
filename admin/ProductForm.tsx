import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { cloudinaryLoader } from '../src/lib/cloudinaryLoader';

const ProductForm = () => {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState({
        name: '',
        description: '',
        base_price: '',
        category: 'Tops',
        image_url: ''
    });

    const [variants, setVariants] = useState([
        { size: 'M', color: 'Black', sku: '', stock_quantity: 0, price_adjustment: 0 }
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleVariantChange = (index: number, field: string, value: string | number) => {
        const newVariants = [...variants];
        (newVariants[index] as any)[field] = value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { size: 'M', color: 'Black', sku: '', stock_quantity: 0, price_adjustment: 0 }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Insert Product
            const { data: productData, error: productError } = await supabase
                .from('products')
                .insert([{
                    name: product.name,
                    description: product.description,
                    category: product.category,
                    image_url: product.image_url,
                    // base_price needs to be numeric in DB ideally, handling as string for now based on state
                    price: product.base_price
                }])
                .select()
                .single();

            if (productError) throw productError;

            // 2. Insert Variants
            const variantsToInsert = variants.map(v => ({
                product_id: productData.id,
                size: v.size,
                color: v.color,
                sku: v.sku,
                stock_quantity: v.stock_quantity,
                price_adjustment: v.price_adjustment
            }));

            const { error: variantError } = await supabase
                .from('product_variants')
                .insert(variantsToInsert);

            if (variantError) throw variantError;

            alert('Product created successfully!');
            // Reset form
            setProduct({ name: '', description: '', base_price: '', category: 'Tops', image_url: '' });
            setVariants([{ size: 'M', color: 'Black', sku: '', stock_quantity: 0, price_adjustment: 0 }]);

        } catch (error: any) {
            alert('Error creating product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <section className="space-y-4">
                    <h2 className="text-lg font-bold border-b pb-2">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Product Name</label>
                            <input name="name" value={product.name} onChange={handleChange} className="w-full border p-2 rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Base Price ($)</label>
                            <input name="base_price" type="number" value={product.base_price} onChange={handleChange} className="w-full border p-2 rounded" required />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-1">Description</label>
                            <textarea name="description" value={product.description} onChange={handleChange} className="w-full border p-2 rounded h-24" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Category</label>
                            <select name="category" value={product.category} onChange={handleChange} className="w-full border p-2 rounded">
                                <option>Tops</option>
                                <option>Bottoms</option>
                                <option>Outerwear</option>
                                <option>Accessories</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Image URL (Cloudinary ID)</label>
                            <input name="image_url" value={product.image_url} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g. collection-2025/shirt-1" />
                        </div>
                    </div>
                </section>

                {/* Variants */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-bold">Variants (Inventory)</h2>
                        <button type="button" onClick={addVariant} className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800">+ Add Variant</button>
                    </div>

                    <div className="space-y-4">
                        {variants.map((variant, idx) => (
                            <div key={idx} className="flex gap-4 items-end bg-gray-50 p-4 rounded border">
                                <div>
                                    <label className="block text-xs font-bold mb-1">Size</label>
                                    <select
                                        value={variant.size}
                                        onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                                        className="border p-1 rounded w-20"
                                    >
                                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1">Color</label>
                                    <input
                                        value={variant.color}
                                        onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                                        className="border p-1 rounded w-32"
                                        placeholder="e.g. Black"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold mb-1">SKU</label>
                                    <input
                                        value={variant.sku}
                                        onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                                        className="border p-1 rounded w-full"
                                        placeholder="TH-001-BLK-M"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1">Stock</label>
                                    <input
                                        type="number"
                                        value={variant.stock_quantity}
                                        onChange={(e) => handleVariantChange(idx, 'stock_quantity', parseInt(e.target.value))}
                                        className="border p-1 rounded w-20"
                                    />
                                </div>
                                <button type="button" onClick={() => removeVariant(idx)} className="text-red-500 hover:text-red-700 font-bold p-1">×</button>
                            </div>
                        ))}
                    </div>
                </section>

                <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                    {loading ? 'Creating Product...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
