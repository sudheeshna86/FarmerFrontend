🌾 Online Agri-Marketplace Platform

A full-stack MERN application that connects farmers directly with buyers to enable fair pricing, transparent negotiation, and secure end-to-end agricultural trade.

This project demonstrates real-world product engineering — covering the complete journey from:
Crop Listing → Negotiation → Payment → Delivery

🎯 Problem Solved

🚫 Removes middlemen from agricultural trade

🤝 Enables direct price negotiation

🔐 Ensures secure digital payments

📄 Automates orders, invoices & delivery tracking

🔍 Brings transparency to the entire process

⭐ Key Features
🌱 Marketplace

Crop listings with:

Price

Quantity

Location

💬 Negotiation System

Offer & Counter-offer flow

Real-time structured bargaining between buyer & farmer

📦 Order Automation

Auto order creation after deal confirmation

Complete order lifecycle management

💳 Payments (Razorpay)

Secure checkout

Order creation

Signature verification

🚚 Delivery System

Distance-based delivery fee calculation

Order tracking

📑 Digital Documentation

Auto-generated PDF invoices / receipts

🧑‍🌾 Role-Based Dashboards

Farmer Dashboard – listings, offers, orders

Buyer Dashboard – browse, negotiate, pay

Driver Dashboard – delivery tracking

🛠️ Technical Skills Demonstrated
🔧 Full-Stack Engineering

Built a complete MERN stack product

Designed RESTful APIs

Followed MVC-like backend architecture

🔐 Authentication & Security

JWT-based authentication

Role-based authorization

Password hashing using bcrypt

Secure Razorpay signature verification

💳 Payments & Integrations

Razorpay payment gateway

Google Maps / Distance API for delivery logic

Cloud storage for listing images

🗄️ Database & Data Modeling

MongoDB + Mongoose

Schemas for:

Users

Listings

Offers

Orders

Payments

🎨 Frontend Development

React (hooks-based UI)

Axios for API communication

Bootstrap + Custom CSS

HTML2PDF for invoices

🧠 Engineering Practices

Clean REST API design

Modular backend structure

Environment-based configuration

API testing using Postman

Version control with Git & GitHub

Development productivity using Nodemon

🏗️ System Flow
Buyer  → Makes Offer / Counter  
Farmer → Accepts / Counters  
System → Creates Order  
Buyer  → Makes Payment  
Driver → Delivers Order

🧩 Tech Stack
Frontend

React

Bootstrap

CSS

Axios

Lucide Icons

HTML2PDF

Backend

Node.js

Express.js

JWT

Razorpay

Database

MongoDB

Mongoose

APIs & Services

Google Maps / Distance API

Cloudinary / Local Storage

Tools

Git

GitHub

Postman

VS Code

Nodemon

▶️ How to Execute This Project

(For anyone who opens your GitHub and sees two links: Frontend & Backend)

Since this system involves 3 roles — Farmer, Buyer, Driver — follow the steps below.
Frontend Repo: https://github.com/sudheeshna86/FarmerFrontend.git Backend Repo: https://github.com/sudheeshna86/FarmerBackend.git
1️⃣ Clone Both Repositories
git clone <frontend-repo-link>
git clone <backend-repo-link>

2️⃣ Run Backend First
cd backend
npm install
npm run dev

Create a .env file inside backend folder
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret


Backend will run at:
👉 http://localhost:5000

3️⃣ Run Frontend
cd frontend
npm install
npm start


Frontend will run at:
👉 http://localhost:3000

4️⃣ Testing with 3 Roles
👨‍🌾 Farmer

Register as Farmer

Add crop listings

Receive offers

Accept / counter offers

🛒 Buyer

Register as Buyer

Browse crops

Make offers

Complete payment using Razorpay

🚚 Driver

Register as Driver

View assigned deliveries

Update delivery status

5️⃣ Complete Flow Demo

Buyer selects a crop

Sends offer to farmer

Farmer accepts / counters

System auto-creates order

Buyer pays via Razorpay

Invoice generated (PDF)

Driver delivers order

Order marked completed

👩‍💻 Author

Sudheeshna
Full-Stack Developer (MERN)
GitHub: 👉 https://github.com/Sudheeshna28
