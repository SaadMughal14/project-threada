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
            {/* MOBILE LAYOUT (Premium Design) */}
            <div className="lg:hidden min-h-screen bg-white pb-32 font-sans">
                {/* Navigation Overlay */}
                <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-start pointer-events-none">
                    <Link to="/" className="w-12 h-12 bg-white/90 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center pointer-events-auto text-black active:scale-95 transition-transform">
                        <ChevronLeft size={24} />
                    </Link>
                    <button className="w-12 h-12 bg-white/90 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center pointer-events-auto text-black active:scale-95 transition-transform">
                        <Heart size={24} className="text-red-500 fill-current" />
                    </button>
                </div>

                {/* Main Image Card */}
                <div className="mx-4 mt-4 h-[55vh] bg-gray-100 rounded-[40px] relative overflow-hidden shadow-2xl">
                    <img
                        src={cloudinaryLoader({ src: product.image, width: 800 })}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />

                    {/* Floating Thumbnails Stack */}
                    <div className="absolute top-6 right-6 flex flex-col gap-3">
                        {[product.image, product.image, product.image].map((img, idx) => (
                            <div key={idx} className="w-14 h-14 rounded-2xl bg-white/40 p-1 backdrop-blur-md shadow-lg overflow-hidden border border-white/50">
                                <img
                                    src={cloudinaryLoader({ src: img, width: 200 })}
                                    alt="thumbnail"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                        ))}
                        <div className="w-14 h-14 rounded-2xl bg-black/80 backdrop-blur-md text-white flex items-center justify-center text-xs font-bold border border-white/10 shadow-lg">
                            9+
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-6 pt-8">
                    <div className="mb-4">
                        <h1 className="text-3xl font-black leading-[1.1] mb-2 text-black">{product.name}</h1>
                    </div>

                    {/* Ratings Row */}
                    <div className="flex items-center gap-4 text-xs font-bold mb-6 text-gray-500">
                        <div className="flex items-center gap-1 bg-black text-white px-2.5 py-1 rounded-lg">
                            <Star size={12} fill="currentColor" /> 4.9
                        </div>
                        <span>1.5k+ Reviews</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>2.4k+ Sold</span>
                    </div>

                    {/* Price Row */}
                    <div className="flex items-end gap-3 mb-8">
                        <span className="text-3xl font-black text-black">${currentPrice}</span>
                        <span className="text-xl text-gray-400 line-through decoration-2 font-medium">${originalPrice}</span>
                        <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full mb-1.5 ml-1">-50%</span>
                    </div>

                    {/* Tabs */}
                    <div className="bg-gray-100 p-1.5 rounded-full flex mb-10 relative">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex-1 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'details' ? 'bg-white shadow-md text-black' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`flex-1 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'specs' ? 'bg-white shadow-md text-black' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Specifications
                        </button>
                    </div>

                    {/* Selectors */}
                    <div className="space-y-8 mb-8">
                        <div>
                            <span className="text-sm font-bold mb-4 block text-black">Size</span>
                            <div className="flex gap-4">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${selectedSize === size
                                            ? 'bg-black text-white shadow-lg transform scale-110'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-bold mb-4 block text-black">Color</span>
                            <div className="flex gap-4">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-12 h-12 rounded-full border-2 relative flex items-center justify-center transition-all ${selectedColor === color
                                            ? 'border-black transform scale-110'
                                            : 'border-transparent hover:scale-105'
                                            }`}
                                    >
                                        <span
                                            className="w-full h-full rounded-full border border-gray-200"
                                            style={{ backgroundColor: color.toLowerCase() }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content based on Tab */}
                    <div className="mb-8 min-h-[80px]">
                        {activeTab === 'details' ? (
                            <p className="text-gray-500 text-sm leading-relaxed animate-fade-in">
                                {product.description} Constructed from premium heavyweight fabric for durability and drape. <button className="text-black font-bold underline decoration-2 underline-offset-4">Read More</button>
                            </p>
                        ) : (
                            <div className="animate-fade-in">
                                <h3 className="text-sm font-bold mb-2 text-black">Materials & Composition</h3>
                                <ul className="list-disc pl-4 text-sm text-gray-500 space-y-1">
                                    {product.materials?.map((m: string) => <li key={m}>{m}</li>) || <li>Premium Cotton Blend</li>}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed Floating Bottom Bar */}
                <div className="fixed bottom-6 left-4 right-4 bg-[#1C1C1C] rounded-[35px] p-2 pr-2 pl-8 flex items-center justify-between shadow-2xl z-40 border border-white/10">
                    <div className="flex items-center gap-6 text-white font-medium">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            className="w-8 h-8 flex items-center justify-center active:text-gray-300"
                        >
                            <Minus size={20} />
                        </button>
                        <span className="w-6 text-center text-lg font-bold">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            className="w-8 h-8 flex items-center justify-center active:text-gray-300"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedSize || !selectedColor}
                        className={`px-8 py-4 rounded-[28px] font-bold uppercase text-xs tracking-widest transition-all ${selectedSize && selectedColor
                            ? 'bg-white text-black hover:bg-gray-100'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Add to Cart
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
