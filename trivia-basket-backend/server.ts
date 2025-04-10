import express from "express"
import mysql from "mysql2/promise"

import dotenv from "dotenv";
dotenv.config();

async function connect() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'fruit-basket-db'
});

  console.log('Connected to MySQL!');

  return connection;
}

const connection = await connect();
var app = express();

app.get('/', function(req, res) {
        res.send({'message': 'Hello'});
});

app.listen(80, function () {
        console.log('Node app is running on port 80');
});