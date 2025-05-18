const express = require('express');
const router = express.Router();
const Library = require('../models/library');
const multer = require('../config/multer'); // Multer for image upload
const isSignedIn = require('../middleware/is-signed-in');

//GET
//Show all libraries
router.get('/', async (req, res) => {
  const libraries = await Library.find().populate('owner');
  res.render('libraries/index.ejs', { libraries });
});
//Form to create new library
router.get('/new', isSignedIn, (req, res) => {
  res.render('libraries/new.ejs');
});


//POST
//Create new library
router.post('/', isSignedIn, multer.single('image'), async (req, res) => {
  const newLibrary = new Library({
    name: req.body.name,
    location: req.body.location,
    amenities: req.body.amenities.split(','),
    seatingAvailability: req.body.seatingAvailability,
    operatingHours: req.body.operatingHours,
    image: req.file ? req.file.filename : 'default-library.jpg',
    owner: req.session.user._id
  });
  await newLibrary.save();
  res.redirect('/libraries');
});

//Show library details
router.get('/:id', async (req, res) => {
  const library = await Library.findById(req.params.id).populate('owner');
  res.render('libraries/show.ejs', { library });
});