"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type FoodType = {
  id: string; 
  name: string;
  category: string;
  price: number;
  image: string;
  quantity?: number;
};

type CartContextType = {
  cartItems: FoodType[];
  setCartItems: React.Dispatch<React.SetStateAction<FoodType[]>>;
  clearCart: () => void; 
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartItems, setCartItems] = useState<FoodType[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.log("Cart parse error:", err);
        localStorage.removeItem("cartItems");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        clearCart, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}