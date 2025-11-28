import React, { useState } from 'react';
import type { Database } from '../../types/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product, size?: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = product.images || [];
    const imageUrl = images.length > 0 ? images[currentImageIndex] : null;

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    const inventory = (product.inventory as Record<string, number>) || {};
    const totalStock = Object.values(inventory).reduce((a, b) => a + b, 0);
    const isOutOfStock = totalStock <= 0;
    const sizes = Object.keys(inventory).filter(size => inventory[size] > 0);

    const handleAddToCart = () => {
        if (sizes.length > 0 && !selectedSize) {
            alert("Please select a size");
            return;
        }
        onAddToCart(product, selectedSize || undefined);
        setSelectedSize(null); // Reset after adding
    };

    return (
        <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all group flex flex-col h-full">
            <div className="aspect-[4/5] bg-zinc-800 relative overflow-hidden group/image">
                {imageUrl ? (
                    <>
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-black/70"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-black/70"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                    {images.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/30'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm pointer-events-none">
                        <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold uppercase tracking-wider rounded transform -rotate-12">Sold Out</span>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-white font-bold line-clamp-1">{product.name}</h3>
                        <p className="text-zinc-500 text-xs uppercase tracking-wider">{product.category || 'Merch'}</p>
                    </div>
                    <div className="text-orange-500 font-bold whitespace-nowrap ml-2">
                        {product.price} €
                    </div>
                </div>

                <div className="mt-auto pt-4 space-y-3">
                    {sizes.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-3 py-1 text-xs font-bold rounded border transition-colors ${selectedSize === size
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || (sizes.length > 0 && !selectedSize)}
                        className="w-full py-3 bg-white text-black font-bold rounded hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm uppercase tracking-wide flex items-center justify-center gap-2"
                    >
                        {isOutOfStock ? 'Out of Stock' : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                {sizes.length > 0 && !selectedSize ? 'Select Size' : 'Add to Cart'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
