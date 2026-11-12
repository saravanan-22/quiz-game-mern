# 🧠 MERN Quiz App

A full-stack quiz game where users sign up, pick a category, answer timed questions and track their scores.

**▶ Live demo: [quizgame2023.vercel.app](https://quizgame2023.vercel.app/)**

<p>
  <img src="https://raw.githubusercontent.com/saravanan-22/react-portfolio/main/src/images/quiz_image1.jpg" width="49%" alt="Quiz home" />
  <img src="https://raw.githubusercontent.com/saravanan-22/react-portfolio/main/src/images/quiz_image2.jpg" width="49%" alt="Quiz question" />
</p>

## Features
- 🔐 Sign up, log in, reset password, edit profile (with profile picture) and delete account
- 🗂️ 10 categories: General Knowledge, Sports, Computers, History, Politics, Art, Science & Nature, Animals, Vehicles, Comics
- 🏆 Points system: current, previous and total scores saved per user
- 🌐 REST API built with Express + MongoDB

## Tech stack
**Frontend:** React · React Router · Material UI · React Bootstrap · Axios
**Backend:** Node.js · Express · MongoDB · Mongoose
**Deploy:** Vercel

## Project structure
```
client/   React frontend
server/   Express REST API (routes, controllers, Mongoose models)
```

## Run locally
```bash
git clone https://github.com/saravanan-22/mern-quiz-app.git
cd mern-quiz-app

# backend
cd server && npm install
# create server/.env with:  PORT=5000  CONNECTION_URL=<your MongoDB URI>
npm start

# frontend (new terminal)
cd client && npm install && npm start
```
