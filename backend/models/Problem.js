const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  desc: {
    type: String,
    required: true,
  },
  image: {
    type: String, // ImageKit URL
    required: true,
  },
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarModel',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
