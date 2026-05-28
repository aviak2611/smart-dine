"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // 🔥 FIX: single control state
  const [checking, setChecking] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        setChecking(true);

        // ❌ NOT LOGGED IN
        if (!user) {
          router.replace("/login");
          return;
        }

        // 🔍 FETCH USER BY EMAIL
        const q = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );

        const snap = await getDocs(q);

        // ❌ USER NOT FOUND
        if (snap.empty) {
          router.replace("/login");
          return;
        }

        const userData = snap.docs[0].data();

        // 🚫 NOT ADMIN
        if (userData.role !== "admin") {
          router.replace("/");
          return;
        }

        // ✅ ADMIN ALLOWED
        setChecking(false);

      } catch (err) {
        console.log("Admin check error:", err);
        router.replace("/login");
      }
    });

    return () => unsub();
  }, []);

  // ⏳ BLOCK UI UNTIL CHECK COMPLETE
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 font-medium">
          Checking admin access...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black text-white p-4 flex justify-between items-center z-50">
        <h1 className="font-bold">🍔 Admin Panel</h1>

        <button onClick={() => setOpen(true)}>
          ☰
        </button>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static z-50
          h-full
          bg-black text-white
          transition-transform duration-300
          md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-8 mt-16 md:mt-0">
        {children}
      </div>

    </div>
  );
}