import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCartStore } from '../src/store/cartStore';
import { cloudinaryLoader } from '../src/lib/cloudinaryLoader';
import { PIZZAS } from '../constants'; // Fallback to mock data for now
// import { useProduct } from '../hooks/useProduct'; // TODO: Implement real hook

export const ProductDetail: React.FC = () => {
    const { id } = useParams();
    const { addItem } = useCartStore();

    // Create a merged product object (mock logic for now)
    const product = PIZZAS.find(p => p.id === id) || {
        id: '1',
        name: 'Sample Product',
        price: '150',
        description: 'A premium garment crafted for the modern individual.',
        image: 'sample-id',
        category: 'Tops',
        ingredients: []
    };

    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');

    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const colors = ['Black', 'White', 'Slate'];

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert('Please select size and color');
            return;
        }

        addItem({
            id: `${product.id}-${selectedSize}-${selectedColor}`,
            productId: product.id,
            name: product.name,
            price: parseInt(product.price.toString().replace(/[^0-9]/g, '')),
            quantity: 1,
            image: product.image,
            size: selectedSize,
            color: selectedColor,
            maxStock: 99 // mock
        });
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-20 md:pt-0">
            {/* Left: Image Gallery */}
            <div className="h-[60vh] md:h-screen bg-gray-100 relative overflow-hidden">
                <img
                    src={cloudinaryLoader({ src: product.image, width: 1200 })}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right: Details */}
            <div className="p-6 md:p-20 flex flex-col justify-center h-full bg-[var(--cream-vanilla)]">
                <div className="max-w-md w-full mx-auto">
                    <span className="font-body text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4 block">
                        {product.category || 'Collection'}
                    </span>

                    <h1 className="font-heading text-4xl md:text-6xl mb-4 leading-none">
                        {product.name}
                    </h1>

                    <div className="font-body text-xl md:text-2xl font-light mb-8">
                        ${product.price}
                    </div>

                    <p className="font-body text-sm leading-relaxed text-gray-600 mb-10">
                        {product.description}
                    </p>

                    {/* Variants */}
                    <div className="space-y-6 mb-10">
                        {/* Colors */}
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest mb-3 block">Color</span>
                            <div className="flex gap-3">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-all ${selectedColor === color ? 'ring-2 ring-black ring-offset-2' : ''}`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold uppercase tracking-widest">Size</span>
                                <button className="text-xs underline text-gray-500">Size Guide</button>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-10 border border-gray-200 text-xs font-bold uppercase tracking-widest transition-colors ${selectedSize === size ? 'bg-black text-white border-black' : 'hover:border-black'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-black text-white py-4 font-body font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors mb-4"
                    >
                        Add to Cart
                    </button>

                    {/* Accordions */}
                    <div className="border-t border-gray-200 mt-8">
                        <details className="group py-4 border-b border-gray-200 cursor-pointer">
                            <summary className="flex justify-between items-center font-bold text-xs uppercase tracking-widest list-none">
                                <span>Material & Care</span>
                                <span className="group-open:rotate-180 transition-transform">+</span>
                            </summary>
                            <div className="pt-4 text-xs leading-relaxed text-gray-500">
                                100% Premium Cotton. Machine wash cold. Do not tumble dry.
                            </div>
                        </details>
                        <details className="group py-4 border-b border-gray-200 cursor-pointer">
                            <summary className="flex justify-between items-center font-bold text-xs uppercase tracking-widest list-none">
                                <span>Shipping & Returns</span>
                                <span className="group-open:rotate-180 transition-transform">+</span>
                            </summary>
                            <div className="pt-4 text-xs leading-relaxed text-gray-500">
                                Free shipping on orders over $200. Returns accepted within 14 days.
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
};
