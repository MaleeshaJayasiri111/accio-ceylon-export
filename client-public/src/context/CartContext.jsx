import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('accio_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('accio_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  const addToCart = (product, options = {}) => {
    const { packType = 'Matte White Standup Pouch (50g)', quantityKg = 1, isSample = false } = options;
    const itemKey = `${product.id}_${packType}_${isSample ? 'sample' : 'bulk'}`;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.itemKey === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantityKg += quantityKg;
        return updated;
      } else {
        return [...prev, {
          itemKey,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: (product.images && product.images[0]) || '/products/ceylon_mango.jpg',
          packType,
          isSample,
          unitPriceUsd: isSample ? (product.fob_price_usd * 1.5) : product.fob_price_usd,
          quantityKg
        }];
      }
    });

    setIsDrawerOpen(true);
  };

  const updateQuantity = (itemKey, quantityKg) => {
    if (quantityKg <= 0) {
      removeItem(itemKey);
      return;
    }
    setCartItems(prev => prev.map(item => item.itemKey === itemKey ? { ...item, quantityKg } : item));
  };

  const removeItem = (itemKey) => {
    setCartItems(prev => prev.filter(item => item.itemKey !== itemKey));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsCount = cartItems.reduce((sum, item) => sum + 1, 0);
  const totalWeightKg = cartItems.reduce((sum, item) => sum + (item.quantityKg || 1), 0);
  const totalAmountUsd = cartItems.reduce((sum, item) => sum + (item.unitPriceUsd * (item.quantityKg || 1)), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      isDrawerOpen,
      setIsDrawerOpen,
      totalItemsCount,
      totalWeightKg,
      totalAmountUsd
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
