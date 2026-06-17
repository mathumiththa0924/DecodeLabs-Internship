const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// CORS Headers — allow frontend to connect
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ── IN-MEMORY DATA (No database yet — that's Project 3!) ──
let menuItems = [
  { id: 1, name: 'Classic Espresso',   category: 'coffee',   price: 3.50, available: true },
  { id: 2, name: 'Vanilla Cloud Latte',category: 'coffee',   price: 5.00, available: true },
  { id: 3, name: 'Brown Sugar Boba',   category: 'drinks',   price: 5.90, available: true },
  { id: 4, name: 'Matcha Bloom',       category: 'drinks',   price: 5.50, available: true },
  { id: 5, name: 'Butter Croissant',   category: 'food',     price: 4.20, available: true },
];

let nextId = 6;

// ── ROUTES ──

// GET / — Welcome message
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Brewed & Co. API ☕',
    version: '1.0.0',
    endpoints: {
      'GET  /api/menu'         : 'Get all menu items',
      'GET  /api/menu/:id'     : 'Get single item by ID',
      'POST /api/menu'         : 'Add new menu item',
      'PUT  /api/menu/:id'     : 'Update an item',
      'DELETE /api/menu/:id'   : 'Delete an item',
    }
  });
});

// GET /api/menu — Get all menu items
app.get('/api/menu', (req, res) => {
  const { category } = req.query;

  // Optional filter by category
  let result = menuItems;
  if (category) {
    result = menuItems.filter(item =>
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
});

// GET /api/menu/:id — Get single menu item
app.get('/api/menu/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = menuItems.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: `Menu item with ID ${id} not found`
    });
  }

  res.status(200).json({
    success: true,
    data: item
  });
});

// POST /api/menu — Add new menu item
app.post('/api/menu', (req, res) => {
  const { name, category, price, available } = req.body;

  // ── Basic Validation ──
  if (!name || !category || !price) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, category, and price'
    });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be a positive number'
    });
  }

  const validCategories = ['coffee', 'drinks', 'food'];
  if (!validCategories.includes(category.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Category must be one of: ${validCategories.join(', ')}`
    });
  }

  const newItem = {
    id       : nextId++,
    name     : name.trim(),
    category : category.toLowerCase(),
    price    : parseFloat(price.toFixed(2)),
    available: available !== undefined ? available : true
  };

  menuItems.push(newItem);

  res.status(201).json({
    success: true,
    message: 'Menu item added successfully',
    data   : newItem
  });
});

// PUT /api/menu/:id — Update a menu item
app.put('/api/menu/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = menuItems.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Menu item with ID ${id} not found`
    });
  }

  const { name, category, price, available } = req.body;

  // Update only provided fields
  if (name)      menuItems[index].name      = name.trim();
  if (category)  menuItems[index].category  = category.toLowerCase();
  if (price)     menuItems[index].price     = parseFloat(price.toFixed(2));
  if (available !== undefined) menuItems[index].available = available;

  res.status(200).json({
    success: true,
    message: 'Menu item updated successfully',
    data   : menuItems[index]
  });
});

// DELETE /api/menu/:id — Delete a menu item
app.delete('/api/menu/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = menuItems.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Menu item with ID ${id} not found`
    });
  }

  const deleted = menuItems.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: 'Menu item deleted successfully',
    data   : deleted
  });
});

// 404 Handler — Unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`☕ Brewed & Co. API running at http://localhost:${PORT}`);
});

