"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        // VALIDATION
        if (!name || !email || !password) {
            setErrorMessage("⚠ Please fill all fields!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setErrorMessage("⚠ Please enter valid email!");
            return;
        }

        if (password.length < 6) {
            setErrorMessage("⚠ Password must be at least 6 characters!");
            return;
        }

        try {
            setIsLoading(true);

            // 1️⃣ CREATE USER IN FIREBASE AUTH
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            // 2️⃣ SAVE USER IN FIRESTORE (IMPORTANT FOR ADMIN PANEL)
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name,
                email,
                role: "user",          // 👈 IMPORTANT (admin/user system)
                isBlocked: false,      // 👈 for admin control
                createdAt: serverTimestamp(),
            });

            setSuccessMessage("🎉 Account Created Successfully!");

            // reset form
            setName("");
            setEmail("");
            setPassword("");

            setIsLoading(false);

            // redirect
            setTimeout(() => {
                router.push("/login");
            }, 1200);

        } catch (error: any) {
            console.log(error);
            setIsLoading(false);
            setErrorMessage("⚠ Email already exists or invalid!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 to-gray-100 flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">

                {/* TITLE */}
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
                    Create Account
                </h1>

                <p className="text-gray-500 text-center mb-6">
                    Register to continue 🍔
                </p>

                {/* ERROR */}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                        {errorMessage}
                    </div>
                )}

                {/* SUCCESS */}
                {successMessage && (
                    <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">
                        {successMessage}
                    </div>
                )}

                {/* FORM */}
                <div className="flex flex-col gap-4">

                    {/* NAME */}
                    <div className="flex items-center border rounded-xl px-3 py-3 bg-gray-50">
                        <FaUser className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent outline-none text-gray-800"
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="flex items-center border rounded-xl px-3 py-3 bg-gray-50">
                        <FaEnvelope className="text-gray-400 mr-2" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent outline-none text-gray-800"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="flex items-center border rounded-xl px-3 py-3 bg-gray-50">
                        <FaLock className="text-gray-400 mr-2" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent outline-none text-gray-800"
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-semibold transition"
                    >
                        {isLoading ? "Creating Account..." : "Register"}
                    </button>

                </div>

                {/* LOGIN LINK */}
                <p className="text-center text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-orange-500 font-semibold hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}