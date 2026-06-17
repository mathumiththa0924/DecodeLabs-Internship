# 🗄️ Project 3 — Database Integration

**DecodeLabs Internship 2026 | Full Stack Development Track**

---

## 📌 Project Overview

Extended the Brewed & Co. backend API to connect with **MongoDB** using **Mongoose ODM**. Data is now permanently stored in a database with full CRUD operations, schema validation, and proper error handling.

---

## 🎯 Goal

Connect the backend with a database to store and retrieve data permanently — moving from in-memory arrays to real persistent storage.

---

## ✅ Key Requirements Met

- ✅ **Database schema** designed with Mongoose
- ✅ **Full CRUD operations** — Create, Read, Update, Delete
- ✅ **Proper data handling** — validation, error catching, status codes
- ✅ MongoDB ObjectId validation before queries
- ✅ Mongoose schema-level validation (required, enum, min)
- ✅ Auto seed data on first run
- ✅ Timestamps on every record (`createdAt`, `updatedAt`)

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM (Object Document Mapper) |

---

## 📁 Project Structure

```
Project-3/
│
├── server_db.js    # Main API with MongoDB connection
├── package.json    # Dependencies
└── README.md       # Documentation
```

---

## 🧩 Database Schema

```javascript
const menuSchema = new mongoose.Schema({
  name      : { type: String,  required: true },
  category  : { type: String,  enum: ['coffee','drinks','food'] },
  price     : { type: Number,  min: 0.01 },
  available : { type: Boolean, default: true }
}, { timestamps: true });
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all items |
| GET | `/api/menu?category=coffee` | Filter by category |
| GET | `/api/menu/:id` | Get single item |
| POST | `/api/menu` | Add new item (saved to DB) |
| PUT | `/api/menu/:id` | Update item in DB |
| DELETE | `/api/menu/:id` | Delete from DB |

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Make sure MongoDB is running locally
# OR use MongoDB Atlas free cluster

# 3. Start the server
node server_db.js

# Server: http://localhost:3001
```

### Using MongoDB Atlas (Cloud):
```bash
# Set your connection string
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/brewedco node server_db.js
```

---

## 📥 POST Request Example

```json
{
  "name": "Iced Caramel Latte",
  "category": "coffee",
  "price": 5.50
}
```

## 📤 Response Example

```json
{
  "success": true,
  "message": "Menu item created successfully",
  "data": {
    "_id": "64abc123...",
    "name": "Iced Caramel Latte",
    "category": "coffee",
    "price": 5.50,
    "available": true,
    "createdAt": "2026-06-17T10:00:00.000Z"
  }
}
```

---

## 🔒 Data Integrity Features

| Feature | How |
|---------|-----|
| Required fields | Mongoose `required: true` |
| Valid categories | Mongoose `enum` constraint |
| Positive price | Mongoose `min: 0.01` |
| Unique IDs | MongoDB `ObjectId` |
| SQL Injection safe | Mongoose parameterized queries |

---

## 👩‍💻 Developer

**Mathumiththa** — Full Stack Development Intern
DecodeLabs Internship Batch 2026

---

## 🔗 Related Projects

- [Project 1 — Responsive Frontend](../Project-1/)
- [Project 2 — Backend API](../Project-2/)
