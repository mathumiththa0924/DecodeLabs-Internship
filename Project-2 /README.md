# 🔌 Project 2 — Backend API Development

**DecodeLabs Internship 2026 | Full Stack Development Track**

---

## 📌 Project Overview

A RESTful backend API for **Brewed & Co.** café built with Node.js and Express. Supports full CRUD operations on menu items with data validation and proper HTTP status codes.

---

## 🎯 Goal

Develop a simple backend API to handle application logic — bridging the gap between frontend and data storage.

---

## ✅ Key Requirements Met

- ✅ **GET and POST** endpoints created
- ✅ **User input handled** with proper validation
- ✅ **Basic data validation** on all inputs
- ✅ RESTful naming conventions (`/api/menu` not `/getMenu`)
- ✅ Proper **HTTP status codes** (200, 201, 400, 404)
- ✅ **CORS** headers configured for frontend connection
- ✅ Full **CRUD** — Create, Read, Update, Delete

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| REST API | Architecture style |

---

## 📁 Project Structure

```
Project-2/
│
├── server.js       # Main API server
├── package.json    # Project dependencies
└── README.md       # Documentation
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message + endpoint list |
| GET | `/api/menu` | Get all menu items |
| GET | `/api/menu?category=coffee` | Filter by category |
| GET | `/api/menu/:id` | Get single item |
| POST | `/api/menu` | Add new item |
| PUT | `/api/menu/:id` | Update item |
| DELETE | `/api/menu/:id` | Delete item |

---

## 📥 POST Request Body Example

```json
{
  "name": "Iced Caramel Latte",
  "category": "coffee",
  "price": 5.50,
  "available": true
}
```

---

## 📤 Sample Response

```json
{
  "success": true,
  "message": "Menu item added successfully",
  "data": {
    "id": 6,
    "name": "Iced Caramel Latte",
    "category": "coffee",
    "price": 5.50,
    "available": true
  }
}
```

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start the server
node server.js

# Server runs at: http://localhost:3000
```

---

## 👩‍💻 Developer

**Mathumiththa** — Full Stack Development Intern
DecodeLabs Internship Batch 2026

---

## 🔗 Related Projects

- [Project 1 — Responsive Frontend](../Project-1/)
- [Project 3 — Database Integration](../Project-3/)

