# 🍔 SmartDine - Food Delivery Web Application

SmartDine is a modern full-stack food delivery web application built using **Next.js, Firebase, and Tailwind CSS**.  
It provides users with a smooth experience to browse food items, add them to cart, and place orders with authentication and real-time database support.

---

## 🌐 Live Demo
(https://smart-dine-kappa.vercel.app/)

---

## 🚀 Features

- 🔐 User Authentication (Login / Signup using Firebase Auth)
- 🍔 Dynamic Food Listing from Firestore Database
- 📂 Category-based Filtering (Burger, Pizza, Pasta, Drinks, Dessert)
- 🛒 Add to Cart System with Quantity Management
- 💰 Automatic Price Calculation
- 📦 Checkout Page with Order Placement
- ☁️ Firebase Firestore Integration for Orders
- 📱 Fully Responsive UI (Mobile + Desktop)
- ⚡ Smooth Navigation with Scroll to Sections
- 🎯 Protected Actions (Only logged-in users can add items)

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js (App Router)
- React.js
- Tailwind CSS

**Backend / Database:**
- Firebase Authentication
- Firebase Firestore

**Tools:**
- Git & GitHub
- Vercel (Deployment)

---

## 📂 Project Structure
smart-dine/
│
├── src/
│ ├── app/
│ ├── components/
│ ├── context/
│ ├── lib/
│ │ └── firebase.ts
│ └── styles/
│
├── public/
├── .env.local
├── package.json
---

## ⚙️ Installation & Setup Instructions

Follow these steps to run the project locally:

### 1️⃣ Clone Repository
git clone https://github.com/your-username/smart-dine.git

2️⃣ Move to Project Folder
cd smart-dine

3️⃣ Install Dependencies
npm install

4️⃣ Setup Environment Variables

Create .env.local file in root directory:

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
5️⃣ Run Project
npm run dev

Now open:
http://localhost:3000

🔥 Key Functionalities

🛒 Cart System
Add / remove items
Increase / decrease quantity
Auto total price calculation

🔐 Authentication
Firebase login system
Protected cart & checkout features

## 🔐 Admin Access
Admin panel is protected with authentication system.
For demo purposes, contact developer for admin credentials.

📦 Order System
Orders stored in Firestore
User-specific order tracking ready

👨‍💻 Developer
Avishkar Kesarkar
Web Developer | React | Next.js | Firebase

📌 Future Improvements
Live order tracking system 🚚
Admin dashboard 📊
Payment gateway integration 💳
Email confirmation system 📧
⭐ If you like this project

Give it a ⭐ on GitHub and feel free to contribute!
