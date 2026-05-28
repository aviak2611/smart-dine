"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

type FoodProps = {
  name: string;
  price: number;
  image: string;
  onAddToCart: () => void;
};

export default function FoodCard({
  name,
  price,
  image,
  onAddToCart,
}: FoodProps) {

  const router = useRouter();

  const handleAdd = () => {
    const currentUser = auth.currentUser;

    // 🚫 NOT LOGGED IN → redirect
    if (!currentUser) {
      router.push("/login");
      return;
    }

    // ✅ LOGGED IN → add to cart
    onAddToCart();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-2 transition duration-300">

      {/* IMAGE */}
      <img
        src={image}
        alt={name}
        className="w-full h-56 object-cover"
      />

      {/* CONTENT */}
      <div className="p-4">

        <h2 className="text-xl font-bold text-gray-900">
          {name}
        </h2>

        <p className="text-gray-500 mt-1 text-sm">
          Fresh & delicious food
        </p>

        <div className="flex items-center justify-between mt-4">

          <span className="text-orange-500 text-xl font-bold">
            ₹{price}
          </span>

          <button
            onClick={handleAdd}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
          >
            Add
          </button>

        </div>

      </div>

    </div>
  );
}