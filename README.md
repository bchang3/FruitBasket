# Fruit Basket

### Codebase Structure
#### Frontend (trivia-basket-frontend/)
```
- public                    (Static images and files to be served to client)
- src                       (components, pages, and all application code)
| - db                      (Prisma client initialization)
| - lib                     (Shared code including components, email templates, and utility functions)
    | - components          (React components)
    | - utils               (utility functions)
| - pages                   (Next.js pages directory, file-based routing)
| - styles                  (Global CSS file)
| - utils                   (utility functions)
| - middleware.ts           (Middleware to handle account page authorization)
```

#### Backend (trivia-basket-backend/)
```
| - server.ts           (CRUD endpoints)
```
#### Game Server (trivia-basket-game-server/)
```
| - gameServer.ts           (WebSocket server for game lobbies)
```
#### Seeding (database-seeding)
| - categories.csv          (CSV of question categories)
| - questionOptions.csv     (CSV of question options)
| - questions.csv           (CSV of trivia questions)
| - seed.ts                 (Seed script to add questions, users, and games to the database)

