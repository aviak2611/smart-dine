"use client";

import { useState, useEffect } from "react";
import {
    FaBars,
    FaTimes,
    FaShoppingCart,
} from "react-icons/fa";
import Link from "next/link";

import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";


type CartItemType = {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    quantity?: number;
};

type NavbarProps = {
    cartCount: number;
    cartItems: CartItemType[];
    onRemoveFromCart: (id: string) => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
};

export default function Navbar({
    cartCount,
    cartItems,
    onRemoveFromCart,
    increaseQuantity,
    decreaseQuantity,
}: NavbarProps) {

    const [menuOpen, setMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [showPopup, setShowPopup] = useState(false);


    const router = useRouter();
    const { clearCart } = useCart();

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
        0
    );

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsub();
    }, []);

    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => {
                setShowPopup(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [user]);


    const handleLogout = async () => {
        try {
            await signOut(auth);

            //  CLEAR CART (IMPORTANT FIX)
            clearCart();

            // optional safety cleanup
            setUser(null);

            router.push("/login");
        } catch (err) {
            console.log("Logout error:", err);
        }
    };

    return (
        <nav className="bg-white shadow-md px-6 py-4 fixed top-0 left-0 w-full z-[999]">

            {/* HEADER */}
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                <Link
                    href="/#hero"
                    className="text-3xl font-bold text-orange-500 cursor-pointer"
                >
                    SmartDine
                </Link>

                {/* DESKTOP MENU */}
                <ul className="hidden md:flex gap-8 text-gray-800 font-semibold text-lg items-center">

                    <li>
                        <button
                            onClick={() => {
                                document.getElementById("foods")?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }}
                            className="hover:text-orange-500"
                        >
                            Menu
                        </button>
                    </li>
                    <li
                        onClick={() => setCartOpen(!cartOpen)}
                        className="relative cursor-pointer"
                    >
                        <FaShoppingCart className="text-2xl text-gray-800 hover:text-orange-500" />

                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </li>

                    {!user ? (
                        <li>
                            <Link className="hover:text-orange-500" href="/login">
                                Login
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                            >
                                Logout
                            </button>
                        </li>
                    )}

                </ul>

                {/* MOBILE ICON */}
                <div
                    className="md:hidden relative text-2xl text-orange-500 cursor-pointer"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}

                    {/* 🔥 BADGE ON HAMBURGER */}
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    )}
                </div>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
                <ul className="md:hidden flex flex-col items-center gap-5 bg-white mt-4 p-6 rounded-xl shadow-lg text-center">

                    <li>
                        <Link
                            href="/"
                            onClick={closeMenu}
                            className="text-gray-900 font-semibold hover:text-orange-500"
                        >
                            Home
                        </Link>
                    </li>

                    <li>
                        <button
                            onClick={() => {
                                document.getElementById("foods")?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }}
                            className="text-gray-900 font-semibold hover:text-orange-500"                        >
                            Menu
                        </button>
                    </li>

                    <li
                        onClick={() => {
                            setCartOpen(!cartOpen);
                            closeMenu();
                        }}
                        className="relative flex items-center gap-2 text-gray-900 font-semibold"
                    >
                        <FaShoppingCart />

                        {/*  ADD BADGE HERE */}
                        {cartCount > 0 && (
                            <span className="absolute -top-2 left-4 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}


                    </li>

                    {!user ? (
                        <li className="w-full">
                            <Link
                                href="/login"
                                onClick={closeMenu}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl w-full font-semibold"
                            >
                                Login
                            </Link>
                        </li>
                    ) : (
                        <li className="w-full">
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl w-full font-semibold"
                            >
                                Logout
                            </button>
                        </li>
                    )}

                </ul>
            )}

            {/* CART DRAWER */}
            {cartOpen && (
                <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 p-6 overflow-y-auto">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Your Cart
                        </h2>

                        <button
                            onClick={() => setCartOpen(false)}
                            className="text-2xl text-orange-500"
                        >
                            ✕
                        </button>
                    </div>

                    {/* EMPTY */}
                    {cartItems.length === 0 ? (
                        <p className="text-center text-gray-600 mt-10">
                            Your cart is empty 😄
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">

                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gray-100 p-4 rounded-xl flex gap-4"
                                >

                                    <img
                                        src={item.image}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />

                                    <div className="flex-1">

                                        <h3 className="font-bold text-gray-900">
                                            {item.name}
                                        </h3>

                                        {/* QUANTITY FIXED */}
                                        <div className="flex items-center gap-3 mt-2">

                                            <button
                                                onClick={() => decreaseQuantity(item.id)}
                                                className="bg-orange-500 hover:bg-orange-600 text-white w-7 h-7 rounded-full font-bold"
                                            >
                                                -
                                            </button>

                                            <span className="text-gray-900 font-bold text-lg">
                                                {item.quantity || 1}
                                            </span>

                                            <button
                                                onClick={() => increaseQuantity(item.id)}
                                                className="bg-orange-500 hover:bg-orange-600 text-white w-7 h-7 rounded-full font-bold"
                                            >
                                                +
                                            </button>

                                        </div>

                                        <p className="text-orange-500 font-bold mt-1">
                                            ₹{item.price}
                                        </p>

                                        <button
                                            onClick={() => onRemoveFromCart(item.id)}
                                            className="text-red-500 text-sm mt-1 font-medium hover:underline"
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                    {/* TOTAL FIXED VISIBILITY */}
                    {cartItems.length > 0 && (
                        <div className="border-t mt-6 pt-4">

                            <div className="flex justify-between items-center text-lg font-bold text-gray-900">

                                <span>Total</span>

                                <span className="text-orange-500 text-xl">
                                    ₹{totalPrice}
                                </span>

                            </div>

                            <Link href="/checkout">
                                <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold">
                                    Checkout
                                </button>
                            </Link>

                        </div>
                    )}

                </div>
            )}

            {showPopup && !user && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white p-6 rounded-xl w-80 text-center shadow-xl">

                        <h2 className="text-xl font-bold text-gray-800">
                            Please Login First
                        </h2>

                        <p className="text-gray-600 mt-2">
                            You need to login to add items in cart
                        </p>

                        <button
                            onClick={() => router.push("/login")}
                            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-xl w-full"
                        >
                            Go to Login
                        </button>

                        <button
                            onClick={() => setShowPopup(false)}
                            className="mt-2 text-gray-500 text-sm"
                        >
                            Close
                        </button>

                    </div>

                </div>
            )}

        </nav>
    );
}