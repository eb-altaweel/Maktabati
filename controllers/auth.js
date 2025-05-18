const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const upload = require('../config/multer')

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs')
})

router.post('/sign-up', upload, async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userInDatabase) {
      return res.send('Username already taken')
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Passwords must match')
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    const userData = {
      username: req.body.username,
      email: req.body.email,
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

router.get('/sign-out', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router
