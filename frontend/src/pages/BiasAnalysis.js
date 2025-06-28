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
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GapAnalysisIcon from '@mui/icons-material/CompareArrows';
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

  // Extract advanced analysis data
  const advancedAnalysis = analysisData.advanced_analysis || {};
  const sentimentAnalysis = advancedAnalysis.sentiment_analysis || {};
  const skillsGapAnalysis = advancedAnalysis.skills_gap_analysis || {};
  const successProbability = analysisData.success_probability || 0;

  // Prepare advanced metrics data
  const advancedMetricsData = [
    {
      name: 'Success Probability',
      value: Math.round(successProbability * 100),
      max: 100,
      color: '#4caf50'
    },
    {
      name: 'Skills Match',
      value: Math.round(skillsGapAnalysis.match_percentage || 0),
      max: 100,
      color: '#2196f3'
    },
    {
      name: 'Sentiment Score',
      value: Math.round((sentimentAnalysis.confidence || 0) * 100),
      max: 100,
      color: '#ff9800'
    }
  ];

  // Prepare bias indicators
  const biasIndicators = advancedAnalysis.bias_indicators || [];

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

      {/* Advanced AI Analysis Section */}
      <GlassCard>
        <SectionHeader icon={<AssessmentIcon />} title="Advanced AI Analysis" badge={<OfficialBadge label="AI-Powered" color="secondary" icon={<VerifiedIcon />} />} />
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 800 }}>
                {Math.round((analysisData.success_probability || 0) * 100)}%
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#b0b8c1' }}>
                Success Probability
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 800 }}>
                {(analysisData.advanced_analysis?.skills_gap_analysis?.match_percentage || 0)}%
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#b0b8c1' }}>
                Skills Match
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 800 }}>
                {(analysisData.advanced_analysis?.sentiment_analysis?.sentiment || 'Neutral')}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#b0b8c1' }}>
                Communication Tone
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </GlassCard>

      {/* Bias Detection Alerts */}
      {biasIndicators.length > 0 && (
        <GlassCard>
          <SectionHeader 
            icon={<WarningIcon />} 
            title="Bias Detection Alerts" 
            badge={<OfficialBadge label="Critical" color="warning" icon={<WarningIcon />} />} 
          />
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', mb: 2 }} />
          <Grid container spacing={2}>
            {biasIndicators.map((bias, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Alert
                  severity="warning"
                  sx={{
                    background: 'rgba(255,193,7,0.12)',
                    color: '#ff9800',
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {bias.replace('_', ' ').toUpperCase()} DETECTED
                  </Typography>
                  <Typography variant="body2">
                    Potential {bias.replace('_', ' ')} bias in resume content
                  </Typography>
                </Alert>
              </Grid>
            ))}
          </Grid>
        </GlassCard>
      )}

      {/* Skills Gap Details */}
      {skillsGapAnalysis.missing_skills && skillsGapAnalysis.missing_skills.length > 0 && (
        <GlassCard>
          <SectionHeader 
            icon={<GapAnalysisIcon />} 
            title="Skills Gap Analysis" 
            badge={<OfficialBadge label="Detailed" color="info" icon={<InfoOutlinedIcon />} />} 
          />
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', mb: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#ff6b6b', mb: 2 }}>
                Missing Skills ({skillsGapAnalysis.missing_skills.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skillsGapAnalysis.missing_skills.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    color="error"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#4caf50', mb: 2 }}>
                Strength Areas ({skillsGapAnalysis.strength_areas.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skillsGapAnalysis.strength_areas.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </GlassCard>
      )}
    </Container>
  );
};

export default BiasAnalysis; 