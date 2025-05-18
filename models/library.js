const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  amenities: { type: [String] },
  seatingAvailability: {
    type: String,
    enum: ['Limited', 'Moderate', 'Spacious'],
    default: 'Moderate'
  },
  operatingHours: { type: String, required: true },
  image: { type: String, default: 'default-library.jpg' },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});