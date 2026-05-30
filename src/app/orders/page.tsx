"use client";

import OrderTracker from "@/components/OrderTracker";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function UserOrders() {
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, "orders"));

        const unsub = onSnapshot(q, (snap) => {
            setOrders(
                snap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            );
        });

        return () => unsub();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen text-gray-900">

            <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
                My Orders 🚚
            </h1>

            <div className="grid gap-5">

                {orders.map((order) => (
                    <div key={order.id} className="p-5 bg-white rounded-xl shadow-md border border-gray-100">

                        <OrderTracker status={order.status} />

                    </div>
                ))}

            
        

      </div >
    </div >
  );
}