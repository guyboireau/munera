import React from 'react';
import type { Database } from '../../types/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    // Handle case where images might be null or empty
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;
    const isOutOfStock = product.stock <= 0;

    return (
        <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all group flex flex-col h-full">
            <div className="aspect-[4/5] bg-zinc-800 relative overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
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

                <div className="mt-auto pt-4">
                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={isOutOfStock}
                        className="w-full py-3 bg-white text-black font-bold rounded hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm uppercase tracking-wide flex items-center justify-center gap-2"
                    >
                        {isOutOfStock ? 'Out of Stock' : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
