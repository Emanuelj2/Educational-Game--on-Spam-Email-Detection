import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Grid,
  Paper,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';

const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

// Sample questions - in a real app, these would come from your backend
const questions = [
  {
    id: 1,
    question: "Which of these email addresses looks suspicious?",
    options: [
      "john.doe@company.com",
      "support@bank.com",
      "urgent.winner123@random.com",
      "teacher@school.edu"
    ],
    correctAnswer: 2
  },
  {
    id: 2,
    question: "What should you do if you receive an email asking for your password?",
    options: [
      "Send it right away",
      "Ignore it and delete it",
      "Reply asking for more details",
      "Forward it to friends"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Which of these is a common sign of a spam email?",
    options: [
      "Proper grammar and spelling",
      "Your name spelled correctly",
      "Lots of exclamation marks!!!",
      "A professional email address"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "What should you check before clicking a link in an email?",
    options: [
      "The color of the link",
      "The sender's email address",
      "The time of day",
      "The font size"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "Which of these is NOT a safe practice?",
    options: [
      "Using strong passwords",
      "Sharing passwords with friends",
      "Logging out after use",
      "Using different passwords for different accounts"
    ],
    correctAnswer: 1
  }
];

const Game = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft, gameOver]);

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      setShowFeedback(true);
    } else {
      setShowFeedback(true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowFeedback(false);
        setTimeLeft(30);
      } else {
        setGameOver(true);
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      setGameOver(true);
    }
  };

  const calculateProgress = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Amazing job! You're a Spam Detective Master!";
    if (percentage >= 60) return "Great work! You're getting better at spotting spam!";
    if (percentage >= 40) return "Keep practicing! You're learning!";
    return "Don't give up! Try again to improve your score!";
  };

  if (gameOver) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          p: 2,
        }}
      >
        <MotionCard
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          sx={{ maxWidth: 500, width: '100%' }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Game Over!
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              Your Score: {score}/{questions.length}
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              {getScoreMessage()}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Play Again
            </Button>
          </CardContent>
        </MotionCard>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        p: 2,
      }}
    >
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ maxWidth: 800, width: '100%' }}
      >
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <LinearProgress
              variant="determinate"
              value={calculateProgress()}
              sx={{ height: 10, borderRadius: 5, mb: 2 }}
            />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Typography variant="h6">
                  Question {currentQuestion + 1} of {questions.length}
                </Typography>
              </Grid>
              <Grid item>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimerIcon color="primary" />
                  <Typography variant="h6">{timeLeft}s</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h5" gutterBottom>
                {questions[currentQuestion].question}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                {questions[currentQuestion].options.map((option, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <MotionPaper
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        backgroundColor: showFeedback
                          ? index === questions[currentQuestion].correctAnswer
                            ? '#4CAF50'
                            : index === selectedAnswer
                            ? '#f44336'
                            : '#f5f5f5'
                          : '#f5f5f5',
                        color: showFeedback
                          ? index === questions[currentQuestion].correctAnswer ||
                            index === selectedAnswer
                            ? 'white'
                            : 'inherit'
                          : 'inherit',
                      }}
                      onClick={() => !showFeedback && handleAnswer(index)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {showFeedback && (
                          <>
                            {index === questions[currentQuestion].correctAnswer && (
                              <CheckCircleIcon />
                            )}
                            {index === selectedAnswer &&
                              index !== questions[currentQuestion].correctAnswer && (
                                <CancelIcon />
                              )}
                          </>
                        )}
                        <Typography>{option}</Typography>
                      </Box>
                    </MotionPaper>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </MotionCard>
    </Box>
  );
};

export default Game; 