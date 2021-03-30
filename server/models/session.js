//#region model fields
// id
// user_id
// connected
// created_at
// updated_at
//#endregion


let connection = require('../config/db')

class  Session {
  constructor() {
    this.sessions = new Map();
  }

  static findUser(id,callback) {
    connection.query('SELECT * FROM sessions WHERE user_id = ? GROUP BY `created_at` DESC', [id], function(err, result){
      if (err) throw err
      callback(result)
    })
  }

  static saveSession(session, callback) {
    connection.query('INSERT INTO sessions SET id = ?, user_id = ?, connected = ?, created_at = ?', [session.id, session.user_id, session.connected ,  new Date()], (err, result) => {
      if (err) throw err
      callback(result)
    })
    
  }

  static disconnectUser(id) {
    connection.query('UPDATE `sessions` SET `connected` = ? WHERE `id` = ?', [0, id], (err, result) => {
      if (err) throw err
      
    })
  }
}

module.exports = Session
