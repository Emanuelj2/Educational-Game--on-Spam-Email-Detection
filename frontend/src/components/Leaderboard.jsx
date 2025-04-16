import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useAuth } from '../context/AuthContext';

const MotionCard = motion(Card);

const Leaderboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [tabValue]); // Fetch when tab changes

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const type = tabValue === 0 ? 'allTime' : 'weekly';
      const response = await axios.get(`http://localhost:8080/leaderboard?type=${type}`);
      setLeaderboardData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <StarIcon sx={{ color: '#FFD700' }} />;
    if (rank === 2) return <StarIcon sx={{ color: '#C0C0C0' }} />;
    if (rank === 3) return <StarIcon sx={{ color: '#CD7F32' }} />;
    return <StarBorderIcon />;
  };

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          p: 2,
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchLeaderboardData}>
          Try Again
        </Button>
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
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <EmojiEventsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" gutterBottom>
              Leaderboard
            </Typography>
            <Typography color="text.secondary">
              See who's the best at spotting spam!
            </Typography>
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="All Time" />
            <Tab label="This Week" />
          </Tabs>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Player</TableCell>
                    <TableCell align="right">Points</TableCell>
                    <TableCell align="right">Games Played</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboardData.map((player) => (
                    <TableRow
                      key={player.rank}
                      sx={{
                        backgroundColor: player.rank <= 3 ? 'rgba(76, 175, 80, 0.1)' : 'inherit',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getRankIcon(player.rank)}
                          <Typography>{player.rank}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {player.playerName}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                          {player.totalPoints}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>{player.gamesPlayed}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {leaderboardData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color="text.secondary">
                          No players found. Be the first to play!
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!isLoggedIn && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Want to compete? Create an account and start playing!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/register')}
              >
                Create Account
              </Button>
            </Box>
          )}
        </CardContent>
      </MotionCard>
    </Box>
  );
};

export default Leaderboard; 