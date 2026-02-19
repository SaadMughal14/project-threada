import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCartStore } from '../src/store/cartStore';
import { cloudinaryLoader } from '../src/lib/cloudinaryLoader';
import { PRODUCTS } from '../constants';

export const ProductDetail: React.FC = () => {
    const { id } = useParams();
    const { addItem, toggleCart } = useCartStore();

    // Find product or fallback
    const product = PRODUCTS.find((p: any) => p.id === id);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--cream-vanilla)]">
                <h1 className="font-heading text-4xl mb-4">Product Not Found</h1>
                <a href="/" className="border-b border-black text-xs uppercase tracking-widest">Return Home</a>
            </div>
        );
    }

    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');

    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const colors = ['Black', 'White', 'Slate', 'Sand'];

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert('Please select a size and color.');
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
            maxStock: 99
        });

        toggleCart(); // Open cart immediately for feedback
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[var(--cream-vanilla)]">
            {/* Sticky Image Column */}
            <div className="h-[60vh] lg:h-screen lg:sticky lg:top-0 bg-[#E5E5E5] relative overflow-hidden">
                <img
                    src={cloudinaryLoader({ src: product.image, width: 1600 })}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Scrollable Content Column */}
            <div className="p-8 lg:p-24 flex flex-col justify-center min-h-screen">
                <div className="max-w-lg w-full mx-auto animate-fade-in-up">
                    <span className="font-body text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-6 block">
                        {product.category} / 001
                    </span>

                    <h1 className="font-heading text-5xl md:text-7xl mb-6 leading-[0.9]">
                        {product.name}
                    </h1>

                    <div className="font-body text-2xl font-light mb-10 flex items-center gap-4">
                        <span>{product.price}</span>
                        <span className="text-xs uppercase bg-black text-white px-2 py-1 tracking-widest rounded-sm">In Stock</span>
                    </div>

                    <p className="font-body text-base leading-relaxed text-gray-600 mb-12">
                        {product.description} Constructed from premium heavyweight fabric for durability and drape. A staple for any minimalistic wardrobe.
                    </p>

                    {/* Selectors */}
                    <div className="space-y-8 mb-12">
                        {/* Size Selector */}
                        <div>
                            <div className="flex justify-between mb-4">
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">Select Size</span>
                                <span className="text-xs underline text-gray-400 cursor-pointer">Size Guide</span>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-12 border border-gray-300 flex items-center justify-center text-xs font-bold uppercase transition-all duration-200 ${selectedSize === size
                                            ? 'bg-black text-white border-black transform scale-105'
                                            : 'hover:border-black text-gray-500'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selector */}
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Select Color</span>
                            <div className="flex gap-4">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full border border-gray-200 relative flex items-center justify-center transition-transform ${selectedColor === color ? 'ring-2 ring-black ring-offset-4 scale-110' : 'hover:scale-110'
                                            }`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedSize || !selectedColor}
                        className={`w-full py-5 font-body font-bold uppercase tracking-[0.3em] transition-all duration-300 ${selectedSize && selectedColor
                            ? 'bg-black text-white hover:bg-gray-900 cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {selectedSize && selectedColor ? 'Add to Bag' : 'Select Options'}
                    </button>

                    {/* Footer / FAQ */}
                    <div className="mt-16 border-t border-gray-200 pt-8 space-y-4">
                        <div className="flex justify-between group cursor-pointer">
                            <span className="text-xs font-bold uppercase tracking-widest">Details & Care</span>
                            <span>+</span>
                        </div>
                        <div className="flex justify-between group cursor-pointer">
                            <span className="text-xs font-bold uppercase tracking-widest">Shipping & Returns</span>
                            <span>+</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
