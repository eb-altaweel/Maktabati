const mongoose = require('mongoose')
const librarySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    hasSeating: {
      type: Boolean,
      default: false
    },

    openTime: {
      type: Date,
      required: true
    },

    description: {
      type: String,
      trim: true
    },

    hasSeating: {
      type: Boolean,
      default: false
    },

    hasStudyRoom: {
      type: Boolean,
      default: false
    },

    openTime: {
      type: String,
      required: true
    },

    closeTime: {
      type: String,
      required: true
    },

    image: {
      type: [String],
      default: 'default-library.jpg'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    favouriteByUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Library', librarySchema)
