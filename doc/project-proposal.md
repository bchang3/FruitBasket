# Trivia Basket Project Proposal
<img width="1200" alt="Screenshot 2025-02-16 at 2 53 28 PM" src="https://github.com/user-attachments/assets/5f1d3945-0925-45ef-b247-0976ed638f26" />

## Designs
[Basic Wireframes/UI](https://www.figma.com/design/FKE9jezoe8lrA1GmFWBS1p/Designs?node-id=0-1&p=f)

## Project Summary
_Trivia Basket_ is a fruit-themed trivia platform where players can answer questions, play single or multiplayer trivia, practice for different categories, and track their performance statistics over time. Players can configure their trivia sessions by adjusting the timing for each round, modifying lobby size, and selecting which question categories to include. In between rounds, question statistics (e.g. percentage of people that answered correctly) will be displayed, and players will earn points for answering questions correctly.

Over time, players will build up their player profiles. A player can see their best category, worst category, answer accuracy, and an interactive radar chart of their performance across all categories. They can also “bookmark” questions from during their trivia sessions as flashcards to save interesting facts or for future practice. _Trivia Basket_ offers a modern twist on trivia, allowing fully customizable trivia games and providing tools for players to improve and gain performance insights!

## Project Description 
_Trivia Basket_ aims to offer a unique trivia-playing experience by combining multiplayer trivia with advanced player performance insights and study tools. 


On the user side, players will have a username and password they use to sign in to access their account. There are three player pages: the profile, flashcards, and stats. 
- The player profile will allow players to change their username/password, as well as select their character (fruit) icon and icon background color. 
- The player flashcard page displays a table of previous trivia questions that players have bookmarked. From the table, players can search through saved questions, or select questions to start a custom practice session to review. 
- The stats page will house all player data visualizations and metrics, such as their best and worst categories, their overall accuracy, number of game wins, total number of questions answered, average time taken to answer questions, and total number of points earned. The main display will be a radar chart that shows player strength across all categories and acts as a “fingerprint” of the player’s trivia style. 


For the actual trivia game, there are four game stages that cycle continuously: question, selection, answer, and leaderboard.
- For the question stage, a randomly selected question will be displayed to all players.
- For the selection stage, players will select an answer choice (either true-false or multiple-choice).
- For the answer stage, the correct answer will be displayed, and players will be given the option to bookmark the question. Global question statistics will also be displayed (e.g. 54% of users got this question correct). 
- For the leaderboard stage, points will be awarded based on answer streaks and how fast players answered the question.  The point rankings will be displayed in a simple table.

In addition, there will be an initial game settings page where the number of rounds, round time, number of players, question categories, and question difficulty can be set. 

## Creative Component 
_Trivia Basket_ has two main creative components: multiplayer mode and player performance data visualizations.


In the multiplayer mode, players can configure lobby settings like the maximum number of players, time for each round, categories to select questions from, and question difficulty. The creator of the game will be able to invite other players to the game with a randomly generated join code and link. There will also be a custom point system where players who answer first or have answer streaks will earn more points. To implement multiplayer mode, we plan to use _WebSockets_ to support real-time communication between players and the server and simultaneously progress the game state for multiple players (lobbies).  Multiplayer mode will also support session caching to reconnect players to the same game if they get disconnected. 

For player data visualizations, each player will have a “profile” page where they can see an interactive radar chart of their performance across different categories. For example, a player would be able to see that their accuracy with fine arts and science questions is twice as high as their accuracy with mythology and history. The radar chart will allow players to set a time frame so they can see their performance across different days or months and visualize their progress.  To implement the radar chart, we plan to use _Chart.JS_ paired with database queries to select relevant data. The player profile page will also have other game stats like overall accuracy, total number of questions answered, average time taken to answer questions, and total number of points earned. 

## Usefulness
_Trivia Basket_ allows users to play trivia with questions from a wide variety of categories without having to search the web for them. With _Trivia Basket_, it only takes a few seconds to start a trivia game. In addition, no other trivia websites offer the player metrics that _Trivia Basket_ displays. By showing players which categories they are strong or weak in, they can improve by practicing and tracking their progress over time. With the practice and flashcard feature, _Trivia Basket_ becomes more than a game, encouraging people to learn and expand their knowledge.


Similar applications to _Trivia Basket_ include _Quizlet_, _Kahoot!_, and _Trivia Crack_. _Quizlet_ and _Kahoot_ fall more on the educational side of trivia, designed to primarily be used in the context of courses. On the other hand, _Trivia Crack_ is a trendy game that focuses more on the social and competitive aspects of trivia. _Trivia Basket_ combines these two approaches, offering a fun, social, fruit-themed trivia experience like _Trivia Crack_, as well as a way for people to learn and improve like _Quizlet_ and _Kahoot!_. 

## Realness 
Currently, we have identified two candidate data sources for trivia questions.


### Open Trivia QA (Source: [GitHub](https://github.com/uberspot/OpenTriviaQA))
- The Open Trivia QA is a Creative Commons dataset containing trivia questions and answers classified by category.
- Questions appear in two formats, multiple-choice (A-D) or True-False. The advantage of this dataset is that plausible incorrect answers are provided along with the correct answer, allowing us to use the question directly.
- The questions are contained in .**txt** files grouped by category. They follow a standard format of **#Q** prefixing a new question, **^** prefixing the correct answer, and each answer option appearing on a new line below.

```
#Q Three of these animals hibernate. Which one does not?
^ Sloth
A Mouse
B Sloth
C Frog
D Snake
```

- There are **~45,000** total questions and **22** categories. 
We will have to parse the .txt files to extract the questions, but this should not be an issue since the overall data quality is good and follows a standard format. In addition, the questions are already grouped by category and have alternate answer choices. 


### Trivia QA (Source: [University of Washington](https://nlp.cs.washington.edu/triviaqa/))
- The Trivia QA is a collection of **95K** question-answer pairs designed for NLP.
- Questions have an assigned question ID, question, answer (an array of answers + aliases), and evidence sources (e.g. a link to a Wikipedia article).
- The questions are contained in JSON files with the attributes QuestionSource, QuestionId, Question, Answer, Aliases.
- This dataset is designed for natural language processing and doesn’t have features like questions organized by category or alternate answer options. However, it does provide answer aliases (such as Sunset Blvd, Sunset Boulevard, etc.). This dataset is better suited for a free-response-based trivia game where user answers are compared to the correct answers. In addition, we would need to classify questions by category, which would require us to write and train a classification model (which would likely be out of scope for this project). 

## Functionality 

[Figma Designs](https://www.figma.com/design/FKE9jezoe8lrA1GmFWBS1p/Designs?node-id=0-1&p=f)

### Player Profile
- #### Player Statistics
  - A page that displays the user’s trivia statistics, such as their best and worst categories.
  - This page will also feature a radar chart with a unique category on each axis and will update the graph based on the time period selected (past 30 days, all time, etc.). Users can access this page by clicking their profile picture on the webpage.
  - All performance statistics will be computed with real-time queries to fetch relevant data to ensure that statistics are always up to date (vs. storing player statistics directly).
- #### Flashcards
  - A page designated to creating “flashcards” (saved trivia questions) for reviewing and improving at trivia. 
  - A player’s flashcards will be stored as foreign keys referencing question IDs from questions in the trivia database. 
  - Users will be able to **create, delete, or browse** through flashcards using a search bar.
  - When searching, they can set filters on their cards, such as by difficulty (based on overall user accuracy) and category.
  - Users can press a “practice” button to review their flashcards, in which they will be presented with questions and then type in their answers.
- #### Profile Settings
  - A page for the user to change their profile fruit icon and icon background color. They can also view and change their username and password on this page. Making changes to a player profile will update the corresponding row in the user database. 
### Games/Trivia Sessions
  - On the home page, users can select to play either a single-player or multiplayer game. Both game modes will look the same, but single-player mode will skip the lobby creation step. 
  - Questions will be selected by **querying the trivia database** with the given game settings (categories, difficulty, etc.).
  - The user will be presented with a question page and then provided a list of options to choose as their answers (all as separate buttons). 
  - Players have the option to save questions as flashcards (which will appear in their account). 
  - In multiplayer mode, there will also be a leaderboard displayed at the end of each question.
  - Throughout the game, user and question data will be **updated** (e.g. lifetime question accuracy, questions saved for each user, etc.). 


## Work Distribution
_Trivia Basket_ can be divided into four main full-stack issues. 
- #### Dataset parsing, trivia question/answer/category relations, and trivia game flow
  - Assignee: **Benjamin Chang (bchang)**
  - Backend Tasks:
    - Parse trivia questions dataset and create/insert to relevant relations in DB 
    - Write queries to select/filter through question/answer tables to fetch questions that match game settings.
    - Write queries to update question statistics (overall accuracy across users/difficulty)
    - Write queries to save to game history relation (save players, player points, game start and end time, overall player accuracy, etc.)
    - Use WebSockets to create player lobbies and progress and maintain game state (cycle through question/answers and track player points).
  - Frontend Tasks:
    - Display game stage cycle (e.g. display current question, answer, leaderboard, etc.)

- #### User accounts, login page, profile information (username, password, icon, etc.)
  - Assignee: **Karan Kashyap (karan10)**
  - Backend Tasks:
    - Create a user account relation to store username, password, player fruit icon, player icon background color.
    - Write queries to check if a user with given username/password exists and either log them in or report invalid credentials.
    - Write queries for users to update username/password or other player settings like character icon. 
    Implement cookie/session caching to keep users logged in for a set amount of time before requiring log in again. 
  - Frontend Tasks:
    - Sign up/Log-in page
    - Player profile page
    - Edit username/password, icon, icon background interface

- #### Flashcards, “save question” functionality, flashcards table display, flashcard search/filtering
  - Assignee: **Vraj Patel (vrajp2)**
  - Backend Tasks:
    - Create a relation to store flashcards for a user (question ID, user ID foreign keys).
    - Write queries to bookmark questions for a user and insert to flashcards relation.
    - Write queries to search/filter through flashcards (to enable users to browse their flashcards)
  - Frontend Tasks:
    - Save question as flashcard interface (in game flow)
    - Search/filter through flashcards interface
    - Flashcard table display
    - Select flashcards within table to start a practice session or batch delete

- #### User metrics, stats page, radar chart, games won, best/worst category, overall accuracy.
  - Assignee: **Shoorsen Gandhi (sgandhi)**
  - Backend Tasks:
    - Write query to compute overall player question accuracy (from game history, user, question relations)
    - Write queries to compute best/worst player categories (from game history, user, question relations)
    - Write queries to fetch data for radar chart (player accuracy over all question categories over a given timeframe). 
    - Write queries to compute number of total games played for a user, number of total questions answered, win rate for multiplayer games, etc.
  - Frontend Tasks:
    - Player performance page to display user metrics
    - Radar chart with interactive time frame controls (e.g. player performance over past month, three months, etc.)








