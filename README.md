# QR-Code Prototype

A React prototype for QR code–based user registration and analytics. Originally using localStorage (JSON) — now enhanced to support Firebase database integration.

## ⚙️ Features

- 🔹 **Client QR Codes**: Each client has a unique QR code link
- 🔹 **Registration Flow**: User visits `/register/:qrCode`, fills a form
- 🔹 **Admin Dashboard**: View all clients, QR codes, and registrations
- 🔹 **Client Dashboard**: Each client views own stats in real-time
- 🔹 **Firebase-ready**: Easy migration from localStorage to Firestore

## 🧰 Tech Stack

- React (Vite)
- React Router v6
- TailwindCSS
- Firebase (Firestore + Auth integration optional)
- Lucide Icons

## ✅ Setup & Run

1. Clone repo:

   ```bash
   git clone https://github.com/SuwilanjiTrey/qr-prototype.git
   cd qr-prototype
