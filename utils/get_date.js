// Get UTC time
const date = new Date()
let year = date.getUTCFullYear()
let month = date.getUTCMonth() + 1
let day = date.getUTCDate()

if (month <= 9) month = '0' + month
if (day <= 9) day = '0' + day

const UTC_time = `${year}-${month}-${day}`

module.exports = UTC_time
