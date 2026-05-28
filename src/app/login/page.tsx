"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import { FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("⚠ Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            await signInWithEmailAndPassword(auth, email, password);

            const q = query(
                collection(db, "users"),
                where("email", "==", email)
            );

            const snap = await getDocs(q);

            if (snap.empty) {
                setError("User not found");
                setLoading(false);
                return;
            }

            const userData = snap.docs[0].data();

            if (userData.isBlocked) {
                setError("🚫 Your account is blocked");
                setLoading(false);
                return;
            }

            setSuccess("🎉 Login Successful!");

            setTimeout(() => {
                setLoading(false);

                if (userData.role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/");
                }
            }, 700);

        } catch (err) {
            console.log(err);
            setLoading(false);
            setError("⚠ Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-gray-100 px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

                {/* TITLE */}
                <h1 className="text-3xl font-bold text-center text-gray-900">
                    Login
                </h1>

                <p className="text-center text-gray-600 mt-2 mb-6 font-medium">
                    Welcome back 👋
                </p>

                {/* ERROR */}
                {error && (
                    <div className="bg-red-100 text-red-700 font-medium p-3 rounded-xl mb-4">
                        {error}
                    </div>
                )}

                {/* SUCCESS */}
                {success && (
                    <div className="bg-green-100 text-green-700 font-medium p-3 rounded-xl mb-4">
                        {success}
                    </div>
                )}

                {/* EMAIL */}
                <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 mb-4 focus-within:border-orange-500 transition">
                    <FaEnvelope className="text-gray-500 mr-3" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full outline-none text-gray-900 font-medium placeholder-gray-400"
                    />
                </div>

                {/* PASSWORD */}
                <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 mb-6 focus-within:border-orange-500 transition">
                    <FaLock className="text-gray-500 mr-3" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full outline-none text-gray-900 font-medium placeholder-gray-400"
                    />
                </div>

                {/* BUTTON */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* REGISTER */}
                <p className="text-center mt-6 text-gray-600 font-medium">
                    Don’t have account?{" "}
                    <Link href="/register" className="text-orange-500 font-semibold">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
}