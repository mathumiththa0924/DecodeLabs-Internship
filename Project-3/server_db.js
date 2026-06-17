const express = require('express');
const mongoose = require('mongoose');

const app = express();

// ── MIDDLEWARE ──
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ── MONGODB CONNECTION ──
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/brewedco';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ── SCHEMA & MODEL ──
const menuSchema = new mongoose.Schema(
  {
    name      : { type: String,  required: [true, 'Name is required'],     trim: true },
    category  : {
      type    : String,
      required: [true, 'Category is required'],
      enum    : {
        values : ['coffee', 'drinks', 'food'],
        message: 'Category must be coffee, drinks, or food'
      },
      lowercase: true
    },
    price     : {
      type    : Number,
      required: [true, 'Price is required'],
      min     : [0.01, 'Price must be greater than 0']
    },
    available : { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuSchema);

// ── SEED DATA (runs once if DB is empty) ──
const seedData = async () => {
  const count = await MenuItem.countDocuments();
  if (count === 0) {
    await MenuItem.insertMany([
      { name: 'Classic Espresso',    category: 'coffee', price: 3.50 },
      { name: 'Vanilla Cloud Latte', category: 'coffee', price: 5.00 },
      { name: 'Brown Sugar Boba',    category: 'drinks', price: 5.90 },
      { name: 'Matcha Bloom',        category: 'drinks', price: 5.50 },
      { name: 'Butter Croissant',    category: 'food',   price: 4.20 },
    ]);
    console.log('🌱 Sample menu items seeded to database');
  }
};

mongoose.connection.once('open', seedData);

// ── ROUTES ──

// GET / — Welcome
app.get('/', (req, res) => {
  res.status(200).json({
    message  : 'Welcome to Brewed & Co. API with MongoDB ☕',
    version  : '2.0.0',
    database : 'MongoDB (Mongoose)',
    endpoints: {
      'GET    /api/menu'        : 'Get all menu items',
      'GET    /api/menu/:id'    : 'Get single item by ID',
      'POST   /api/menu'        : 'Add new menu item',
      'PUT    /api/menu/:id'    : 'Update an item',
      'DELETE /api/menu/:id'    : 'Delete an item',
    }
  });
});

// GET /api/menu — Get all items (optional ?category filter)
app.get('/api/menu', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category.toLowerCase();
    }

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count  : items.length,
      data   : items
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// GET /api/menu/:id — Get single item
app.get('/api/menu/:id', async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST /api/menu — Create new item
app.post('/api/menu', async (req, res) => {
  try {
    const { name, category, price, available } = req.body;

    // Manual check before hitting Mongoose validation
    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, category, and price'
      });
    }

    const newItem = await MenuItem.create({ name, category, price, available });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data   : newItem
    });
  } catch (err) {
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// PUT /api/menu/:id — Update item
app.put('/api/menu/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data   : updated
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// DELETE /api/menu/:id — Delete item
app.delete('/api/menu/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const deleted = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
      data   : deleted
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── START SERVER ──
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`☕ Brewed & Co. DB API running at http://localhost:${PORT}`);
});

