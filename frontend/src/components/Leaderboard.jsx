import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const MotionCard = motion(Card);

// Sample data
const leaderboardData = {
  allTime: [
    { rank: 1, name: "Spam Master", score: 100, games: 10 },
    { rank: 2, name: "Email Guardian", score: 95, games: 8 },
    { rank: 3, name: "Cyber Detective", score: 90, games: 12 },
    { rank: 4, name: "Spam Fighter", score: 85, games: 7 },
    { rank: 5, name: "Email Hero", score: 80, games: 9 },
  ],
  weekly: [
    { rank: 1, name: "Spam Master", score: 100, games: 5 },
    { rank: 2, name: "Email Guardian", score: 95, games: 4 },
    { rank: 3, name: "Cyber Detective", score: 90, games: 6 },
    { rank: 4, name: "Spam Fighter", score: 85, games: 3 },
    { rank: 5, name: "Email Hero", score: 80, games: 4 },
  ],
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <StarIcon sx={{ color: '#FFD700' }} />;
    if (rank === 2) return <StarIcon sx={{ color: '#C0C0C0' }} />;
    if (rank === 3) return <StarIcon sx={{ color: '#CD7F32' }} />;
    return <StarBorderIcon />;
  };

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

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Player</TableCell>
                  <TableCell align="right">Score</TableCell>
                  <TableCell align="right">Games Played</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(tabValue === 0 ? leaderboardData.allTime : leaderboardData.weekly).map((player) => (
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
                        {player.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                        {player.score}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography>{player.games}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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
        </CardContent>
      </MotionCard>
    </Box>
  );
};

export default Leaderboard; 