const express = require('express');
const router = express.Router();
const Library = require('../models/library');
const multer = require('../config/multer'); // Multer for image upload
const isSignedIn = require('../middleware/is-signed-in');

// GET /libraries - Show all libraries
router.get('/', async (req, res) => {
  const libraries = await Library.find().populate('owner');
  res.render('libraries/index.ejs', { libraries });
});
