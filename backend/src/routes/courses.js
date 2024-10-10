const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const authenticateToken = require('../middleware/auth');

// Apply authenticateToken middleware to all routes
router.use(authenticateToken);

// Create a new course
router.post("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const courseData = req.body;
    courseData.userId = req.user.id;

    if (courseData.schedule && Array.isArray(courseData.schedule)) {
      courseData.schedule = courseData.schedule.map(item => ({
        ...item,
        dayOfWeek: item.dayOfWeek.split(',').filter(day => day.trim() !== '').join(',')
      }));
    }

    console.log("Received course data:", courseData);
    const newCourse = new Course(courseData);
    const savedCourse = await newCourse.save();
    console.log("Saved course:", savedCourse);
    res.status(201).json(savedCourse);
  } catch (err) {
    console.error("Error saving course:", err);
    res.status(400).json({ message: err.message, stack: err.stack });
  }
});

// Update a course
router.put("/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  try {
    const courseData = req.body;
    
    if (courseData.gradingScheme && courseData.gradingScheme.length > 0) {
      const totalWeight = courseData.gradingScheme.reduce((sum, item) => sum + item.weight, 0);
      if (Math.abs(totalWeight - 100) > 0.01) {
        return res.status(400).json({ message: "Grading scheme weights must sum to 100%" });
      }
    }

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      courseData,
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found or not owned by user" });
    }
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all courses for the authenticated user
router.get("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const courses = await Course.find({ userId: req.user.id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific course by ID
router.get("/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const course = await Course.findOne({ _id: req.params.id, userId: req.user.id });
    if (!course) {
      return res.status(404).json({ message: "Course not found or not owned by user" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a course
router.delete("/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!course) {
      return res.status(404).json({ message: "Course not found or not owned by user" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
});

// Add schedule item to a course
router.post("/:id/schedule", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const course = await Course.findOne({ _id: req.params.id, userId: req.user.id });
    if (!course) {
      return res.status(404).json({ message: "Course not found or not owned by user" });
    }

    const scheduleItem = req.body;
    // Validate that startTime and endTime are present
    if (!scheduleItem.startTime || !scheduleItem.endTime) {
      return res.status(400).json({ message: "Start time and end time are required" });
    }
    course.schedule.push(scheduleItem);
    const updatedCourse = await course.save();
    res.status(201).json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update schedule item
router.put("/:courseId/schedule/:scheduleId", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const course = await Course.findOne({ _id: req.params.courseId, userId: req.user.id });
    if (!course) {
      return res.status(404).json({ message: "Course not found or not owned by user" });
    }

    const scheduleItem = course.schedule.id(req.params.scheduleId);
    if (!scheduleItem) {
      return res.status(404).json({ message: "Schedule item not found" });
    }

    // Validate that startTime and endTime are present in the request body
    if (!req.body.startTime || !req.body.endTime) {
      return res.status(400).json({ message: "Start time and end time are required" });
    }

    Object.assign(scheduleItem, req.body);
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.delete("/:courseId/schedule/:scheduleId", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const course = await Course.findOne({ _id: req.params.courseId, userId: req.user.id });
    if (!course) {
      return res.status(404).json({ message: "Course not found or not owned by user" });
    }

    course.schedule.id(req.params.scheduleId).remove();
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Delete schedule item
router.delete("/:courseId/schedule/:scheduleId", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const course = await Course.findOne({ _id: req.params.courseId, userId: req.user.id });
    if (!course) {
      return res.status(404).json({ message: "Course not found or not owned by user" });
    }

    course.schedule.id(req.params.scheduleId).remove();
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;