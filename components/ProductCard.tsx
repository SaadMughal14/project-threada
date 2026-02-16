import React from 'react';
import { Link } from 'react-router-dom';
import { cloudinaryLoader } from '../src/lib/cloudinaryLoader';
import { ProductVariant } from '../types';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    hoverImage?: string; // Optional hover state
    images?: string[]; // Optional array of images
    category: string;
}

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    // Determine the secondary image source (if available)
    // If product has a specific hoverImage, use it.
    // If product has an images array and length > 1, use the second one.
    // Otherwise fallback to null (no hover effect).

    // NOTE: Types need to be loose here if the incoming data structure varies, 
    // but ideally we stick to the interface. 
    // Checking if 'images' exists on the product object even if not in the strict interface above 
    // to handle potential backend data variations.
    const secondaryImage = product.hoverImage ||
        (product.images && product.images.length > 1 ? product.images[1] : null);

    return (
        <Link to={`/products/${product.id}`} className="block group cursor-pointer relative">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-3">
                {/* Main Image */}
                <img
                    src={cloudinaryLoader({ src: product.image, width: 600 })}
                    alt={product.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${secondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                />

                {/* Secondary Image (Hover State) */}
                {secondaryImage && (
                    <img
                        src={cloudinaryLoader({ src: secondaryImage, width: 600 })}
                        alt={`${product.name} hover`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 hidden md:block"
                    />
                )}

                {/* Hover Overlay - Only show if no secondary image, or maybe subtle darkening? 
                    Decision: Keep it clean. If we swap images, we usually don't need a heavy overlay 
                    unless text needs to pop. The original request asked for seamless crossfade. 
                */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />

                {/* Quick Add Button - Appears on Hover (Desktop only) */}
                <div className="hidden md:block absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <button className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black">
                        Quick Add
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-start px-1">
                <div className="flex flex-col gap-1">
                    <h3 className="font-heading font-black text-sm uppercase tracking-wide text-black leading-none">
                        {product.name}
                    </h3>
                    <p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest">
                        {product.category}
                    </p>
                </div>
                <span className="font-mono font-medium text-sm text-black tracking-tighter">
                    ${product.price}
                </span>
            </div>
        </Link>
    );
};
