const express = require('express');
const router = express.Router();
const CarModel = require('../models/CarModel');
const verifyAdmin = require('../middleware/auth');
const { upload, uploadToImageKit } = require('../middleware/upload');

// GET /api/models/:brandId — public, get all models for a brand
router.get('/:brandId', async (req, res) => {
  try {
    const models = await CarModel.find({ brandId: req.params.brandId }).sort({ createdAt: -1 });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch models', error: error.message });
  }
});

// POST /api/models — admin only, add a model to a brand
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, brandId } = req.body;
    if (!name || !brandId || !req.file) {
      return res.status(400).json({ message: 'Name, brandId and image are required.' });
    }

    const imageUrl = await uploadToImageKit(req.file.buffer, req.file.originalname, 'models');

    const carModel = new CarModel({ name, image: imageUrl, brandId });
    await carModel.save();

    res.status(201).json({ message: 'Model created successfully', model: carModel });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create model', error: error.message });
  }
});

// DELETE /api/models/:id — admin only
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await CarModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Model deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete model', error: error.message });
  }
});

module.exports = router;
