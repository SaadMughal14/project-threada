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
        <Link to={`/products/${product.id}`} className="block group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F0F0F0] mb-4">
                {/* Main Image */}
                <img
                    src={cloudinaryLoader({ src: product.image, width: 600 })}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Hover Image (if exists) or slight darken effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            <div className="flex justify-between items-start px-1">
                <div>
                    <h3 className="font-body font-bold text-sm uppercase tracking-wider text-[var(--deep-basil)]">
                        {product.name}
                    </h3>
                    <p className="font-body text-xs text-gray-500 mt-1 uppercase tracking-widest">
                        {product.category}
                    </p>
                </div>
                <span className="font-body font-bold text-sm text-[var(--deep-basil)]">
                    ${product.price}
                </span>
            </div>
        </Link>
    );
};
