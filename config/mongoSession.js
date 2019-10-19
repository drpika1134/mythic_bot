const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const db = require('../config/db').MongoURI
module.exports = {
  MongoStore: new MongoStore({
    url: db,
    mongoOptions: { useUnifiedTopology: true },
    // remove empty session after a week
    ttl: 60 * 60
  })
}
