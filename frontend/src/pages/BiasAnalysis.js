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
  Tooltip,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
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
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import PublicIcon from '@mui/icons-material/Public';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled } from '@mui/material/styles';
import { pushDashboardActivity } from './Dashboard';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 60%, #dc004e 100%)',
  color: '#fff',
  padding: theme.spacing(6, 2, 4, 2),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  textAlign: 'center',
  marginBottom: theme.spacing(5),
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(24,28,36,0.92)',
  color: '#fff',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[6],
  padding: theme.spacing(3, 2),
  marginBottom: theme.spacing(3),
}));

const SectionHeader = ({ icon, title, badge }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
    <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mr: 2 }}>{title}</Typography>
    {badge}
  </Box>
);

const OfficialBadge = ({ label, color, icon }) => (
  <Chip
    label={label}
    color={color || 'primary'}
    size="small"
    icon={icon}
    sx={{ ml: 1, fontWeight: 600 }}
  />
);

function pushFairnessMetricsHistory(metrics) {
  const key = 'fairnessMetricsHistory';
  const history = JSON.parse(localStorage.getItem(key) || '[]');
  // Avoid duplicate for same timestamp/score
  if (!history.find(h => h.score === metrics.score && h.confidence === metrics.confidence)) {
    history.unshift({ ...metrics, timestamp: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(history.slice(0, 20)));
  }
}

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
      // Save fairness metrics to history
      const features = parsedData.features || {};
      pushFairnessMetricsHistory({
        education_level: features.education_level,
        years_experience: features.years_experience,
        skills_match: features.skills_match,
        project_complexity: features.project_complexity,
        score: parsedData.score,
        confidence: parsedData.confidence,
      });
      // Push dashboard activity
      pushDashboardActivity({ type: 'analysis', label: 'Bias analysis completed', time: 'just now' });
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
      <HeroSection>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Bias & Fairness Analysis
        </Typography>
        <OfficialBadge label="Verified by FATE" color="secondary" icon={<VerifiedIcon />} />
        <OfficialBadge label="Research-backed" color="primary" icon={<SchoolIcon />} />
        <OfficialBadge label="Official" color="info" icon={<StarIcon />} />
        <Typography variant="h6" sx={{ mt: 2, color: 'rgba(255,255,255,0.85)' }}>
          Transparent, ethical, and research-driven analysis of your resume and hiring data.
        </Typography>
      </HeroSection>

      {/* Personal Information */}
      {personalInfo.name && (
        <GlassCard>
          <SectionHeader icon={<PersonIcon />} title="Personal Information" badge={<OfficialBadge label="Private" color="default" icon={<InfoOutlinedIcon />} />} />
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', mb: 2 }} />
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
        </GlassCard>
      )}

      <Grid container spacing={4}>
        {/* Overall Score */}
        <Grid item xs={12} md={6}>
          <GlassCard>
            <SectionHeader icon={<AssessmentIcon />} title="Overall Assessment" badge={<OfficialBadge label="AI Scored" color="success" icon={<VerifiedIcon />} />} />
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', mb: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 900 }}>
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
          </GlassCard>
        </Grid>

        {/* Metrics Chart */}
        <Grid item xs={12} md={6}>
          <GlassCard>
            <SectionHeader icon={<InfoOutlinedIcon />} title="Key Metrics" badge={<OfficialBadge label="Explained" color="info" icon={<InfoOutlinedIcon />} />} />
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', mb: 2 }} />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={metricsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="score" fill="#1976d2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Skills Radar Chart */}
      {radarData.length > 0 && (
        <GlassCard>
          <SectionHeader icon={<CodeIcon />} title="Skill Distribution" badge={<OfficialBadge label="AI Parsed" color="primary" icon={<VerifiedIcon />} />} />
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', mb: 2 }} />
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#888" />
              <PolarAngleAxis dataKey="category" stroke="#fff" />
              <PolarRadiusAxis stroke="#fff" />
              <Radar name="Skills" dataKey="value" stroke="#dc004e" fill="#dc004e" fillOpacity={0.5} />
              <RechartsTooltip />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Add more official sections, bias alerts, and recommendations here as needed */}
    </Container>
  );
};

export default BiasAnalysis; 