const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const multer = require("multer"); // Import multer

app.use(express.json({ limit: '10mb' }));

const cors = require("cors");
app.use(cors());
// Import the Lecture model
const Lecture = require("./models/lecture");
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp as filename
  }
});
const upload = multer({ storage });
mongoose
  .connect("mongodb+srv://maclucas:dN6b25Lndp9Vwlyc@cluster0.crdb5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Example route to create a new lecture
app.post("/api/lectures", async (req, res) => {
  try {
    const newLecture = new Lecture(req.body);
    const savedLecture = await newLecture.save();
    res.status(201).json(savedLecture);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.post("/api/generate-lecture", async (req, res) => {
  const pythonScriptPath = path.join(
    __dirname,
    "..",
    "..",
    "generator",
    "main.py"
  );
  const content = req.body;

  const contentJson = JSON.stringify(content);
  const escapedContentJson = contentJson.replace(/"/g, '\\"');
  const command = `python "${pythonScriptPath}" "${escapedContentJson}"`;

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      return res
        .status(500)
        .json({ message: "Error generating lecture", error: error.message });
    }

    res.status(201).send(stdout);
  });
});

// Example route to get all lectures
app.get("/api/lectures", async (req, res) => {
  try {
    const lectures = await Lecture.find();
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// New route to get a lecture by ID
app.get("/api/lectures/:id", async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }
    res.json(lecture);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/lectures/:id", async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndDelete(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }
    res.json({ message: "Lecture deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting lecture", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
