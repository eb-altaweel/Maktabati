const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const Library = require('./models/library')
// Middlewares
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const session = require('express-session')
const passUserToView = require('./middleware/pass-user-to-view')
const isSignedIn = require('./middleware/is-signed-in')
app.use(express.static('public'))

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000'
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }))
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'))
// Morgan for logging HTTP requests
app.use(morgan('dev'))
app.use('/uploads', express.static('public/uploads'))

// session configurations
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)

app.use(passUserToView)

//Require Controllers
const authController = require('./controllers/auth')
const libraryController = require('./controllers/libraries')

app.use('/auth', authController)
app.use('/libraries', libraryController)

app.get('/', async (req, res) => {
try {
const libraries = await Library.find().populate('userId');
res.render('index.ejs', { libraries });
} catch (error) {
console.error('Error loading homepage:', error);
res.redirect('/auth/sign-in');
}
});
// Route - just for testing purpose


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`)
})
