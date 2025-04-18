import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from "../context/AuthContext.jsx";

const GameHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGameHistory = async () => {
      if (!user?.id) {
        setError('Please log in to view game history');
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('https://api.spamdetection.click/history', {
          params: { userId: user.id }
        });
        
        const gameHistory = Array.isArray(response.data) ? response.data : [];
        console.log('Game history data:', gameHistory);
        setHistory(gameHistory);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err);
        setError('Failed to load game history');
        setLoading(false);
      }
    };

    fetchGameHistory();
  }, [user]);

  // Format time to display as minutes:seconds if over 60 seconds
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.round(milliseconds / 1000);
    
    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    } else {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}m ${seconds}s`;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Ensure history is an array before rendering
  const gameHistory = Array.isArray(history) ? history : [];

  return (
    <Box sx={{ mt: 4, mb: 4, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'left' }}>
        Game History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Date</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell align="right">Correct Answers</TableCell>
              <TableCell align="right">Total Questions</TableCell>
              <TableCell align="right">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gameHistory.length > 0 ? (
              gameHistory.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>
                    {new Date(game.played_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell align="right">{game.score}</TableCell>
                  <TableCell align="right">{game.correct_answers}</TableCell>
                  <TableCell align="right">{game.total_questions}</TableCell>
                  <TableCell align="right">{formatTime(game.completion_time)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" sx={{ py: 2 }}>
                    No games played yet
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GameHistory; 