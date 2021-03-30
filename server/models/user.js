//#region model fields
// id
// username
// password
//#endregion

let connection = require('../config/db')

class User {



  static getAll(callback) {
    connection.query('SELECT * FROM users', (err, rows) => {
      if (err) throw err
      callback(rows)
    })
  }

  get() {

  }



  static create(name, callback) {

    connection.query('SELECT * FROM users WHERE `username` = ?', [name], (err, rows) => {
      if (err) throw err

      if (rows.length === 0) {
        connection.query('INSERT INTO users SET username = ?, created_at = ?', [name, new Date()], (err, result) => {
          if (err) throw err
          connection.query('SELECT * FROM users WHERE `username` = ?', [name], (err, rows) => {
            callback(rows)
          })
        })
      }else{
        callback(rows)
      }
    })


  }
  delete() {

  }
  update() {

  }
}

module.exports = User

