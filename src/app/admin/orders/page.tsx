"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

type Order = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: any[];
  totalPrice: number;
  status: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);

    const snap = await getDocs(collection(db, "orders"));

    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];

    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "orders", id), { status });
    fetchOrders();
  };

  // 🔥 STATUS COLOR FUNCTION
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          📦 Orders Management
        </h1>
        <p className="text-gray-500">
          Manage all customer orders in real-time
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <div className="grid gap-5">

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border border-gray-100"
            >

              {/* TOP SECTION */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">

                {/* LEFT */}
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {order.customerName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {order.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    📞 {order.phone}
                  </p>
                </div>

                {/* STATUS */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* ADDRESS */}
              <div className="mt-3 text-gray-600 text-sm">
                📍 {order.address}
              </div>

              {/* ITEMS */}
              <div className="mt-4 flex flex-wrap gap-2">
                {order.items.map((item, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                  >
                    🍔 {item.name} × {item.quantity || 1}
                  </span>
                ))}
              </div>

              {/* TOTAL */}
              <div className="mt-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">
                  Total: ₹{order.totalPrice}
                </h3>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex flex-wrap gap-2">

                <button
                  onClick={() => updateStatus(order.id, "confirmed")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Confirm
                </button>

                <button
                  onClick={() => updateStatus(order.id, "delivered")}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Delivered
                </button>

                <button
                  onClick={() => updateStatus(order.id, "cancelled")}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Cancel
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}