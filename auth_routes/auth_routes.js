// Initialization
const express = require('express')
const passport = require('passport')
const rateLimit = require('express-rate-limit')

const router = express.Router()

// Authentication
const { ensureAuthenticated, forwardAuthenticate } = require('../config/auth')

// Rate Limiter
const loginRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10 // Maximum # of requests is 10, after that blocks for 1 hour
})

// DB Models
const User = require('../models/User.js')
const Log = require('../models/Log.js')
function preventCache(req, res, next) {
  res.set(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
  )
  next()
}

// Login Route
router.get('/', [forwardAuthenticate, preventCache], (req, res) => {
  res.render('login')
})

// Handle Post request on /login
router.post(
  '/login',
  [
    loginRateLimit,
    passport.authenticate('local', {
      failureRedirect: '/',
      failureFlash: true
    })
  ],
  (req, res) => {
    // Check if "remember" checkbox is checked then redirect to /dashboard
    if (req.body.rememberme == 'on') {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000 // Cookie expires after 30 days
    } else {
      req.session.cookie.expires = false // Cookie expires at end of session
    }
    return res.redirect('/account')
  }
)
// Account
router.get(
  '/account',
  [ensureAuthenticated, preventCache],
  (req, res, next) => {
    const { name } = req.user
    Log.find({ name }, null, { sort: { createdAt: -1 } }, (err, logs) => {
      if (err) {
        next('error')
      }
      User.find({ name: { $ne: name } }, (err, users) => {
        if (err) {
          next('error')
        }
        res.render('account', {
          user: name,
          account: req.user.account,
          logs,
          users
        })
      })
    })
  }
)
// Handle Logout
router.get('/logout', (req, res) => {
  req.logOut()
  req.session = null
  res.redirect('/')
})

module.exports = router
