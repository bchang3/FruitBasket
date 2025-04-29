Proposal and Results

*  In our original plan for the proposal, we intended for users to have a single player practice mode using their flashcards. This feature is not included in our final project, but users can still view and review their flashcards. In terms of overall direction and theme, our project has remained relatively the same as our original goals. We also added an elo for each user.

*  Overall, our application was successful at allowing players to create an account, play trivia with other people, and review flashcards on their own. These core features alone make the application useful for someone interested in learning and studying trivia questions.

 Schema Adjustments and Data Usage

* **Added table GameQuestions** so that our transaction for initializing a game would be complete. GameQuestions allows the transaction to store the questions which will be used for a specific Game. In GameQuestions, we stored the gameID and questionID as foreign keys, and as a pair, they make up the primary key for the table (to prevent duplicate questions appearing in a single game).   
* **Added numQuestions** **column** (int) to Game, so users can successfully specify the number of questions they want per game.  
* **Added isFinished column** to Game, so our trigger to update user elos would know when to execute.  
* **Added elo column** to User, so we can calculate the user elo.  
* We did not change the source of data for our application.

*  For our UML diagram, we would need to add numQuestions and isFinished attributes to Game, and the elo attribute to User. We would also need to specify the foreign key constraint for questionID and gameID in GameQuestions using weak entity set notation (connecting GameQuestions to Question and Game tables).

Technical Challenges

* Shoorsen: I think one technical challenge I had was with the Google Cloud Console and starting an instance which had been stopped. I think when I first started the instance, it was very intuitive and there was a button I pressed that started it. I had to restart the instance using the gcloud terminal using the command: gcloud sql instances patch INSTANCE\_NAME \\ \--activation-policy=ALWAYS  
* Benji: Definitely the websocket server for multiplayer. FIguring out how to broadcast a unified gamestate to multiple people at once, as well as hooking it up with the backend was pretty challenging.  
* Karan: Raw sql queries were difficult for us and using each sql query raw was challenging in terms of getting the data out in the right format.  
* Vraj: Implementing search was most difficult and figuring out react to figure out the state.


  
Improvement and Labor Divison

* An area of improvement for our application are in the calculation of user elo and in the flashcard reviewal system. For user elo, we could use a complex algorithm to compute a more accurate value. Users that care about their elo and rank in the game would appreciate a more robust ranking system. For flashcard-review, we could also incorporate a spaced repetition feature. Users would no longer have to schedule their own flashcard reviewing through the priority system, and would instead review each fact at optimally spaced intervals.  
    
*  Overall, we stuck to the final division of labor laid out in the proposal pretty well, with Benji focusing on data parsing and trivia flow, Karan working on user account info, Vraj working on flashcard functionality, and Shoorsen focusing on statistics. Benji also helped extra with the UI, account info, and multiplayer mode, and Shoorsen did a little work with the SQL. Teamwork seemed to flow naturally for us, and we did not have any major issues with collaboration.  
  