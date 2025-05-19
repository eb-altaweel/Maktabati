const express = require('express')
const router = express.Router()
const Library = require('../models/library')
const multer = require('../config/multer') // Multer for image upload
const isSignedIn = require('../middleware/is-signed-in')

//GET
//Show all libraries(View Only)
router.get('/', async (req, res) => {
  const libraries = await Library.find().populate('userId')
 res.render('libraries/index.ejs', { libraries, user: req.session.user })
});
// Show user libraries (Editable)
router.get('/my-libraries', isSignedIn, async (req, res) => {
  const libraries = await Library.find({ userId: req.session.user._id }).populate('userId');
  res.render('libraries/my-libraries.ejs', { libraries, user: req.session.user });
});

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
  res.redirect('/libraries/my-libraries')
})

//Show library details
router.get('/:id', async (req, res) => {
  const library = await Library.findById(req.params.id).populate('userId')
  res.render('libraries/show.ejs', { library, user: req.session.user })
})


// Edit form
router.get('/:id/edit', isSignedIn, async (req, res) => {
  const library = await Library.findById(req.params.id)
    if (!library || !library.userId.equals(req.session.user._id)) {
    return res.redirect('/libraries');
  }
  res.render('libraries/edit.ejs', { library })
})

// PUT
//  Update library
router.put('/:id', isSignedIn, multer.single('image'), async (req, res) => {
  const library = await Library.findById(req.params.id)
    if (!library || !library.userId.equals(req.session.user._id)) {
    return res.redirect('/libraries');
  }

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
  const library = await Library.findById(req.params.id);
  if (!library || !library.userId.equals(req.session.user._id)) {
    return res.redirect('/libraries');
  }
  
  await Library.findByIdAndDelete(req.params.id);
  res.redirect('/libraries/my-libraries');
});
module.exports = router
