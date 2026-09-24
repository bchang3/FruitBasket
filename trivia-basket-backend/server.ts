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

app.post('/api/user/flashcards/search', async function(req, res) {
  const username = req.body.username;
  const search = req.body.search;
  let sql = 'CALL SearchFlashcards(?, ?)';

  connection.query(sql, [username, search], function(err, results) {
    if (err) {
      console.error('Error searching user flashcards', err);
      res.status(500).send({ message: 'Error searching user flashcards', error: err });
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

// Creates a solo game (same tables/procs multiplayer uses) and returns its questions
// with answer options attached. POST because initializeGame writes rows (Game,
// GameSettings, GamePlayers, GameQuestions) - it isn't safe to repeat on a GET.
app.post('/api/singlePlayer/game', async function(req, res) {
  const username = req.body.username;
  const categories = req.body.categories as string[] | undefined;
  const numQuestions = req.body.numQuestions || 10;
  const gameID = Date.now();

  const categoriesCSV = categories && categories.length > 0 ? categories.join(',') : '';

  const initSql = 'CALL initializeGame(?, ?, ?, ?)';
  connection.query(
    initSql,
    [categoriesCSV, username, numQuestions, gameID],
    function(initErr) {
      if (initErr) {
        console.error('Error initializing single player game', initErr);
        res.status(500).send({ message: 'Error initializing single player game', error: initErr });
        return;
      }

      const questionsSql = 'CALL getGameQuestions(?)';
      connection.query(questionsSql, [gameID], function(err, results) {
        if (err) {
          console.error('Error fetching game questions', err);
          res.status(500).send({ message: 'Error fetching game questions', error: err });
          return;
        }
        const [rows]: any = results;

        const questions = rows.map((shell: any) => {
          let questionOptions: string[] = [];
          const optionsSql = 'CALL getQuestionOptions(?)';
          connection.query(optionsSql, [shell.questionID], function(optErr, optResults) {
            if (optErr) {
              console.error('Error fetching question options', optErr);
              return;
            }
            const [optionRows]: any = optResults;
            questionOptions = optionRows.map((packet: any) => ({
              ...packet,
              questionOptionLabel: packet.optionLabel,
              questionOptionText: packet.optionValue,
            }));
          });

          return {
            questionID: shell.questionID,
            questionText: shell.questionText,
            questionCategory: shell.categoryName,
            questionAnswer: shell.answerOptionID,
            questionOptions,
          };
        });

        res.json({ gameID, questions });
      });
    },
  );
});

app.listen(PORT, function () {
        console.log(`Node app is running on port ${PORT}`);
});
