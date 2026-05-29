# Welcome to Ripple
## How the project will flow
1. Each of the mentees has to create branch for each of the issues which will be later merged into the main branch
2. When a group of issues are made, some issues might be much easier than others. The mentees are expected to take the issues such that the total load for the week is approx same for both the mentees
## Guidlines while making commits
It is highly recommended that the commit message is written seriously. It doesnt have to be elaborate, but any information that can help to understand the commit should be given in the commit message.
## Regarding information for backend and frontend
It might become difficult for understanding how the routes are working in frontend and backend. therefore, We will be adding sections regarding the how the routes will be working


### Backend
The backend structure is as follows:

```
server/
├── .env
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
├── controller/
│   ├── auth.controller.js
│   ├── direct_chat.controller.js
│   ├── direct_chat_messages.js
│   ├── group_chat.controller.js
│   └── group_chat_messages.js
├── db/
│   └── postgres.js
├── middleware/
│   ├── auth.middleware.js
│   ├── campusOnly.middleware.js
│   ├── groupchat.middleware.js
│   └── socket.middleware.js
├── routes/
│   ├── auth.routes.js
│   └── chat.routes.js
├── services/
│   ├── createUsername.service.js
│   ├── nodemailer.services.js
│   ├── socket.services.js
│   └── username.service.js
├── socket/
│   └── index.js
└── utilities/
    └── jwt.js
```