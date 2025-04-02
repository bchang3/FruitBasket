import csv from "csv-parser"
import fs from "fs"
import mysql from "mysql2/promise"

async function connect() {
  const connection = await mysql.createConnection({
    host: '35.238.64.199',
    user: 'root',
    password: '=%f=dpfjZOrd:6L0',
    database: 'fruit-basket-db'
});

  console.log('Connected to MySQL!');

  return connection;
}

const connection = await connect();

const id_to_date = new Map<number, Date>();
const game_to_players = new Map<number, string[]>();
const game_to_categories = new Map<number, number[]>();
const category_to_questions = new Map<number, number[]>();
const question_to_options = new Map<number, number[]>();
const question_to_answer = new Map<number, number>();

function sample(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}
async function seedUsers() {
  const toInsert: any[] = [];
  const fruit_icons = ["mango", "orange", "strawberry", "peach", "pomegranate", "lemon", "pear", "plum", "apple"]
  const colors = ["red", "orange", "yellow", "yellow-green", "green", "turquoise", "light-blue", "royal-blue", "purple", "magenta"]

  for (let i = 0; i < 1000; i++) {
    const username = `user-${i}`
    const password = `password-${i}`
    toInsert.push([username, password, sample(fruit_icons), sample(colors)]);
    //console.log(sql);
  }
  var sql = `INSERT INTO User (username, password, fruitIcon, iconBackgroundColor) VALUES ?`;
  await connection.query(sql, [toInsert]);
}
async function seedGames() {
  const rows: any[] = []
  for (let i = 0; i < 1000; i++) {
    const gameID = i
    const start = new Date(2024, 9, 1);
    const end = new Date(2025, 2, 31);
    const gameDate = (new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())));
    id_to_date.set(gameID, gameDate);
    const row = [gameID, gameDate.toISOString().slice(0, 19).replace('T', ' ')]
    rows.push(row)
  }
  var sql = `INSERT INTO Game (gameID, gameDate) VALUES ?`;
  console.log(sql);
  await connection.query(sql, [rows]);
}

async function importCategoryCSV(filePath: string): Promise<void> {
  let rows: any[] = []
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row: Record<string, string>) => {
        rows.push(row);
      })
      .on("end", async () => {
        for (const row of rows) {
          if (row.categoryID === undefined) {
            continue;
          }
          category_to_questions.set(parseInt(row.categoryID), []);
          var sql = `INSERT INTO Category (categoryID, categoryName) VALUES (${row.categoryID}, '${row.categoryName}')`;
          //console.log(sql);
          await connection.query(sql);
        }
        resolve();
      })
      .on("error", (error) => reject(error));
  });
}

async function importQuestionCSV(filePath: string): Promise<void> {
  let rows: any[] = [];
  const insertRows: any[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row: Record<string, string>) => {
        rows.push(row);
      })
      .on("end", async () => {
        for (const row of rows) {
          if (row.questionID === undefined) {
            continue;
          }
          category_to_questions.get(parseInt(row.categoryID))?.push(parseInt(row.questionID));
          question_to_options.set(parseInt(row.questionID), []);
          question_to_answer.set(parseInt(row.questionID), parseInt(row.answerOptionID));
          
          const toAdd = [row.questionID, row.questionType, row.questionText, row.categoryID, row.answerOptionID]
          insertRows.push(toAdd);
          // //console.log(sql);
         
        }
        var sql = `INSERT INTO Question (questionID, questionType, questionText, categoryID, answerOptionID) VALUES ?`;
        await connection.query(sql, [insertRows]);
        resolve();
      })
      .on("error", (error) => reject(error));
  });
}



async function importQuestionOptionCSV(filePath: string): Promise<void> {
  let rows: any[] = []
  const insertRows: any[] = []
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row: Record<string, string>) => {
        rows.push(row);
      })
      .on("end", async () => {
        for (const row of rows) {
          if (row.questionOptionID === undefined) {
            continue;
          }
          question_to_options.get(parseInt(row.questionID))?.push(parseInt(row.questionOptionID));
          const toAdd = [row.questionOptionID,row.optionLabel, row.optionValue, row.questionID]
          insertRows.push(toAdd)
          //console.log(sql);
          
        }
        var sql = `INSERT INTO QuestionOption (questionOptionID, optionLabel, optionValue, questionID) VALUES ?`;
        await connection.query(sql, [insertRows]);
        resolve();
      })
      .on("error", (error) => reject(error));
  });
}


