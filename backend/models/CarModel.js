const mongoose = require('mongoose');

const carModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // ImageKit URL
    required: true,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('CarModel', carModelSchema);
