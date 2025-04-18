import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import GuestGame from './components/GuestGame';
import Profile from './pages/Profile';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Friendly green
      light: '#81C784',
      dark: '#388E3C',
    },
    secondary: {
      main: '#FF9800', // Warm orange
      light: '#FFB74D',
      dark: '#F57C00',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: [
      'Comic Sans MS',
      'Comic Sans',
      'Chalkboard SE',
      'cursive',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#4CAF50',
      fontFamily: [
        'Comic Sans MS',
        'Comic Sans',
        'Chalkboard SE',
        'cursive',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Arial',
        'sans-serif'
      ].join(','),
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#FF9800',
      fontFamily: [
        'Comic Sans MS',
        'Comic Sans',
        'Chalkboard SE',
        'cursive',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Arial',
        'sans-serif'
      ].join(','),
    },
    h4: {
      fontFamily: [
        'Comic Sans MS',
        'Comic Sans',
        'Chalkboard SE',
        'cursive',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Arial',
        'sans-serif'
      ].join(','),
    },
    h5: {
      fontFamily: [
        'Comic Sans MS',
        'Comic Sans',
        'Chalkboard SE',
        'cursive',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Arial',
        'sans-serif'
      ].join(','),
    },
    button: {
      textTransform: 'none',
      borderRadius: '25px',
      padding: '10px 20px',
      fontFamily: [
        'Comic Sans MS',
        'Comic Sans',
        'Chalkboard SE',
        'cursive',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Arial',
        'sans-serif'
      ].join(','),
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/game" element={<Game />} />
                <Route path="/guest-game" element={<GuestGame />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
