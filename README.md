## Installation
Tested on node v.22.17.0

- `npm i`
- `npm run setup-local` (run from root of the repository)
## Run the app
`npm run dev`

## Hosted on ports
### Frontend http://localhost:5173
### Backend http://localhost:4000

### Tradeoffs
- using `shared` folder to store prisma generated files (a bit too much work to set up in node_modules, due to hoisted node_modules for workspaces)
- deleting only one product at a time, seemed a simpler solution that fits the requirements
- no API security, userId (anonymous users) will be handled on the frontend in localStorage, good enough for a tech task, silly for a serious production app
- considering I would like it to be fairly functional in a few hours of development, not much effort went into automated testing
- nothing super fancy on the backend, not much time for dependency injections or better logging tools
- error display (UX) isn't the best, room for improvement
- handling of differently shaped CSV's (isn't really handled) can be drastically improved

### Quirks
- Decided to hide description (as it is optional) on smaller screens
  - There is a better way of dealing with it, run out of time to manage it better
- DataGrid component resize is funky, letting that be (time constraint)
  - destroying and reinitializing the entire DataGrid on each resize, sad, but MUI charges for `useGridApiRef()` usage
- not best UX when you already have a valid csv loaded in the input (and uploaded to DB) and then load unsupported file
  - doubled up past success "notification" & "error" at the same time