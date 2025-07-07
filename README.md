## Installation steps (to be simplified)
- `npm i` in the root of workspaces
- cd `backend`
- create `.env` file, add `DATABASE_URL="file:./dev.db"`
- run `npx prisma migrate dev --name init`

## Run
`npm run dev`

### Frontend http://localhost:5173
### Backend http://localhost:4000

### Tradeoffs
- using `shared` folder to store prisma generated files (a bit too much work to set up in node_modules, due to hoisted node_modules for workspaces)
- deleting only one product at a time, seemed a simpler solution that fits the requirements
- no API security, userId (anonymous users) will be handled on the frontend in localStorage, good enough for a tech task, silly for a serious production app
- considering I would like it to be fairly functional in a few hours of development, not much effort went into automated testing
- nothing super fancy on the backend, not much time for dependency injections or better logging tools

### Quirks
- to be continued