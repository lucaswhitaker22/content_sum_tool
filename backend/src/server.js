const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const cors = require('cors');
app.use(cors());
// Import the Lecture model
const Lecture = require('./models/lecture');

mongoose.connect("mongodb+srv://lucaswhitaker22:9BNvFOh7ygnKc5Cl@cluster0.4qg7x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Example route to create a new lecture
app.post('/api/lectures', async (req, res) => {
  try {
    const newLecture = new Lecture(req.body);
    const savedLecture = await newLecture.save();
    res.status(201).json(savedLecture);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Example route to get all lectures
app.get('/api/lectures', async (req, res) => {
  try {
    const lectures = await Lecture.find();
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// New route to get a lecture by ID
app.get('/api/lectures/:id', async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.json(lecture);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/lectures/:id', async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndDelete(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lecture', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});