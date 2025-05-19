const multer = require('multer')
const path = require('path')

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  }
})

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|jifif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images only! (JPEG, JPG, PNG, GIF)')
  }
}

// Init upload (just the multer instance)
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
})

module.exports = upload
