const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    libraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Library',
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
