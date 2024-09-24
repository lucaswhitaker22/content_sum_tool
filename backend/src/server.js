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
const User = require('./models/User');

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
  .connect("mongodb+srv://maclucas:dN6b25Lndp9Vwlyc@cluster0.crdb5.mongodb.net/test2?retryWrites=true&w=majority&appName=Cluster0",
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
app.post("/api/lectures", async (req, res) => {
  // Check if the user is authenticated
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

    const newLecture = new Lecture(lectureData);
    const savedLecture = await newLecture.save();
    res.status(201).json(savedLecture);
  } catch (err) {
    console.error("Error saving lecture:", err);
    res.status(400).json({ message: err.message });
  }
});
app.post("/api/generate-lecture", async (req, res) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const pythonScriptPath = path.join(
    __dirname,
    "..",
    "..",
    "generator",
    "main.py"
  );

  const content = req.body;
  // Add the user ID to the content
  content.userId = req.user._id;

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

    try {
      // Parse the Python script output
      const lectureData = JSON.parse(stdout);
      // Add the user ID to the lecture data
      lectureData.userId = req.user._id;

      // Instead of saving, just return the generated data
      res.status(200).json(lectureData);
    } catch (err) {
      console.error("Error processing lecture data:", err);
      res.status(500).json({ message: "Error processing lecture data", error: err.message });
    }
  });
});

app.get("/api/lectures", async (req, res) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const lectures = await Lecture.find({ userId: req.user._id });
    res.json(lectures);
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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
