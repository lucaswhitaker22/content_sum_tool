const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.redirect(`http://localhost:3002/auth-success?token=${token}`);
  });

router.get('/api/user', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.get('/api/logout', (req, res) => {
  // With JWT, logout is typically handled on the client side by removing the token
  res.json({ success: true, message: 'Logout successful' });
});

module.exports = router;