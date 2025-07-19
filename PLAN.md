**_______New Requirements____________________________________________**

build a prototype system that can do the following:
1: allow a user to scan a qr code and is directed to a landing page
2: that qr code belongs to a client 
3: the system can track how many users registered via a clients qr code

make a basic prototype to impress a potential customer and for now, lets use json localstorage  for basic integration
build using react

next build a customer page (landing page), this will be the default and a login page for admins
a user can get a link and be directed to the landing page (user only)
client admin dashboard


create a page that creates visual qr codes for each client and when a regular person scans that code they are directed to a page linked to that code. each page will contain the metadata of the qrcode scanned and each page should have a registration form that allows the user to register, that registration data will then be linked to the metadata of the qrcode for analytics to track how many registrations did a qrcode make



												*______how this will all work together_____*



1: upon initialization of the system the homepage will contain events we're hosting(dynamic single-page interfaces that can be made easily and integrate them as new routes), who we are (about page), what we do(services), how to contact us(contact) and registering to be a client (register)

2: when the user scans/clicks that url, they are taken to a page that belongs to that qrcode (note that multiple qrcodes can have the same page coz we are tracking clickrate of affiliates and they get commision based off that)
3: on that page, the user will then be pompted to go to the registration section in the page and register
4: upon successful registration the clients(affiliates) clickrate will increase by 1, the interface for the client will be updated as well as that of the admin, and the user will recieve a message saying registration successful
5: if the users registration status does not have a referal link(scanned by qr_code) they are automatically assigned that they registered to the admin since the default page will be that of the admin


*Architecture*:

i want a component based system architecture

*Tech Stack*
React
Tailwind
firebase AUTH (future)


													M.V.P
													
think of this in objects

*THE ACTORS INVOLVED*

1: Admin  --< ME        >--
2: Client --< referees  >--
3: user   --< customers >--
4: system --< System    >--

--< CLIENT >--
1: the focal point is that we need a QR CODE.. that code will be linked to a client so in other words, a client will be based and tracked via the code  
2: the client can change the link address (web page its directed to) after the event is done

--< USER >--
1: a customer will will be given that qrcode to scan and will be directed to the page where that qr link goes to 
2: Then they will be prompted to register on the page they are directed to (the registration component will be a form just above the footer to the page)

--< Admin >--
1: the admin can create a new client
2: the admin of the company can see the clickrate (how many users sign up using the clients referal link)
3: create a new single page or event (future)

--< System >--
1: to create an image for the qr code as well as the link
2: ensure that each qr code manages to work by properly navigating users to where they need to go
3: ensure proper registration (for now using json localstorage)
4: Ensure all routes aside from admin and client are public
5: make a new route for the page that the admin has made (future)




# QR Code Tracking and Analytics System

## 🧩 System Overview

A React-based prototype system for tracking QR code scans and user registrations, with dashboards for admin and clients.

QR codes are linked to specific clients (affiliates). When scanned, users are directed to a unique registration page, and their info is stored with QR metadata. The system will eventually use Firebase Auth, but currently uses `localStorage` for tracking and testing.

---

## ✅ Core Features (MVP)

### 🔐 Admin

* Admin login (local auth or mock auth)
* Admin dashboard:

  * Create and manage clients
  * Generate/display QR codes for each client
  * View registration statistics (per QR code/client)
  * Track performance (clicks, conversions)

### 🧑‍💼 Client

* QR code is assigned to client
* Registration statistics are tied to each client’s QR code
* *\[Future]* Client login/dashboard:

  * View linked registrations
  * Update their redirect/landing URLs

### 👥 User

* Scans QR code → redirected to `/register/:code`
* Registration form captures:

  * User details
  * QR code metadata (linked client info)
* Submissions stored in `localStorage`
* Admin is assigned as default owner if QR metadata is missing
* Confirmation or thank-you page after registration

### 🌐 Public Website

* Static public pages:

  * Home
  * About
  * Services
  * Contact

---

## 🏗️ Component-Based Architecture

```
src/
├── components/
│   ├── QRGenerator.jsx
│   ├── RegistrationForm.jsx
│   ├── Navbar.jsx
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Services.jsx
│   ├── AdminDashboard.jsx
│   ├── Login.jsx
│   └── RegisterPage.jsx   // dynamic route page
├── data/
│   └── localStorageUtils.js
├── App.jsx
├── main.jsx
└── routes.jsx
```

---

## 🗃️ Example `localStorage` Data Structure

```json
{
  "clients": [
    {
      "id": "client-123",
      "name": "AlphaPromo",
      "qrCode": "qr-123",
      "url": "/register/qr-123",
      "registrations": [
        {
          "name": "John Doe",
          "email": "john@example.com",
          "timestamp": "2025-07-18T12:00:00Z"
        }
      ]
    }
  ]
}
```

---

## 🛠 Development Tips

* Use `uuid` or nanoid to create unique client + QR IDs
* Generate QR codes dynamically using libraries like `qrcode.react`
* Handle dynamic route `/register/:qrId` using React Router
* Use reusable form and QR components
* Modularize all `localStorage` logic in `localStorageUtils.js`

---

## 🔜 Future Features

* Firebase Authentication for admin/client login
* Server-side backend for persistent storage and analytics
* Email notifications for registration events
* Exportable reports (CSV, PDF)
* Client self-service portal

---

## 🎯 Goal

To build a lightweight, component-based MVP for testing QR-driven registration workflows. Designed for easy future migration to Firebase and backend services.

