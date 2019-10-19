module.exports = {
  // Ensure the user is authenticated to access dashboard
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/')
    }
  },
  // If the user is authenticated, just let them go directly to the dashboard
  forwardAuthenticate: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect('/account')
    } else {
      next()
    }
  }
}
