import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Database } from '../types/database.types';

type Product = Database['public']['Tables']['products']['Row'];

export interface CartItem extends Product {
    quantity: number;
    selectedSize?: string;
}

interface CartContextType {
    cart: CartItem[];
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    addToCart: (product: Product, size?: string) => void;
    removeFromCart: (productId: string, size?: string) => void;
    updateQuantity: (productId: string, delta: number, size?: string) => void;
    clearCart: () => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem('munera_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('munera_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, size?: string) => {
        setCart(current => {
            const existing = current.find(item => item.id === product.id && item.selectedSize === size);
            if (existing) {
                return current.map(item =>
                    item.id === product.id && item.selectedSize === size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...current, { ...product, quantity: 1, selectedSize: size }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string, size?: string) => {
        setCart(current => current.filter(item => !(item.id === productId && item.selectedSize === size)));
    };

    const updateQuantity = (productId: string, delta: number, size?: string) => {
        setCart(current => current.map(item => {
            if (item.id === productId && item.selectedSize === size) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart,
            isCartOpen,
            setIsCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
