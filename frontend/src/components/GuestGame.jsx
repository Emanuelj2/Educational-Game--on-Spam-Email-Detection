import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

const GuestGame = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Fetch questions from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/questions');
        setQuestions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !loading) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !loading) {
      handleTimeUp();
    }
  }, [timeLeft, gameOver, loading]);

  const handleAnswer = (selectedAnswer) => {
    setSelectedAnswer(selectedAnswer);
    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowFeedback(false);
        setTimeLeft(30);
        setSelectedAnswer(null);
      } else {
        setGameOver(true);
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
      setSelectedAnswer(null);
    } else {
      setGameOver(true);
    }
  };

  const calculateProgress = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading questions...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Go Back
        </Button>
      </Box>
    );
  }

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
            <AccountCircleIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Thanks for Playing!
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Want to save your progress and compete with others?
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ mt: 2, mr: 2 }}
            >
              Create Account
            </Button>
            <Button
              variant="outlined"
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
      {questions.length > 0 ? (
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
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            No questions available. Please try again later.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Go Back
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GuestGame; 