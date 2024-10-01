const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const multer = require("multer"); // Import multer
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const User = require('./models/user');
const Course = require('./models/course');
const crypto = require('crypto');

app.use(express.json({ limit: '10mb' }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const cors = require("cors");
app.use(cors({
  origin: 'http://localhost:3002',
  credentials: true
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
async function(accessToken, refreshToken, profile, cb) {
  try {
    // Check if user already exists in our database
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value
      });
      await user.save();
    }
    
    return cb(null, user);
  } catch (err) {
    return cb(err, null);
  }
}
));

passport.serializeUser((user, done) => {
done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
try {
  const user = await User.findById(id);
  done(null, user);
} catch (err) {
  done(err, null);
}
});



// Set up the uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer to store files in the uploads directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });
const fileStore = new Map();
app.post('/api/upload-pdf', upload.single('pdf'), (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const fileId = crypto.randomBytes(16).toString('hex');
  const fileInfo = {
    path: req.file.path,
    originalName: req.file.originalname,
    //expiry: Date.now() + 900000 // 1 hour from now
    expiry: null
  };

  fileStore.set(fileId, fileInfo);

  const fileUrl = `http://localhost:${PORT}/api/uploads/${req.file.filename}`;
  res.json({ fileUrl, fileId });
});

app.use('/api/uploads', express.static(uploadsDir));

// Cleanup function
function cleanupExpiredFiles() {
  const now = Date.now();
  for (const [fileId, fileInfo] of fileStore.entries()) {
    if (now > fileInfo.expiry) {
      fs.unlink(fileInfo.path, (err) => {
        if (err) {
          console.error(`Error deleting file ${fileId}: ${err}`);
        } else {
          console.log(`Successfully deleted expired file ${fileId}`);
          fileStore.delete(fileId);
        }
      });
    }
  }
  console.log(`Cleanup completed. Remaining files: ${fileStore.size}`);
}

// Import the Lecture model
const Lecture = require("./models/lecture");
// Configure multer for file uploads
const db_name = "fall2024"
mongoose
  .connect("mongodb+srv://maclucas:dN6b25Lndp9Vwlyc@cluster0.crdb5.mongodb.net/"+db_name+"?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  
  // Google Auth routes
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
  
  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('http://localhost:3002/');
    });
    app.get('/api/user', (req, res) => {
      if (req.user) {
        res.json({ user: req.user });
      } else {
        res.status(401).json({ message: 'Not authenticated' });
      }
    });
    app.get('/api/logout', (req, res) => {
      req.logout(function(err) {
        if (err) { return next(err); }
        res.json({ success: true });
      });
    });
// Example route to create a new lecture
// Create a new lecture
app.post("/api/lectures", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  try {
    const lectureData = req.body;
    lectureData.userId = req.user._id;

    // Validate the lecture data
    if (!lectureData.metadata || !lectureData.metadata.title || !lectureData.metadata.course) {
      return res.status(400).json({ message: "Invalid lecture data. Title and course are required." });
    }

    // Check if the course exists and belongs to the user
    const course = await Course.findOne({ _id: lectureData.metadata.course, userId: req.user._id });
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
// Update the lecture generation route
app.post("/api/generate-lecture", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  console.log("Received request body:", req.body);

  const pythonScriptPath = path.join(__dirname, "..", "..", "generator", "main.py");
  console.log("Python script path:", pythonScriptPath);

  if (!fs.existsSync(pythonScriptPath)) {
    return res.status(500).json({ message: "Python script not found" });
  }

  const content = req.body;
  content.userId = req.user._id;

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
      lectureData.userId = req.user._id;
      
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
// Get all lectures for the authenticated user
app.get("/api/lectures", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  try {
    const lectures = await Lecture.find({ userId: req.user._id }).populate('metadata.course');
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific lecture by ID
app.get("/api/lectures/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  try {
    const lecture = await Lecture.findOne({ _id: req.params.id, userId: req.user._id }).populate('metadata.course');
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found or not owned by user" });
    }
    res.json(lecture);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update the /api/lectures/:id GET route to check for user ownership
app.get("/api/lectures/:id", async (req, res) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const lecture = await Lecture.findOne({ _id: req.params.id, userId: req.user._id });
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found or not owned by user" });
    }
    res.json(lecture);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/lectures/:id", async (req, res) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const lecture = await Lecture.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
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

// Create a new course
app.post("/api/courses", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const courseData = req.body;
    courseData.userId = req.user._id;

    // Validate schedule data
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
app.put("/api/courses/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  try {
    const courseData = req.body;
    
    // Validate grading scheme if it's being updated
    if (courseData.gradingScheme && courseData.gradingScheme.length > 0) {
      const totalWeight = courseData.gradingScheme.reduce((sum, item) => sum + item.weight, 0);
      if (Math.abs(totalWeight - 100) > 0.01) {
        return res.status(400).json({ message: "Grading scheme weights must sum to 100%" });
      }
    }

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
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
app.get("/api/courses", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const courses = await Course.find({ userId: req.user._id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific course by ID
app.get("/api/courses/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const course = await Course.findOne({ _id: req.params.id, userId: req.user._id });
    if (!course) {
      return res.status(404).json({ message: "Course not found or not owned by user" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// Delete a course
app.delete("/api/courses/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!course) {
      return res.status(404).json({ message: "Course not found or not owned by user" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
});

app.post("/api/courses/:id/schedule", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const course = await Course.findOne({ _id: req.params.id, userId: req.user._id });
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

app.put("/api/courses/:courseId/schedule/:scheduleId", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const course = await Course.findOne({ _id: req.params.courseId, userId: req.user._id });
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
app.delete("/api/courses/:courseId/schedule/:scheduleId", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const course = await Course.findOne({ _id: req.params.courseId, userId: req.user._id });
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


app.listen(PORT, () => {
  // Run cleanup every 15 minutes
  setInterval(cleanupExpiredFiles, 900000);
  console.log(`Server is running on port ${PORT}`);
});
