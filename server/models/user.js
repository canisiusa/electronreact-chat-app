//#region model fields
// id
// username
// password
//#endregion

let connection = require('../config/db')

class User {
  constructor(row){
    this.row = row
  }
}

module.exports = User

