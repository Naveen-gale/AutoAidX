const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const verifyAdmin = require('../middleware/auth');
const { upload, uploadToImageKit } = require('../middleware/upload');

// GET /api/brands — public, get all brands
router.get('/', async (_req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch brands', error: error.message });
  }
});

// POST /api/brands — admin only, add a new brand with logo
router.post('/', verifyAdmin, upload.single('logo'), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ message: 'Brand name and logo are required.' });
    }

    const logoUrl = await uploadToImageKit(req.file.buffer, req.file.originalname, 'brands');

    const brand = new Brand({ name, logo: logoUrl });
    await brand.save();

    res.status(201).json({ message: 'Brand created successfully', brand });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create brand', error: error.message });
  }
});

// DELETE /api/brands/:id — admin only
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: 'Brand deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete brand', error: error.message });
  }
});

module.exports = router;
