const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const verifyAdmin = require('../middleware/auth');
const { upload, uploadToImageKit } = require('../middleware/upload');

// GET /api/problems/:modelId — public
router.get('/:modelId', async (req, res) => {
  try {
    const problems = await Problem.find({ modelId: req.params.modelId }).sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch problems', error: error.message });
  }
});

// POST /api/problems — admin only
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, desc, modelId } = req.body;
    if (!title || !desc || !modelId || !req.file) {
      return res.status(400).json({ message: 'title, desc, modelId and image are required.' });
    }

    const imageUrl = await uploadToImageKit(req.file.buffer, req.file.originalname, 'problems');

    const problem = new Problem({ title, desc, image: imageUrl, modelId });
    await problem.save();

    res.status(201).json({ message: 'Problem created successfully', problem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create problem', error: error.message });
  }
});

// DELETE /api/problems/:id — admin only
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Problem deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete problem', error: error.message });
  }
});

module.exports = router;
