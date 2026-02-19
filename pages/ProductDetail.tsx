import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../src/store/cartStore';
import { cloudinaryLoader } from '../src/lib/cloudinaryLoader';
import { PRODUCTS } from '../constants';
import { ChevronLeft, Heart, Star, Minus, Plus } from 'lucide-react';

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
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'details' | 'specs'>('details');

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
            quantity: quantity,
            image: product.image,
            size: selectedSize,
            color: selectedColor,
            maxStock: 99
        });

        toggleCart(); // Open cart immediately for feedback
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, Math.min(99, prev + delta)));
    };

    // Calculate discounted price for demo (50% markup for strikethrough)
    const currentPrice = parseInt(product.price.toString().replace(/[^0-9]/g, ''));
    const originalPrice = currentPrice * 2;

    return (
        <>
            {/* MOBILE LAYOUT (Premium Design - Brand Theme) */}
            <div className="lg:hidden min-h-screen bg-[var(--cream-vanilla)] pb-32 font-sans">

                {/* Main Image Card (Sharp Edges) */}
                <div className="mx-4 mt-4 h-[55vh] bg-[#E5E5E5] relative overflow-hidden border border-black/5">
                    <img
                        src={cloudinaryLoader({ src: product.image, width: 800 })}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />

                    {/* Floating Thumbnails Stack (Sharp) - Real Variants */}
                    <div className="absolute top-6 right-6 flex flex-col gap-3">
                        {colors.slice(0, 3).map((color, idx) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`w-14 h-14 bg-white/40 p-1 backdrop-blur-md shadow-sm overflow-hidden border transition-all ${selectedColor === color ? 'border-black' : 'border-white/50'}`}
                            >
                                <div className="w-full h-full relative">
                                    <img
                                        src={cloudinaryLoader({ src: product.image, width: 200 })}
                                        alt={color}
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                    {/* Color Tint Overlay to simulate variant */}
                                    <div className="absolute inset-0 mix-blend-multiply" style={{ backgroundColor: color.toLowerCase(), opacity: 0.3 }} />
                                </div>
                            </button>
                        ))}
                        {colors.length > 3 && (
                            <div className="w-14 h-14 bg-black/90 backdrop-blur-md text-white flex items-center justify-center text-xs font-bold border border-white/10 shadow-sm">
                                +{colors.length - 3}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-6 pt-8">
                    <div className="mb-4">
                        <h1 className="text-3xl font-black leading-[1.1] mb-2 text-black uppercase tracking-tight">{product.name}</h1>
                    </div>

                    {/* Ratings Row */}
                    <div className="flex items-center gap-4 text-xs font-bold mb-6 text-gray-500 uppercase tracking-widest">
                        <div className="flex items-center gap-1 bg-black text-white px-2.5 py-1">
                            <Star size={12} fill="currentColor" /> 4.9
                        </div>
                        <span>1.5k+ Reviews</span>
                        <span className="w-1 h-1 bg-black/10"></span>
                        <span>2.4k+ Sold</span>
                    </div>

                    {/* Price Row */}
                    <div className="flex items-end gap-3 mb-8">
                        <span className="text-3xl font-black text-black">${currentPrice}</span>
                        <span className="text-xl text-black/30 line-through decoration-2 font-medium">${originalPrice}</span>
                        <span className="bg-black text-white text-[10px] font-bold px-3 py-1 mb-1.5 ml-1 uppercase tracking-wider">-50%</span>
                    </div>

                    {/* Tabs (Boxy) */}
                    <div className="bg-black/5 p-1 flex mb-10 relative">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex-1 py-3.5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 border border-transparent ${activeTab === 'details' ? 'bg-white shadow-sm text-black border-black/5' : 'text-black/40 hover:text-black'}`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`flex-1 py-3.5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 border border-transparent ${activeTab === 'specs' ? 'bg-white shadow-sm text-black border-black/5' : 'text-black/40 hover:text-black'}`}
                        >
                            Specs
                        </button>
                    </div>

                    {/* Selectors (Square/Sharp) */}
                    <div className="space-y-8 mb-8">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-black block text-black uppercase tracking-widest">Select Size</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest underline decoration-1 text-black/40 cursor-pointer hover:text-black">Size Guide</span>
                            </div>
                            <div className="flex gap-3">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 flex items-center justify-center text-xs font-bold transition-all border ${selectedSize === size
                                            ? 'bg-black text-white border-black ring-1 ring-black ring-offset-2'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-black'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-black mb-4 block text-black uppercase tracking-widest">Select Color</span>
                            <div className="flex gap-4">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-12 h-12 border relative flex items-center justify-center transition-all ${selectedColor === color
                                            ? 'border-black ring-1 ring-black ring-offset-2'
                                            : 'border-gray-200 hover:border-black'
                                            }`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content based on Tab */}
                    <div className="mb-8 min-h-[80px]">
                        {activeTab === 'details' ? (
                            <p className="text-gray-600 text-sm leading-relaxed animate-fade-in font-medium">
                                {product.description} Constructed from premium heavyweight fabric for durability and drape. <button className="text-black font-black underline decoration-2 underline-offset-4 uppercase text-xs tracking-wide">Read More</button>
                            </p>
                        ) : (
                            <div className="animate-fade-in">
                                <h3 className="text-xs font-black mb-3 text-black uppercase tracking-widest">Materials & Composition</h3>
                                <ul className="space-y-2 font-medium">
                                    {(product.materials || ["Premium Cotton Blend"]).map((m: string) => (
                                        <li key={m} className="flex items-start gap-3 text-sm text-gray-600">
                                            <span className="w-1 h-1 bg-black mt-2 flex-shrink-0" />
                                            <span className="leading-relaxed uppercase tracking-wide text-xs">{m}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed Floating Bottom Bar (Sharp) */}
                <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] p-6 flex items-center justify-between shadow-2xl z-40 border-t border-white/10">
                    <div className="flex items-center gap-6 text-white font-medium border border-white/20 px-4 py-3 bg-white/5">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold tracking-widest">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedSize || !selectedColor}
                        className={`flex-1 ml-4 py-4 font-black uppercase text-xs tracking-[0.2em] transition-all border border-transparent ${selectedSize && selectedColor
                            ? 'bg-white text-black hover:bg-gray-200'
                            : 'bg-white/10 text-white/40 border-white/10 cursor-not-allowed'
                            }`}
                    >
                        {selectedSize && selectedColor ? 'Add to Cart' : 'Select Options'}
                    </button>
                </div>
            </div>

            {/* DESKTOP LAYOUT (Original) */}
            <div className="hidden lg:grid min-h-screen grid-cols-2 bg-[var(--cream-vanilla)]">
                {/* Sticky Image Column */}
                <div className="h-screen sticky top-0 bg-[#E5E5E5] relative overflow-hidden">
                    <img
                        src={cloudinaryLoader({ src: product.image, width: 1600 })}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Scrollable Content Column */}
                <div className="p-24 flex flex-col justify-center min-h-screen">
                    <div className="max-w-lg w-full mx-auto animate-fade-in-up">
                        <span className="font-body text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-6 block">
                            {product.category} / 001
                        </span>

                        <h1 className="font-heading text-7xl mb-6 leading-[0.9]">
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
        </>
    );
};
