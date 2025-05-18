const express = require('express');
const router = express.Router();
const Library = require('../models/library');
const multer = require('../config/multer'); // Multer for image upload
const isSignedIn = require('../middleware/is-signed-in');