"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  isBlocked?: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);

    const snap = await getDocs(collection(db, "users"));

    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];

    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // BLOCK / UNBLOCK
  const toggleBlock = async (user: User) => {
    await updateDoc(doc(db, "users", user.id), {
      isBlocked: !user.isBlocked,
    });

    fetchUsers();
  };

  // DELETE
  const deleteUser = async (id: string) => {
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">

      {/* TITLE */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          👤 Users Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage all registered users
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : users.filter((u) => u.role !== "admin").length === 0 ? (
        <p className="text-gray-500">No users found</p>
      ) : (
        <div className="grid gap-4">

          {users
            .filter((user) => user.role !== "admin")   // 🔥 ADMIN HIDDEN
            .map((user) => (
              <div
                key={user.id}
                className="bg-white border border-gray-100 shadow-md rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg transition"
              >

                {/* LEFT SIDE */}
                <div className="space-y-1">

                  <h2 className="text-lg font-bold text-gray-900">
                    {user.name}
                  </h2>

                  <p className="text-gray-700 font-medium">
                    {user.email}
                  </p>

                  {user.phone && (
                    <p className="text-gray-500 text-sm">
                      📞 {user.phone}
                    </p>
                  )}

                  {/* STATUS */}
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                      user.isBlocked
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4 md:mt-0">

                  <button
                    onClick={() => toggleBlock(user)}
                    className={`px-4 py-2 rounded-xl font-medium text-white transition ${
                      user.isBlocked
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>

                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

        </div>
      )}
    </div>
  );
}