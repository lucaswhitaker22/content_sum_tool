const express = require('express');
const router = express.Router();
const Lecture = require('../models/lecture');
const Course = require('../models/course');
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const authenticateToken = require('../middleware/auth');

// Apply authenticateToken middleware to all routes
router.use(authenticateToken);

// Create a new lecture
router.post("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  try {
    const lectureData = req.body;
    lectureData.userId = req.user.id;

    if (!lectureData.metadata || !lectureData.metadata.title || !lectureData.metadata.course) {
      return res.status(400).json({ message: "Invalid lecture data. Title and course are required." });
    }

    const course = await Course.findOne({ _id: lectureData.metadata.course, userId: req.user.id });
    if (!course) {
      return res.status(404).json({ message: "Course not found or not owned by user" });
    }

    const newLecture = new Lecture(lectureData);
    const savedLecture = await newLecture.save();
    res.status(201).json(savedLecture);
  } catch (err) {
    console.error("Error saving lecture:", err);
    res.status(400).json({ message: err.message });
  }
});

// Get all lectures for the authenticated user
router.get("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  try {
    const lectures = await Lecture.find({ userId: req.user.id }).populate('metadata.course');
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific lecture by ID
router.get("/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  try {
    const lecture = await Lecture.findOne({ _id: req.params.id, userId: req.user.id }).populate('metadata.course');
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found or not owned by user" });
    }
    res.json(lecture);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a lecture
router.delete("/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const lecture = await Lecture.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found or not owned by user" });
    }
    res.json({ message: "Lecture deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting lecture", error: error.message });
  }
});

// Update the lecture generation route
router.post("/generate", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    console.log("Received request body:", req.body);
  
    const pythonScriptPath = path.join(__dirname, "..","..", "..", "generator", "main.py");
    console.log("Python script path:", pythonScriptPath);
  
    if (!fs.existsSync(pythonScriptPath)) {
      return res.status(500).json({ message: "Python script not found" });
    }
  
    const content = req.body;
    content.userId = req.user.id;
  
    // Validate input data
    if (!content.metadata || !content.metadata.course || !content.metadata.title || !content.metadata.path) {
      return res.status(400).json({ message: "Invalid input data" });
    }
  
    // The content.metadata.path should now be the full URL to the PDF file
    const pdfUrl = content.metadata.path;
  
    const contentJson = JSON.stringify(content);
    const escapedContentJson = contentJson.replace(/"/g, '\\"');
    const command = `python "${pythonScriptPath}" "${escapedContentJson}"`;
    console.log("Executing command:", command);
  
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        console.error(`Python script stderr: ${stderr}`);
        return res.status(500).json({
          message: "Error generating lecture",
          error: error.message,
          stderr: stderr
        });
      }
  
      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
      }
  
      console.log("Python script stdout:", stdout);
  
      try {
        const lectureData = JSON.parse(stdout);
        lectureData.userId = req.user.id;
        
        // The PDF URL is already in the correct format, so we don't need to modify it
        lectureData.metadata.path = pdfUrl;
        
        res.status(200).json(lectureData);
      } catch (err) {
        console.error("Error processing lecture data:", err);
        res.status(500).json({
          message: "Error processing lecture data",
          error: err.message,
          stdout: stdout
        });
      }
    });
  });

module.exports = router;