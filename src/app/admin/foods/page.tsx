"use client";

import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function FoodsPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement | null>(null);

  const foodRef = collection(db, "foods");

  // FETCH
  const fetchFoods = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(foodRef);
      setFoods(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.log(err);
      setError("Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // RESET
  const resetForm = () => {
    setName("");
    setPrice("");
    setImage("");
    setCategory("");
  };

  // ADD FOOD
  const addFood = async () => {
    setError("");

    if (!name || !price || !image || !category) {
      setError("Please fill all fields");
      return;
    }

    try {
      setAdding(true);

      await addDoc(foodRef, {
        name,
        price: Number(price),
        image,
        category,
        createdAt: serverTimestamp(),
      });

      resetForm();
      fetchFoods();
    } catch (err) {
      console.log(err);
      setError("Error adding food");
    } finally {
      setAdding(false);
    }
  };

  // UPDATE FOOD
  const updateFood = async () => {
    if (!editId) return;

    try {
      setAdding(true);

      await updateDoc(doc(db, "foods", editId), {
        name,
        price: Number(price),
        image,
        category,
      });

      resetForm();
      setEditId(null);
      fetchFoods();
    } catch (err) {
      console.log(err);
      setError("Error updating food");
    } finally {
      setAdding(false);
    }
  };

  // DELETE
  const deleteFood = async (id: string) => {
    try {
      await deleteDoc(doc(db, "foods", id));
      fetchFoods();
    } catch (err) {
      console.log(err);
      setError("Delete failed");
    }
  };

  // EDIT
  const handleEdit = (food: any) => {
    setEditId(food.id);
    setName(food.name);
    setPrice(food.price);
    setImage(food.image);
    setCategory(food.category);

    // 🔥 AUTO SCROLL TO FORM
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const inputStyle =
    "w-full border border-gray-300 bg-white text-gray-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400";

  const categories = ["Burger", "Pizza", "Pasta", "Cold Drinks", "Dessert"];

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">

      {/* TITLE */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
        🍔 Foods Management
      </h1>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {/* FORM */}
      <div
        ref={formRef}
        className="bg-white p-4 md:p-6 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-4 gap-3"
      >

        <input
          placeholder="Food Name"
          className={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Price"
          className={inputStyle}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          placeholder="Image URL"
          className={inputStyle}
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <select
          className={inputStyle}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* BUTTON */}
        <button
          onClick={editId ? updateFood : addFood}
          disabled={adding}
          className="bg-orange-500 text-white py-3 rounded-xl md:col-span-4 hover:bg-orange-600 transition disabled:opacity-50"
        >
          {adding
            ? "Processing..."
            : editId
            ? "Update Food"
            : "Add Food"}
        </button>

        {/* CANCEL */}
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              resetForm();
            }}
            className="bg-gray-500 text-white py-2 rounded-xl md:col-span-4"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* LIST */}
      {loading ? (
        <p className="mt-6 text-gray-600">Loading foods...</p>
      ) : foods.length === 0 ? (
        <p className="mt-6 text-gray-500">No foods added yet 🍽️</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={food.image}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">

                <h2 className="text-lg font-bold text-gray-900">
                  {food.name}
                </h2>

                <p className="text-gray-700 font-medium">
                  ₹{food.price}
                </p>

                <p className="text-sm text-gray-500 mb-3">
                  {food.category}
                </p>

                <div className="flex gap-2">

                  <button
                    onClick={() => handleEdit(food)}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg w-full"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteFood(food.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg w-full"
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}