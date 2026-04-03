const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, message: 'Login successful' });
});

module.exports = router;
