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
    category: string;
}

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Link to={`/products/${product.id}`} className="block group cursor-pointer relative">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-3">
                {/* Main Image */}
                <img
                    src={cloudinaryLoader({ src: product.image, width: 600 })}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                {/* Quick Add Button - Appears on Hover */}
                <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                        Quick Add
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-start px-1">
                <div className="flex flex-col gap-1">
                    <h3 className="font-heading font-black text-sm uppercase tracking-wide text-black leading-none">
                        {product.name}
                    </h3>
                    <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">
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
