import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Upload as UploadIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Resume Analysis',
      description: 'Upload and analyze resumes for potential biases in the recruitment process',
      icon: <UploadIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/upload'),
    },
    {
      title: 'Bias Detection',
      description: 'Identify and measure various types of biases in recruitment decisions',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/analysis'),
    },
    {
      title: 'About the Project',
      description: 'Learn more about bias-aware recruitment and our mission',
      icon: <InfoIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/about'),
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          mt: 4,
          mb: 6,
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          BiasAware Recruitment
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Promoting Fair and Ethical AI in Recruitment
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<UploadIcon />}
          onClick={() => navigate('/upload')}
          sx={{ mt: 2 }}
        >
          Get Started
        </Button>
      </Box>

      {/* Features Grid */}
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  cursor: 'pointer',
                },
              }}
              onClick={feature.action}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Key Benefits */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 6,
          mb: 4,
          backgroundColor: 'primary.light',
          color: 'primary.contrastText',
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Key Benefits
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Fairness
            </Typography>
            <Typography variant="body1">
              Ensure equal opportunities for all candidates regardless of gender, race, or age
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Transparency
            </Typography>
            <Typography variant="body1">
              Clear insights into how recruitment decisions are made and potential biases
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Compliance
            </Typography>
            <Typography variant="body1">
              Stay compliant with anti-discrimination laws and ethical hiring practices
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Call to Action */}
      <Box
        sx={{
          textAlign: 'center',
          mt: 6,
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Make Your Recruitment Process More Fair?
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<UploadIcon />}
          onClick={() => navigate('/upload')}
          sx={{ mt: 2 }}
        >
          Start Analyzing Resumes
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard; 