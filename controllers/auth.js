const express = require('express')
const router = express.Router()
const validator = require('validator')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const upload = require('../config/multer')

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs')
})

router.post('/sign-up', upload, async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body

    const userInDatabase = await User.findOne({ username })
    if (userInDatabase) {
      return res.send('Username already taken')
    }

    if (!validator.isEmail(email)) {
      return res.send('Invalid email format')
    }

    if (password.length < 8) {
      return res.send('Password is weak')
    }

    if (password !== confirmPassword) {
      return res.send('Passwords must match')
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    const userData = {
      username,
      email,
      password: hashedPassword
    }

    if (req.file) {
      userData.profileImage = req.file.filename
    }

    const user = await User.create(userData)

    req.session.user = {
      username: user.username,
      _id: user._id,
      profileImage: user.profileImage
    }

    console.log('Uploaded file:', req.file)
    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.send('Error during registration')
  }
})

router.get('/sign-in', async (req, res) => {
  res.render('auth/sign-in.ejs')
})

router.post('/sign-in', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (!userInDatabase) {
      return res.send('Login failed. Please try again later.')
    }

    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    )
    if (!validPassword) {
      return res.send('Login failed. Please try again later.')
    }

    req.session.user = {
      username: userInDatabase.username,
      profileImage: userInDatabase.profileImage,
      _id: userInDatabase._id
    }

    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

router.get('/profile', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/sign-in')
  res.render('auth/profile.ejs', { user: req.session.user })
})

router.post('/profile', upload, async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/sign-in')

  try {
    if (req.file) {
      const updatedUser = await User.findByIdAndUpdate(
        req.session.user._id,
        { profileImage: req.file.filename },
        { new: true }
      )

      // Update session data too
      req.session.user.profileImage = updatedUser.profileImage
    }

    res.redirect('/auth/profile')
  } catch (err) {
    console.error(err)
    res.send('Error updating profile image')
  }
})

router.get('/sign-out', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router
