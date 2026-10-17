import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, OrderItem } from '../types';

interface CartContextType {
  items: OrderItem[];
  tableNumber: string;
  setTableNumber: (table: string) => void;
  addToCart: (item: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeFromCart: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  tax: number;
  total: number;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('farzi_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tableNumber, setTableNumber] = useState<string>(() => {
    // Check URL or localStorage
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      localStorage.setItem('farzi_table_number', tableParam.toUpperCase());
      return tableParam.toUpperCase();
    }
    return localStorage.getItem('farzi_table_number') || 'T04';
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('farzi_cart_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (tableNumber) {
      localStorage.setItem('farzi_table_number', tableNumber);
    }
  }, [tableNumber]);

  const addToCart = (item: MenuItem, quantity = 1, specialInstructions = '') => {
    setItems(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i =>
          i.menuItemId === item.id
            ? { ...i, quantity: i.quantity + quantity, specialInstructions: specialInstructions || i.specialInstructions }
            : i
        );
      }
      return [
        ...prev,
        {
          id: Date.now(),
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity,
          specialInstructions,
          imageUrl: item.imageUrl,
          isVeg: item.isVeg
        }
      ];
    });
  };

  const removeFromCart = (menuItemId: number) => {
    setItems(prev => prev.filter(i => i.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: number, delta: number) => {
    setItems(prev =>
      prev
        .map(i => {
          if (i.menuItemId === menuItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('farzi_cart_items');
  };

  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));
  const totalCount = items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        tableNumber,
        setTableNumber,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        tax,
        total,
        totalCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
