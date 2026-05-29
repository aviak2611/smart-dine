"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

type CardProps = {
  title: string;
  value: number | string;
  icon: string;
};

function Card({ title, value, icon }: CardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition border border-gray-100">

      <div className="flex items-center justify-between">
        <h2 className="text-gray-500 text-sm font-medium">
          {title}
        </h2>
        <span className="text-2xl">{icon}</span>
      </div>

      <p className="text-3xl font-bold text-gray-900 mt-3">
        {value}
      </p>

    </div>
  );
}

export default function AdminDashboard() {

  const [foodsCount, setFoodsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const foodsSnap = await getDocs(collection(db, "foods"));
      const ordersSnap = await getDocs(collection(db, "orders"));
      const usersSnap = await getDocs(collection(db, "users"));


      setFoodsCount(foodsSnap.size);
      setOrdersCount(ordersSnap.size);

      // To Hide Admin count
      setUsersCount(usersSnap.size - 1);


      let total = 0;

      ordersSnap.forEach((doc) => {
        total += doc.data().totalPrice || 0;
      });

      setRevenue(total);

    } catch (err) {
      console.log("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Admin Dashboard 📊
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your restaurant in real-time
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-gray-500 text-lg">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <Link href="/admin/foods">
              <div className="cursor-pointer hover:scale-105 transition">
                <Card
                  title="Total Foods"
                  value={foodsCount}
                  icon="🍔"
                />
              </div>
            </Link>

            <Link href="/admin/orders">
              <div className="cursor-pointer hover:scale-105 transition">
                <Card
                  title="Total Orders"
                  value={ordersCount}
                  icon="📦"
                />
              </div>
            </Link>

            <Link href="/admin/users">
              <div className="cursor-pointer hover:scale-105 transition">
                <Card
                  title="Total Users"
                  value={usersCount}
                  icon="👤"
                />
              </div>
            </Link>
            {/* Revenue Card */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-5 sm:p-6 shadow-lg hover:scale-[1.02] transition">

              <div className="flex items-center justify-between">
                <h2 className="text-orange-100 text-sm font-medium">
                  Revenue
                </h2>
                <span className="text-2xl">💰</span>
              </div>

              <p className="text-3xl font-bold mt-3">
                ₹{revenue}
              </p>

            </div>

          </div>

          {/* REFRESH BUTTON */}
          <div className="mt-8">
            <button
              onClick={fetchData}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition shadow-md"
            >
              🔄 Refresh Dashboard
            </button>
          </div>

        </>
      )}

    </div>
  );
}