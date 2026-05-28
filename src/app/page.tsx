"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

import CategoryFilter from "@/components/CategoryFilter";
import FoodCard from "@/components/FoodCard";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/Footer";

type FoodType = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity?: number;
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [loading, setLoading] = useState(true);

  const { cartItems, setCartItems } = useCart();

  // FETCH FOODS
  const fetchFoods = async () => {
    try {
      setLoading(true);

      const snap = await getDocs(collection(db, "foods"));

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FoodType[];

      setFoods(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // ADD TO CART
  const handleAddToCart = (food: FoodType) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === food.id);

      if (existing) {
        return prev.map((item) =>
          item.id === food.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...prev, { ...food, quantity: 1 }];
    });
  };

  // REMOVE
  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // INCREASE
  const increaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  // DECREASE
  const decreaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => (item.quantity || 0) > 0)
    );
  };

  // FILTER
  const filteredFoods =
    activeCategory === "All"
      ? foods
      : foods.filter((food) => food.category === activeCategory);

  return (
    <div>

      <Navbar
        cartCount={cartItems.length}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
      />

      <Hero />

      <CategoryFilter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* FOOD SECTION */}
      <section id="foods" className="px-6 py-16 bg-white">

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Popular Foods
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading foods...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                name={food.name}
                price={food.price}
                image={food.image}
                onAddToCart={() => handleAddToCart(food)}
              />
            ))}

          </div>
        )}

      </section>

      <Footer />

    </div>
  );
}