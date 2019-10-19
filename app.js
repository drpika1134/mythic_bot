// Initializaion + packages
require('dotenv').config()
const express = require('express')
const session = require('express-session')

const passport = require('passport')
const helmet = require('helmet')
const flash = require('connect-flash')
const mongoose = require('mongoose')

const MongoStore = require('./config/mongoSession').MongoStore
const app = express()

// Helmet
app.use(helmet())

const db = require('./config/db.js').MongoURI

// Passport
require('./config/passport')(passport)

// DB connection
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

// Session
app.use(
  session({
    key: 'sessionID',
    secret: 'secret',
    store: MongoStore,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy'
  })
)

// passport
app.use(passport.initialize())
app.use(passport.session())

// Middlewares
app.set('view engine', 'ejs')

// Parses incoming data
app.use(express.urlencoded({ extended: false }))

// Flash
app.use(flash())

// Global variables
app.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message')
  res.locals.error_message = req.flash('error_message')
  res.locals.error = req.flash('error')
  next()
})

app.use('/static', express.static('static'))

// Routes
app.use('/', require('./auth_routes/auth_routes.js'))
app.use('/account', require('./auth_routes/account_routes.js'))

// Error Routes

// 404
app.use((req, res) => {
  return res.status(404).send({ message: 'Route' + req.url + ' Not found.' })
})

// 500 - Any server error
app.use((err, req, res, next) => {
  return res.status(500).send('There has been an error!')
})

// Setting port number
const port = process.env.PORT || 3000

app.listen(port, () => console.log('Listening on port 3000!'))
