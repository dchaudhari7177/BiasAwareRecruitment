import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import LanguageIcon from '@mui/icons-material/Language';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const BiasAnalysis = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('analysisResults');
    if (!storedData) {
      navigate('/upload');
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setAnalysisData(parsedData);
    } catch (err) {
      console.error('Error parsing analysis results:', err);
      setError('Error loading analysis results');
    }
  }, [navigate]);

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!analysisData) {
    return (
      <Container maxWidth="md">
        <LinearProgress sx={{ mt: 4 }} />
      </Container>
    );
  }

  // Extract data with safe fallbacks
  const score = analysisData.score || 0;
  const confidence = analysisData.confidence || 0;
  const features = analysisData.features || {};
  const parsedData = analysisData.parsed_data || {};
  const personalInfo = parsedData.personal_info || {};

  // Prepare metrics data
  const metricsData = [
    {
      name: 'Education',
      score: features.education_level || 0,
      max: 4,
    },
    {
      name: 'Experience',
      score: Math.min(features.years_experience || 0, 10),
      max: 10,
    },
    {
      name: 'Skills',
      score: (features.skills_match || 0) * 100,
      max: 100,
    },
    {
      name: 'Projects',
      score: (features.project_complexity || 0) * 33.33,
      max: 100,
    },
  ];

  // Prepare skills radar data
  const skillCategories = features.skill_categories || {};
  const radarData = Object.entries(skillCategories).map(([category, skills]) => ({
    category: category.replace('_', ' ').toUpperCase(),
    value: skills.length,
  }));

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resume Analysis Results
        </Typography>

        {/* Personal Information */}
        {personalInfo.name && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography>{personalInfo.name}</Typography>
                  </Box>
                </Grid>
                {personalInfo.email && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 1 }} />
                      <Typography>{personalInfo.email}</Typography>
                    </Box>
                  </Grid>
                )}
                {personalInfo.phone && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ mr: 1 }} />
                      <Typography>{personalInfo.phone}</Typography>
                    </Box>
                  </Grid>
                )}
                {personalInfo.location && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon sx={{ mr: 1 }} />
                      <Typography>{personalInfo.location}</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        )}

        <Grid container spacing={4}>
          {/* Overall Score */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Assessment
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h3" color="primary">
                    {Math.round(score)}%
                  </Typography>
                  {score > 70 ? (
                    <CheckCircleIcon color="success" sx={{ ml: 2, fontSize: 40 }} />
                  ) : (
                    <WarningIcon color="warning" sx={{ ml: 2, fontSize: 40 }} />
                  )}
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Confidence: {Math.round(confidence)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Skills Radar Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Skills Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis />
                      <Radar
                        name="Skills"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Metrics Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Candidate Metrics
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" name="Score" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Detailed Analysis */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detailed Analysis
                </Typography>
                <Grid container spacing={3}>
                  {/* Education */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SchoolIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" color="primary">
                        Education
                      </Typography>
                    </Box>
                    <List>
                      {parsedData.education?.map((edu, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={edu} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>

                  {/* Experience */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <WorkIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" color="primary">
                        Experience
                      </Typography>
                    </Box>
                    <List>
                      {parsedData.experience?.map((exp, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={exp} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>

                  {/* Skills */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CodeIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" color="primary">
                        Skills
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {parsedData.skills?.map((skill, index) => (
                        <Chip key={index} label={skill} />
                      ))}
                    </Box>
                  </Grid>

                  {/* Languages */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LanguageIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" color="primary">
                        Languages
                      </Typography>
                    </Box>
                    <List>
                      {parsedData.languages?.map((lang, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={lang} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>

                  {/* Certifications */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CardGiftcardIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" color="primary">
                        Certifications
                      </Typography>
                    </Box>
                    <List>
                      {parsedData.certifications?.map((cert, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={cert} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/upload')}
            startIcon={<AssessmentIcon />}
          >
            Analyze Another Resume
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BiasAnalysis; 