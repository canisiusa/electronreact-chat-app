let mysql = require('mysql');
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chatApp'
})
connection.connect();

connection.query('CREATE TABLE IF NOT EXISTS users ( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `username` VARCHAR(100) NOT NULL , `created_at` DATETIME NOT NULL , PRIMARY KEY (`id`), UNIQUE (`username`)) ENGINE = InnoDB', function (error, results, fields) {
  if (error){ 
    throw error
  }
  //console.log('The results is: ', results);

});
connection.query('CREATE TABLE IF NOT EXISTS messages ( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY , `from_id` INT UNSIGNED NOT NULL , `to_id` INT UNSIGNED NOT NULL , `content` TEXT NOT NULL , `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , `read_at` DATETIME NULL DEFAULT NULL , FOREIGN KEY (`from_id`) REFERENCES `users`(`id`) ON DELETE CASCADE, FOREIGN KEY (`to_id`) REFERENCES `users`(`id`) ON DELETE CASCADE) ENGINE = InnoDB', function (error, results, fields) {
  if (error) {
    throw error
  }
  //console.log('The results is: ', results);

});
connection.query('CREATE TABLE IF NOT EXISTS sessions ( `id`  VARCHAR(100) NOT NULL  PRIMARY KEY , `user_id` INT UNSIGNED NOT NULL , `connected` BOOLEAN NOT NULL , `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , `updated_at` DATETIME NULL DEFAULT NULL , FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE) ENGINE = InnoDB', function (error, results, fields) {
  if (error) {
    throw error
  }
  //console.log('The results is: ', results);
  //console.log('done')

});
module.exports = connection