async function seedGameSettings() {
  const toInsert: any[] = [];
  for (let i = 0; i < 1000; i++) {
    const gameID = i
    const numCategories = 2 + Math.floor(Math.random() * 20)
    const selected: number[] = []
    game_to_categories.set(gameID, []);
    for (let j = 0; j < numCategories; j++) {
      let categoryID: number;
      while (true) {
        categoryID = Math.floor(Math.random() * 21);
        if (!selected.includes(categoryID)) {
          selected.push(categoryID);
          break;
        }
      }
      game_to_categories.get(gameID)?.push(categoryID);
      toInsert.push([categoryID, gameID])
      
    }
   
  }
  var sql = `INSERT INTO GameSettings (categoryID, gameID) VALUES ?`;
  //console.log(sql);
  await connection.query(sql, [toInsert]);
}

async function seedGamePlayers() {
  const toInsert: any[] = [];
  for (let i = 0; i < 1000; i++) {
    const gameID = i;
    game_to_players.set(gameID, []);
    const numPlayers = 2 + Math.floor(Math.random() * 9)
    const selectedUsers: number[] = []
    for (let j = 0; j < numPlayers; j++) {
      let usernameNum: number;
      while (true) {
        usernameNum = Math.floor(Math.random() * 1000);
        if (!selectedUsers.includes(usernameNum)) {
          selectedUsers.push(usernameNum);
          break;
        }
      }
      const username = `user-${usernameNum}`
      game_to_players.get(gameID)?.push(username);
      toInsert.push([username, gameID])
    }
  }
  var sql = `INSERT INTO GamePlayers (username, gameID) VALUES ?`;
  //console.log(sql);
  await connection.query(sql, [toInsert]);
}
async function seedQuestionInstances() {
  const toInsert: any[] = []
  let questionInstanceID = 0;
  for (let i = 0; i < 1000; i++) {
    const gameID = i;
    const categories = game_to_categories.get(gameID)!;
    let questions: number[] = [];
    for (const c of categories) {
      questions = [...questions, ...category_to_questions.get(c)!];
    }
    if (questions.length == 0) {
      console.log("NO QUESTIONS");
      console.log(categories);
    }
    const gameDate = id_to_date.get(gameID)!;
    const gamePlayers = game_to_players.get(gameID)!;
    const numQuestionsAnswered = 10 + Math.floor(Math.random() * 21);
    const questionsAnswered: number[] = []
    for (let m = 0; m < numQuestionsAnswered; m++) {
      let questionIdx;
      while (true) {
        questionIdx = Math.floor(Math.random() * questions.length);
        if (!questionsAnswered.includes(questions[questionIdx])) {
          questionsAnswered.push(questions[questionIdx]);
          break;
        }
      }
    }
    for (let j = 0; j < gamePlayers.length; j++) {
      const username = gamePlayers[j];
      for (let k = 0; k < numQuestionsAnswered; k++) {
        const questionID = questionsAnswered[k];
        const options = question_to_options.get(questionID)!;
        const answer = question_to_answer.get(questionID)!;
        const selectedOption = options[Math.floor((Math.random() * options.length))];
        let points = 0;
        let createdAt = new Date(gameDate);
        let answeredAt = new Date(gameDate);
        const timeToAnswer = Math.floor((Math.random() * 29) + 2);
        answeredAt.setSeconds(answeredAt.getSeconds() + timeToAnswer);
        if (selectedOption === answer) {
          points += 100 + Math.floor(300 / timeToAnswer);
        }
        
        toInsert.push([questionInstanceID, createdAt, answeredAt, points, questionID, username, gameID, selectedOption])
        // console.log(sql);
        
        questionInstanceID += 1;

      }
    }
  }
  var sql = `INSERT INTO QuestionInstance (questionInstanceID, createdAt, answeredAt, points, questionID, username, gameID, userAnswer) VALUES ?`;
  await connection.query(sql, [toInsert]);
}
// function seedFlashCards() {

// }

console.log("Seeding users");
await seedUsers();
console.log("Seeding games");
await seedGames();
console.log("Seeding categories");
await importCategoryCSV("categories.csv");
console.log("Seeding questions");
await importQuestionCSV("questions.csv");
console.log("Seeding question options");
await importQuestionOptionCSV("questionOptions.csv");
console.log("Seeding game settings");
await seedGameSettings();
console.log("Seeding game players");
await seedGamePlayers();
console.log("Seeding question instances");
await seedQuestionInstances();
console.log("Closing connection");
await connection.end();
