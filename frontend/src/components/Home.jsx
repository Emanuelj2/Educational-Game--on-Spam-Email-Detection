import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SecurityIcon from '@mui/icons-material/Security';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContext';

const MotionCard = motion(Card);

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h1" gutterBottom>
          {isLoggedIn ? `Welcome back to Spam Detective!` : 'Welcome to Spam Detective!'}
        </Typography>
        
        {isLoggedIn && (
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {user?.email}
          </Typography>
        )}
        
        <Typography variant="h5" color="text.secondary" paragraph>
          Learn how to spot spam emails in a fun and interactive way!
        </Typography>
      </motion.div>

      <Box sx={{ my: 4 }}>
        {isLoggedIn ? (
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={() => navigate('/game')}
            sx={{ mr: 2 }}
          >
            Start Playing
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={() => navigate('/guest-game')}
              sx={{ mr: 2 }}
            >
              Play as Guest
            </Button>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              startIcon={<SchoolIcon />}
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
          </>
        )}
      </Box>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <MotionCard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardContent>
              <SecurityIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Learn Spam Detection
              </Typography>
              <Typography color="text.secondary">
                Master the art of identifying spam emails through fun interactive lessons
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardContent>
              <EmojiEventsIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Compete & Win
              </Typography>
              <Typography color="text.secondary">
                Challenge yourself and compete with others on the leaderboard
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardContent>
              <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Track Progress
              </Typography>
              <Typography color="text.secondary">
                {isLoggedIn 
                  ? 'View your learning journey and see your improvement over time'
                  : 'Create an account to save your progress and track improvement'}
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 