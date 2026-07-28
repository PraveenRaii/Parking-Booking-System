# 🚗 Parking Booking System

A modern **MERN Stack** based Parking Booking System that enables users to search nearby parking locations, reserve parking slots, make secure payments, and manage bookings through a user-friendly interface. The project also includes an AI Assistant to help users with parking-related queries.

---

# 📸 Project Preview

> **Home Page**
- Modern Landing Page
- Search Nearby Parking
- Parking Categories
- Featured Parking Spaces

> **User Features**
- Register/Login
- Find Parking
- Book Parking Slot
- Online Payment
- Booking History
- User Dashboard

> **Admin Features**
- Manage Parking Spaces
- Manage Users
- Manage Bookings
- Upload Parking Images
- Dashboard Analytics

---

# ✨ Features

## 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

## 🚗 Parking
- Search Nearby Parking
- Parking Details
- Available Slots
- Parking Categories
- Parking Images

## 📅 Booking
- Book Parking Slot
- Select Date & Time
- Vehicle Details
- Booking Confirmation

## 💳 Payment
- Secure Payment
- Booking Receipt
- Payment Success Page

## 👤 User Dashboard
- Profile Management
- My Bookings
- Booking Status

## 🛠 Admin Dashboard
- Add Parking
- Edit Parking
- Delete Parking
- View Bookings
- Manage Users

## 🤖 AI Assistant
- Parking Related Queries
- Booking Assistance
- Route Suggestions
- General Help

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- HTML5
- CSS3
- JavaScript (ES6)
- Axios
- React Router DOM

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication

- JWT
- bcryptjs

## File Upload

- Multer
- Cloudinary (Optional)

## APIs

- Google Maps API
- Gemini AI API

---

# 📂 Project Structure

```
Parking-Booking-System
│
├── client
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── context
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── README.md
└── LICENSE
```

---

# ⚙ Installation

## 1. Clone Repository

```bash
git clone https://github.com/praveenraii/Parking-Booking-System.git
```

---

## 2. Navigate into Project

```bash
cd Parking-Booking-System
```

---

## 3. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 4. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# 🔑 Environment Variables

Create a **.env** file inside the **server** folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GOOGLE_MAPS_API_KEY=your_google_maps_api_key

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_NAME=your_cloudinary_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_SECRET=your_cloudinary_secret
```

---

# ▶ Running the Project

## Backend

```bash
cd server
npm run dev
```

Server runs on

```
http://localhost:5000
```

---

## Frontend

```bash
cd client
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🔗 API Routes

## Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile
```

---

## Parking

```
GET /api/parking

GET /api/parking/:id

POST /api/parking

PUT /api/parking/:id

DELETE /api/parking/:id
```

---

## Booking

```
POST /api/booking

GET /api/booking

PUT /api/booking/:id

DELETE /api/booking/:id
```

---

## User

```
GET /api/users

PUT /api/users/:id

DELETE /api/users/:id
```

---

## Dashboard

```
GET /api/dashboard
```

---

## Upload

```
POST /api/upload
```

---

## AI Assistant

```
POST /api/ai/chat
```

---

# 📷 Screenshots

## Home Page

```
Add Screenshot Here
```

---

## Login Page

```
Add Screenshot Here
```

---

## Parking Page

```
Add Screenshot Here
```

---

## Booking Page

```
Add Screenshot Here
```

---

## Dashboard

```
Add Screenshot Here
```

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Environment Variables
- Input Validation
- Error Handling

---

# 🚀 Future Improvements

- Live Parking Availability
- QR Code Entry
- Email Verification
- OTP Login
- Google Login
- Razorpay Integration
- Stripe Payment
- Real-Time Slot Tracking
- Push Notifications
- Admin Analytics
- Booking Cancellation
- Booking History Export

---

# 📦 Deployment

## Frontend

- Vercel
- Netlify

## Backend

- Render
- Railway

## Database

- MongoDB Atlas

---

# 🤝 Contributing

1. Fork the repository.

2. Create a new branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Added new feature"
```

4. Push the branch.

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

# 👨‍💻 Author

## Praveen Rai

**B.Tech Computer Science Engineering**

### Skills

- Java
- JavaScript
- React.js
- Node.js
- Express.js
- MongoDB
- HTML
- CSS
- Tailwind CSS
- Git & GitHub

GitHub:
https://github.com/PraveenRaii

LinkedIn:
https://www.linkedin.com/in/praveen-rai-9r13

---

# ⭐ Support

If you like this project, please give it a ⭐ on GitHub.

---

# 📄 License

This project is licensed under the MIT License.

---

## ❤️ Thank You

Thank you for visiting this repository.
Happy Coding! 🚀
