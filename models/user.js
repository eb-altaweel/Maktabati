const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    
  },
  email: {
    type: String,
    required: true,
    
  },
  password: {
    type: String,
    required: true
  },
   profileImage: {
    type: String,
    default: 'default-profile.jpg' // you can set a default image
  }

}, {
  timestamps:true //createdAt, updatedAt
})



const User = mongoose.model("User", userSchema)
module.exports = User