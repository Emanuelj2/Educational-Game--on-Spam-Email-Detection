import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import GameHistory from '../components/GameHistory';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            User Information
          </Typography>
          <Typography variant="body1">
            Email: {user?.email}
          </Typography>
        </Paper>
        
        <GameHistory />
      </Box>
    </Container>
  );
};

export default Profile; 