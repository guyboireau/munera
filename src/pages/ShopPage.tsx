import React, { useEffect, useState } from 'react';
import type { Database } from '../types/database.types';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/Shop/ProductCard';
import { useCart } from '../context/CartContext';

type Product = Database['public']['Tables']['products']['Row'];

const ShopPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false });

        if (data) setProducts(data);
    };

    const handleCheckout = async () => {
        // Integration with Stripe would go here
        alert("Checkout integration coming soon! (Requires Stripe setup)");
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">

            {/* Cart Button / Indicator */}
            <div className="fixed bottom-8 right-8 z-40">
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-transform hover:scale-110 relative"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    {cart.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-black">
                            {cart.reduce((a, b) => a + b.quantity, 0)}
                        </span>
                    )}
                </button>
            </div>

            <main className="flex-grow container mx-auto px-4 py-12 mt-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4">MUNERA SHOP</h1>
                    <p className="text-zinc-400">Official merchandise and exclusive drops.</p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-zinc-500 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
                        <p className="text-xl">No products available at the moment.</p>
                        <p className="text-sm mt-2">Check back later for new drops.</p>
                    </div>
                )}
            </main>

            {/* Cart Drawer */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                    <div className="relative w-full max-w-md bg-zinc-900 h-full shadow-2xl p-6 flex flex-col border-l border-zinc-800 transition-transform transform translate-x-0">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">Your Cart</h2>
                            <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                            {cart.length === 0 ? (
                                <div className="text-center text-zinc-500 py-10 flex flex-col items-center">
                                    <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    Your cart is empty.
                                </div>
                            ) : (
                                cart.map((item, index) => (
                                    <div key={`${item.id}-${item.selectedSize || 'nosize'}-${index}`} className="flex gap-4 bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                                        <div className="w-20 h-20 bg-zinc-700 rounded overflow-hidden flex-shrink-0">
                                            {item.images && item.images[0] ? (
                                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-bold text-sm truncate">{item.name}</h4>
                                            <p className="text-orange-500 text-sm">{item.price} €</p>
                                            {item.selectedSize && (
                                                <span className="text-xs bg-zinc-700 px-2 py-0.5 rounded text-zinc-300 mt-1 inline-block">
                                                    Size: {item.selectedSize}
                                                </span>
                                            )}
                                            <div className="flex items-center gap-3 mt-2">
                                                <button onClick={() => updateQuantity(item.id, -1, item.selectedSize)} className="w-6 h-6 bg-zinc-700 rounded flex items-center justify-center hover:bg-zinc-600 text-sm">-</button>
                                                <span className="text-sm font-mono w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1, item.selectedSize)} className="w-6 h-6 bg-zinc-700 rounded flex items-center justify-center hover:bg-zinc-600 text-sm">+</button>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-zinc-500 hover:text-red-500 self-start p-1">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-zinc-800">
                            <div className="flex justify-between text-xl font-bold mb-6">
                                <span>Total</span>
                                <span>{cartTotal.toFixed(2)} €</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-wide"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopPage;
