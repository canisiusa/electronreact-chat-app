let connection = require('../config/db')

//#region model fields
// id
// from_id
// to_id
// content
// created_at
// read_at
//#endregion

class Message {

  constructor(row) {
    this.row = row
  }


  // methods
  static create(content, cb) {
    connection.query('INSERT INTO messages SET content = ?, created_at = ?', [content, new Date()], (err, result) => {
      if (err) throw err
      cb(result)
    })
  }

  static all(cb) {
    connection.query('SELECT * FROM messages', (err, rows) => {
      if (err) throw err
      cb(rows.map((row) => new Message(row)))
    })
  }
  static find(id, cb) {
    connection.query('SELECT * FROM messages WHERE id = ? LIMIT 1', [id], (err, rows) => {
      if (err) throw err
      cb(new Message(rows[0]))
    })
  }
}
module.exports = Message