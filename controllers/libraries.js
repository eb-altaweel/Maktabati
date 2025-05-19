const express = require('express')
const router = express.Router()
const Library = require('../models/library')
const Comment = require('../models/comment')
const multer = require('../config/multer') // Multer for image upload
const isSignedIn = require('../middleware/is-signed-in')

//GET
//Show all libraries
router.get('/', async (req, res) => {
  const libraries = await Library.find().populate('userId')
  res.render('libraries/index.ejs', { libraries })
})
//Form to create new library
router.get('/new', isSignedIn, (req, res) => {
  res.render('libraries/new.ejs')
})

//POST
//Create new library
router.post('/', isSignedIn, multer.single('image'), async (req, res) => {
  const newLibrary = new Library({
    name: req.body.name,
    location: req.body.location,
    address: req.body.address,
    description: req.body.description,
    hasSeating: req.body.hasSeating === 'on',
    hasStudyRoom: req.body.hasStudyRoom === 'on',
    openTime: req.body.openTime,
    closeTime: req.body.closeTime,
    image: req.file ? req.file.filename : 'default-library.jpg',
    userId: req.session.user._id
  })
  await newLibrary.save()
  res.redirect('/libraries')
})

//Show library details
router.get('/:id', async (req, res) => {
  const library = await Library.findById(req.params.id)
    .populate('userId')
    .populate('favouritedByUser') // To access full user docs if needed

  const comments = await Comment.find({ libraryId: req.params.id }).populate(
    'userId'
  )

  let userHasFavourited = false
  if (req.session.user) {
    userHasFavourited = library.favouritedByUser.some((user) =>
      user.equals(req.session.user._id)
    )
  }

  res.render('libraries/show.ejs', {
    library,
    comments,
    userHasFavourited,
    user: req.session.user
  })
})

// Edit form
router.get('/:id/edit', isSignedIn, async (req, res) => {
  const library = await Library.findById(req.params.id)
  res.render('libraries/edit.ejs', { library })
})

// PUT
//  Update library
router.put('/:id', isSignedIn, multer.single('image'), async (req, res) => {
  const library = await Library.findById(req.params.id)
  library.name = req.body.name
  library.location = req.body.location
  library.address = req.body.address
  library.description = req.body.description
  library.hasSeating = req.body.hasSeating === 'on'
  library.hasStudyRoom = req.body.hasStudyRoom === 'on'
  library.openTime = req.body.openTime
  library.closeTime = req.body.closeTime
  if (req.file) library.image = req.file.filename
  await library.save()
  res.redirect(`/libraries/${library._id}`)
})

//Delete library
router.delete('/:id', isSignedIn, async (req, res) => {
  await Library.findByIdAndDelete(req.params.id)
  res.redirect('/libraries')
})

router.post('/comments', isSignedIn, async (req, res) => {
  const newComment = new Comment({
    content: req.body.comment,
    libraryId: req.body.libraryId,
    userId: req.session.user._id
  })

  await newComment.save()
  res.redirect(`/libraries/${req.body.libraryId}`) // Redirect to the same library page
})

// Favourite a library
router.post(
  '/:libraryId/favourited-by/:userId',
  isSignedIn,
  async (req, res) => {
    await Library.findByIdAndUpdate(req.params.libraryId, {
      $push: { favouritedByUser: req.params.userId }
    })
    res.redirect(`/libraries/${req.params.libraryId}`)
  }
)

// Unfavourite a library
router.delete(
  '/:libraryId/favourited-by/:userId',
  isSignedIn,
  async (req, res) => {
    await Library.findByIdAndUpdate(req.params.libraryId, {
      $pull: { favouritedByUser: req.params.userId }
    })
    res.redirect(`/libraries/${req.params.libraryId}`)
  }
)

module.exports = router
