import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useAuth } from '../context/AuthContext';

const MotionCard = motion(Card);

const securityQuestions = [
  "What is your mother's maiden name?",
  "What was your first pet's name?",
  "What was the name of your first school?",
  "What is your favorite book?",
];

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 10) {
      setError('Password must be at least 10 characters long');
      return;
    }
     // Send the registration data to the backend
     try {
      const response = await axios.post('https://api.spamdetection.click/register', formData);

      if (response.data.success) {
        // If registration is successful, attempt to log in automatically
        try {
          const loginResponse = await axios.post('https://api.spamdetection.click/login', {
            email: formData.email,
            password: formData.password
          });
          
          if (loginResponse.data.success) {
            // Store user data in auth context
            login(loginResponse.data.user || {
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName
            });
            
            // Navigate to home page
            navigate('/');
          } else {
            // If auto-login fails, still go to login page
            navigate('/login');
          }
        } catch (loginErr) {
          console.error('Auto-login error:', loginErr);
          // If auto-login fails, go to login page
          navigate('/login');
        }
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred during registration. Please try again later.');
    }
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
        sx={{ maxWidth: 600, width: '100%' }}
      >
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <SecurityIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" gutterBottom>
              Join Spam Detective!
            </Typography>
            <Typography color="text.secondary">
              Create your account to start learning about spam detection
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: 'primary.main' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: 'primary.main' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Security Question</InputLabel>
                  <Select
                    name="securityQuestion"
                    value={formData.securityQuestion}
                    onChange={handleChange}
                  >
                    {securityQuestions.map((question, index) => (
                      <MenuItem key={index} value={question}>
                        {question}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Security Answer"
                  name="securityAnswer"
                  value={formData.securityAnswer}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <QuestionAnswerIcon sx={{ mr: 1, color: 'primary.main' }} />,
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Account
            </Button>
          </form>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ color: 'primary.main' }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </MotionCard>
    </Box>
  );
};

export default Register;
