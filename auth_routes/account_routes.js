// Initialization
const express = require('express')

// Router to handle routes
const router = express.Router()

// Authentication
const { ensureAuthenticated } = require('../config/auth')

// DB models
const User = require('../models/User.js')
const Log = require('../models/Log.js')

// Utils
const UTC_time = require('../utils/get_date')
const bank = require('../utils/bank')

// Handling POST request to '/addLog'
router.post('/addLog', ensureAuthenticated, (req, res, next) => {
  const data = req.body
  if (data.resource == undefined) {
    manual(data, req, res, next)
  }

  if (data.resource != undefined) {
    automatic(data, req, res, next)
  }
})

function manual(data, req, res, next) {
  const money = data.money
  if (money.substring(0, 1) == '$') {
    data.money = money.slice(1, money.length)
  }
  let dataArray = Object.values(data)
  // Set the data to 0 if nothing was submitted
  for (let i = 1; i < dataArray.length; i++) {
    let current = dataArray[i]
    // Validation
    if (
      current.length > 30 ||
      current.indexOf('{') != -1 ||
      current.indexOf('}') != -1
    ) {
      dataArray[i] = 0
    }
    // Parse the data to a float
    if (current != '') {
      dataArray[i] = parseFloat(current.replace(/,/g, ''))
    }
    // Default to 0 if nothing is there
    if (current == '') {
      dataArray[i] = 0
    }
  }
  User.findOne({ name: req.user.name }, (err, user) => {
    if (err) {
      next('error')
      return
    }
    if (dataArray[0] == 'Deposit') {
      bank.deposit(dataArray, user)
    } else if (dataArray[0] == 'Withdraw') {
      bank.withdraw(dataArray, user)
    }

    user.markModified('account')
    user.save()
  })

  // Add the new log to db
  const newLog = new Log({
    name: req.user.name,
    type: dataArray[0],
    date: UTC_time,
    resources: {
      money: dataArray[1],
      food: dataArray[2],
      gasoline: dataArray[3],
      munition: dataArray[4],
      steel: dataArray[5],
      alum: dataArray[6],
      ura: dataArray[7],
      coal: dataArray[8],
      oil: dataArray[9],
      lead: dataArray[10],
      iron: dataArray[11],
      bauxite: dataArray[12]
    }
  })
  newLog.save()
  res.redirect('/account#logs-area')
}

function automatic(data, req, res, next) {
  // Check if the form was empty
  if (data.resource == '') {
    req.flash('error_message', 'Field cannot be empty when submitted')
    return res.redirect('/account')
  } else {
    const dataArray = data.resource.split('\t')
    if (dataArray.length < 12 || dataArray.length > 12) {
      req.flash('error_message', 'Field can only contain 12 items')
      return res.redirect('/account')
    }
    const dataMoney = dataArray[0]
    if (dataMoney.substring(0, 1) == '$') {
      dataArray[0] = dataMoney.slice(1, dataMoney.length)
    }
    // regex expression to check if the data only contain digits, commas and periods
    const isValid = dataArray.some(item => /^[0-9,.]*$/.test(item))
    for (let i = 0; i < dataArray.length; i++) {
      let current = dataArray[i]
      dataArray[i] = parseFloat(current.replace(/,/g, ''))
    }
    if (isValid) {
      User.findOne({ name: req.user.name }, (err, user) => {
        if (err) {
          next('error')
          return
        }
        if (data.type == 'Deposit') {
          bank.depositAutomatic(dataArray, user)
        } else if (data.type == 'Withdraw') {
          bank.withdrawAutomatic(dataArray, user)
        }

        user.markModified('account')
        user.save()
      })

      const newLog = new Log({
        name: req.user.name,
        type: data.type,
        date: UTC_time,
        resources: {
          money: dataArray[0],
          food: dataArray[1],
          gasoline: dataArray[8],
          munition: dataArray[9],
          steel: dataArray[10],
          alum: dataArray[11],
          ura: dataArray[4],
          coal: dataArray[2],
          oil: dataArray[3],
          lead: dataArray[5],
          iron: dataArray[6],
          bauxite: dataArray[7]
        }
      })
      newLog.save()
    }
    res.redirect('/account')
  }
}

module.exports = router
