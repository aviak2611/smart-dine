"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Foods", path: "/admin/foods", icon: "🍔" },
    { name: "Orders", path: "/admin/orders", icon: "📦" },
    { name: "Users", path: "/admin/users", icon: "👤" },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="h-full w-64 bg-[#1f2937] text-white flex flex-col shadow-2xl">

      {/* HEADER */}
      <div className="p-5 border-b border-gray-700">
        <h1 className="text-xl font-bold">
          🍔 SmartDine Admin
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Control Panel
        </p>
      </div>

      {/* MENU */}
      <div className="flex-1 p-3 space-y-2">

        {menu.map((item) => {
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 font-medium

                ${active
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}

      </div>

      {/* LOGOUT */}
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-gray-700 hover:bg-orange-500 text-white py-3 rounded-xl font-medium transition"
        >
          🚪 Logout
        </button>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-xs text-gray-400 border-t border-gray-700">
        © 2026 SmartDine. All rights reserved.      </div>

    </div>
  );
}