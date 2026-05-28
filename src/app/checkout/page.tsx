"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { useCart } from "@/context/CartContext";
import { db, auth } from "@/lib/firebase";


export default function CheckoutPage() {

    const { cartItems, setCartItems } = useCart();

    // FORM STATES
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // PAYMENT
    const [paymentMethod, setPaymentMethod] =
        useState("");

    // MESSAGE STATES
    const [errorMessage, setErrorMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState(false);

    // LOADING STATE
    const [isLoading, setIsLoading] =
        useState(false);

    // TOTAL PRICE
    const totalPrice = cartItems.reduce(
        (total, item) =>
            total + item.price * (item.quantity || 1),
        0
    );

    // PLACE ORDER
   const handlePlaceOrder = async () => {

    setErrorMessage("");

    if (!auth.currentUser) {
        setErrorMessage("⚠ Please login first!");
        return;
    }

    if (!firstName || !lastName || !email || !phone || !address) {
        setErrorMessage("⚠ Please fill all delivery details!");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(email)) {
        setErrorMessage("⚠ Invalid email address!");
        return;
    }

    if (!phoneRegex.test(phone)) {
        setErrorMessage("⚠ Phone must be 10 digits!");
        return;
    }

    if (!paymentMethod) {
        setErrorMessage("⚠ Please select payment method!");
        return;
    }

    if (cartItems.length === 0) {
        setErrorMessage("⚠ Cart is empty!");
        return;
    }

    try {
        setIsLoading(true);

        // 🔥 ONLY ADD THIS (NO UI CHANGE)
        await addDoc(collection(db, "orders"), {
            userId: auth.currentUser.uid,
            customerName: `${firstName} ${lastName}`,
            email,
            phone,
            address,
            paymentMethod,
            items: cartItems,
            totalPrice,
            status: "pending",
            createdAt: serverTimestamp(),
        });

        setSuccessMessage(true);

        setCartItems([]);
        localStorage.removeItem("cartItems");

        setTimeout(() => {
            setSuccessMessage(false);
        }, 2000);

    } catch (error) {
        console.log(error);
        setErrorMessage("⚠ Order failed!");
    } finally {
        setIsLoading(false);
    }
};
useEffect(() => {
    if (errorMessage) {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
}, [errorMessage]);
    return (

        <div className="min-h-screen bg-gray-100 px-4 md:px-6 py-6">

            <div className="max-w-6xl mx-auto">

                {/* BACK BUTTON */}
                <Link
                    href="/"
                    className="inline-block mb-6 text-orange-500 font-semibold hover:underline"
                >
                    ← Back To Home
                </Link>

                {/* ERROR MESSAGE */}
                {errorMessage && (

                    <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl font-medium">

                        {errorMessage}

                    </div>

                )}

                {/* SUCCESS SCREEN */}
                {successMessage && (

                    <div className="bg-white rounded-2xl shadow-md p-10 text-center mb-8">

                        <h2 className="text-4xl font-bold text-green-600 mb-4">
                            🎉 Order Placed Successfully!
                        </h2>

                        <p className="text-gray-500 text-lg mb-6">
                            Your delicious food is on the way 😄
                        </p>

                        <button
                            onClick={() =>
                                setSuccessMessage(false)
                            }
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold duration-300"
                        >
                            Continue
                        </button>

                    </div>

                )}

                {/* EMPTY CART */}
                {cartItems.length === 0 && !successMessage ? (

                    <div className="bg-white rounded-2xl shadow-md p-10 text-center">

                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Your Cart is Empty 😄
                        </h2>

                        <p className="text-gray-500 mb-6">
                            Add some delicious food before checkout.
                        </p>

                        <Link
                            href="/"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold duration-300"
                        >
                            Go To Home
                        </Link>

                    </div>

                ) : !successMessage && (

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT SECTION */}
                        <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl shadow-md hover:shadow-xl duration-300">

                            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                                Delivery Details
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 outline-none focus:border-orange-500"
                                />

                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 outline-none focus:border-orange-500"
                                />

                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 outline-none focus:border-orange-500 md:col-span-2"
                                />

                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 outline-none focus:border-orange-500 md:col-span-2"
                                />

                                <textarea
                                    placeholder="Delivery Address"
                                    rows={5}
                                    value={address}
                                    onChange={(e) =>
                                        setAddress(e.target.value)
                                    }
                                    className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 outline-none focus:border-orange-500 md:col-span-2 resize-none"
                                />

                            </div>

                        </div>

                        {/* RIGHT SECTION */}
                        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-md hover:shadow-xl duration-300 h-fit sticky top-6">

                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Order Summary
                            </h2>

                            {cartItems.map((item) => (

                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-4 mb-4"
                                >

                                    <div className="flex items-center gap-3">

                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-14 h-14 object-cover rounded-xl"
                                        />

                                        <div>

                                            <h3 className="text-gray-800 font-semibold text-sm">
                                                {item.name}
                                            </h3>

                                            <p className="text-gray-500 text-sm">
                                                Qty: {item.quantity || 1}
                                            </p>

                                        </div>

                                    </div>

                                    <span className="font-bold text-gray-800">
                                        ₹{item.price * (item.quantity || 1)}
                                    </span>

                                </div>

                            ))}

                            <div className="border-t pt-4 mt-4">

                                <div className="flex justify-between items-center mb-5">

                                    <h3 className="text-xl font-bold text-gray-800">
                                        Total
                                    </h3>

                                    <span className="text-2xl font-bold text-orange-500">
                                        ₹{totalPrice}
                                    </span>

                                </div>

                                {/* PAYMENT METHODS */}
                                <div className="mb-6">

                                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                                        Payment Method
                                    </h3>

                                    <div className="flex flex-col gap-3">

                                        <label
                                            className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer duration-300 ${
                                                paymentMethod === "COD"
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-gray-300 hover:border-orange-500"
                                            }`}
                                        >

                                            <input
                                                type="radio"
                                                name="payment"
                                                value="COD"
                                                checked={paymentMethod === "COD"}
                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <span className="text-gray-700 font-medium">
                                                Cash on Delivery
                                            </span>

                                        </label>

                                        <label
                                            className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer duration-300 ${
                                                paymentMethod === "UPI"
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-gray-300 hover:border-orange-500"
                                            }`}
                                        >

                                            <input
                                                type="radio"
                                                name="payment"
                                                value="UPI"
                                                checked={paymentMethod === "UPI"}
                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <span className="text-gray-700 font-medium">
                                                UPI Payment
                                            </span>

                                        </label>

                                        <label
                                            className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer duration-300 ${
                                                paymentMethod === "CARD"
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-gray-300 hover:border-orange-500"
                                            }`}
                                        >

                                            <input
                                                type="radio"
                                                name="payment"
                                                value="CARD"
                                                checked={paymentMethod === "CARD"}
                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <span className="text-gray-700 font-medium">
                                                Credit / Debit Card
                                            </span>

                                        </label>

                                    </div>

                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isLoading}
                                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-semibold duration-300"
                                >
                                    {isLoading
                                        ? "Processing..."
                                        : "Place Order"}
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );
}