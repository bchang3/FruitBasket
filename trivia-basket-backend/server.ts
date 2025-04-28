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
  }
  });

var app = express();
app.use(express.json());

app.get('/', function(req, res) {
        res.send({'message': 'Hello'});
});

app.post('/api/login', async function(req, res) {
  const username = req.body.username;

  let sql = 'SELECT password, fruitIcon, iconBackgroundColor, elo FROM User WHERE username=?';

  connection.query(sql, [username], function(err, results) {
    if (err) {
      console.error('Error fetching user login credentials', err);
      res.status(500).send({ message: 'Error fetching user login credentials', error: err });
      return;
    }
    res.json(results);
  });
  
});

app.get('/api/user/flashcards/:username', async function(req, res) {
  const username = req.params.username;
  let sql = 'CALL GetUserFlashcards(?)';

  connection.query(sql, [username], function(err, results) {
    if (err) {
      console.error('Error fetching user flashcards', err);
      res.status(500).send({ message: 'Error fetching user flashcards', error: err });
      return;
    }
    const [rows]: any = results;
    res.json(rows);
  });
  
});

app.get('/api/user/stats/:username', async function(req, res) {
  const username = req.params.username;
  let sql = 'CALL GetUserCategoryStats(?)';

  connection.query(sql, [username], function(err, results) {
    if (err) {
      console.error('Error fetching user flashcards', err);
      res.status(500).send({ message: 'Error fetching user flashcards', error: err });
      return;
    }
    const [rows]: any = results;
    res.json(rows);
  });
  
});


app.post('/api/user/flashcards/addFlashcard', async function(req, res) {
  const username = req.body.username;
  const questionID = req.body.questionID;
  let sql = 'CALL AddFlashcard(?, ?)';

  connection.query(sql, [username, questionID], function(err, results) {
    if (err) {
      console.error('Error adding user flashcard.', err);
      res.status(500).send({ message: 'Error adding user flashcard.', error: err });
      return;
    }
    res.send({ message: 'Succesfully added user flashcard!' });
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

app.get('/api/categories', async function(req, res) {

  let sql = 'SELECT categoryName from Category';

  connection.query(sql, function(err, results) {
    if (err) {
      console.error('Error fetching categories', err);
      res.status(500).send({ message: 'Error fetching categories', error: err });
      return;
    }
    res.json(results);
  });
  
});


app.listen(PORT, function () {
        console.log(`Node app is running on port ${PORT}`);
});