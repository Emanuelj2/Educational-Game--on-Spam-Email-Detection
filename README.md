# Spam Detective: Educational Game on Email Security

Spam Detective is an interactive educational game designed to teach players how to identify and avoid spam emails. The application provides an engaging way to learn about email security through quiz-based gameplay.

## Access to deployed game: 
https://spamdetection.click

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Game Mechanics](#game-mechanics)

## Features

- **Interactive Quiz Game**: Answer questions about email security and spam detection
- **Educational Content**: Learn how to identify phishing attempts and suspicious emails
- **Scoring System**: Track your performance with a dynamic scoring system
- **Leaderboard**: Compare your results with other players
- **Game History**: View your past game performances and track improvement
- **User Accounts**: Create an account to save your progress and participate in the leaderboard
- **Guest Mode**: Play without an account for casual learning
- **Mobile Responsive**: Enjoy the game on any device

## Tech Stack

### Frontend
- React.js
- Material-UI
- Framer Motion
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MySQL
- Winston 
- Bcrypt.js

### Database
- MySQL (AWS RDS)

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MySQL database

### Backend Setup

1. Clone the repository:
   
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   DB_HOST=your_database_host
   DB_PORT=3306
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=spam_detective
   PORT=8080
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```

### Frontend Setup

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Playing the Game

1. **Register/Login**: Create an account or log in to track your progress and appear on the leaderboard
2. **Start Game**: Click the "Play Game" button on the home page
3. **Answer Questions**: Select the correct option for each question within the time limit
4. **View Results**: See your final score and performance at the end of the game
5. **Check Leaderboard**: View how your score compares to other players
6. **Review Game History**: Check your past game performances in your profile


## Game Mechanics

### Scoring System
- Each correct answer earns points
- Final score is calculated as a percentage of correct answers
- Time taken to complete the game is also recorded

### Question Types
The game includes various types of questions about:
- Common email scams
- Phishing attempts
- Suspicious links and attachments
- Email security best practices
- Red flags in spam emails
