const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection String
const dbURI = 'mongodb+srv://en24cs3010040_db_user:J44NZXLrhuZu2Vk8@cluster0.kh43jmd.mongodb.net/hotelpro?retryWrites=true&w=majority';

mongoose.connect(dbURI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.log('❌ DB Error:', err));

// Schemas
const roomSchema = new mongoose.Schema({
  roomNumber: String,
  type: String,
  price: Number,
  isBooked: Boolean
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Room = mongoose.model('Room', roomSchema);
const User = mongoose.model('User', userSchema);

// 1. Get Rooms Route
app.get('/api/rooms', async (req, res) => {
  try {
    let rooms = await Room.find();
    if (rooms.length === 0) {
      rooms = await Room.insertMany([
        { roomNumber: '101', type: 'Deluxe Suite', price: 3500, isBooked: false },
        { roomNumber: '102', type: 'Executive Double', price: 2200, isBooked: false },
        { roomNumber: '103', type: 'Standard Single', price: 1200, isBooked: true },
        { roomNumber: '104', type: 'Presidential Suite', price: 7500, isBooked: false }
      ]);
    }
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Book Room Route
app.put('/api/rooms/book/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, { isBooked: true }, { new: true });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. User Register Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

// 4. User Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ token: 'sample-jwt-token-hotelpro', email: user.email });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));