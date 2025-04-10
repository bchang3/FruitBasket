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

connection.connect((err) => {
  if (!err) {
    console.log("Connected to database!");
  } else {
    console.log(err);
    console.log("Error connecting to database!");
    console.log(process.env.DB_HOST);
    console.log(process.env.DB_PASSWORD);
  }
  });

var app = express();
app.use(express.json());

app.get('/', function(req, res) {
        res.send({'message': 'Hello'});
});
app.post('/api/login', async function(req, res) {
  const username = req.body.username;

  let sql = 'SELECT password, fruitIcon, iconBackgroundColor FROM User WHERE username=?';

  connection.query(sql, [username], function(err, results) {
    if (err) {
      console.error('Error fetching user login credentials', err);
      res.status(500).send({ message: 'Error fetching user login credentials', error: err });
      return;
    }
    res.json(results);
  });
  
});

app.post('/api/updateProfileImage', async function(req, res) {
  const profileIcon = req.body.profileIcon;
  const username = req.body.username;
  const profileColor = req.body.profileColor;
  console.log(username, profileColor, profileIcon);

  let sql = 'UPDATE User SET iconBackgroundColor = ?, fruitIcon = ? WHERE username= ?';

  connection.query(sql, [profileColor, profileIcon, username], function(err, results) {
    if (err) {
      console.error('Error updating user profile image', err);
      res.status(500).send({ message: 'Error updating user profile image', error: err });
      return;
    }
    res.send({ message: 'User profile image modified successfully!' });
  });
  
});

app.listen(PORT, function () {
        console.log(`Node app is running on port ${PORT}`);
});