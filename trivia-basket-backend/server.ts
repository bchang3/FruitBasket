import express from "express"
import mysql from "mysql2"

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8080;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'fruit-basket-db'
});

connection.connect;

var app = express();

app.get('/', function(req, res) {
        res.send({'message': 'Hello'});
});
app.post('/api/login', async function(req, res) {
  const username = req.body.username; 
  const password = req.body.password; 

  let sql = 'SELECT password FROM User WHERE username=?';

  connection.query(sql, [username], function(err, results) {
    if (err) {
      console.error('Error fetching user login credentials', err);
      res.status(500).send({ message: 'Error fetching user login credentials', error: err });
      return;
    }
    res.json(results);
  });
  
});

app.listen(PORT, function () {
        console.log(`Node app is running on port ${PORT}`);
});