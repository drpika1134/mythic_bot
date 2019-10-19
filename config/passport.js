// Initialization
const LocalStrategy = require('passport-local').Strategy

// Mongodb Model
const User = require('../models/User')

// Validating user input
function validateInput(username, password) {
  if (typeof username != 'string' || typeof password != 'string') {
    return true
  }
  if (
    username.indexOf('{') != -1 ||
    username.indexOf('}') != -1 ||
    username.indexOf('$') != -1
  ) {
    return true
  } else if (
    password.indexOf('{') != -1 ||
    password.indexOf('}') != -1 ||
    password.indexOf('$') != -1
  ) {
    return true
  }
  return false
}

// Export passport
module.exports = passport => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      // Check if user input is valid
      if (validateInput(username, password)) {
        return done(null, false, { message: 'An error has occurred' })
      }
      // DB look up
      User.findOne({ username }, (err, user) => {
        // Error handling
        if (err) {
          console.log(err)
          return
        }
        // Check if user doesn't exist
        if (!user) {
          return done(null, false, { message: 'An error has occurred' })
        }
        // Password checking
        if (password == user.password) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'An error has occurred' })
        }
      })
    })
  )
  // Store data in session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // Look up user for every subsequent requests
  passport.deserializeUser((id, done) => {
    // DB look up
    User.findById(id, (err, user) => {
      if (err) {
        // console.log(err)
        return
      }
      // return user object if found
      const { username, name, account } = user
      const _user = {
        username,
        name,
        account
      }

      done(null, _user)
    })
  })
}
