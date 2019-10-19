module.exports = {
  deposit: (dataArray, user) => {
    // dataArray is the data submitted
    // user is the mongodb model
    user.account.money += dataArray[1]
    user.account.food += dataArray[2]
    user.account.gasoline += dataArray[3]
    user.account.munition += dataArray[4]
    user.account.steel += dataArray[5]
    user.account.alum += dataArray[6]
    user.account.ura += dataArray[7]
    user.account.coal += dataArray[8]
    user.account.oil += dataArray[9]
    user.account.lead += dataArray[10]
    user.account.iron += dataArray[11]
    user.account.bauxite += dataArray[12]
  },
  withdraw: (dataArray, user) => {
    user.account.money -= dataArray[1]
    user.account.food -= dataArray[2]
    user.account.gasoline -= dataArray[3]
    user.account.munition -= dataArray[4]
    user.account.steel -= dataArray[5]
    user.account.alum -= dataArray[6]
    user.account.ura -= dataArray[7]
    user.account.coal -= dataArray[8]
    user.account.oil -= dataArray[9]
    user.account.lead -= dataArray[10]
    user.account.iron -= dataArray[11]
    user.account.bauxite -= dataArray[12]
  },
  depositAutomatic: (dataArray, user) => {
    user.account.money += dataArray[0]
    user.account.food += dataArray[1]
    user.account.gasoline += dataArray[8]
    user.account.munition += dataArray[9]
    user.account.steel += dataArray[10]
    user.account.alum += dataArray[11]
    user.account.ura += dataArray[4]
    user.account.coal += dataArray[2]
    user.account.oil += dataArray[3]
    user.account.lead += dataArray[5]
    user.account.iron += dataArray[6]
    user.account.bauxite += dataArray[7]
  },
  withdrawAutomatic: (dataArray, user) => {
    user.account.money -= dataArray[0]
    user.account.food -= dataArray[1]
    user.account.gasoline -= dataArray[8]
    user.account.munition -= dataArray[9]
    user.account.steel -= dataArray[10]
    user.account.alum -= dataArray[11]
    user.account.ura -= dataArray[4]
    user.account.coal -= dataArray[2]
    user.account.oil -= dataArray[3]
    user.account.lead -= dataArray[5]
    user.account.iron -= dataArray[6]
    user.account.bauxite -= dataArray[7]
  }
}
