import React, { useState, useEffect } from 'react';
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
  Divider,
  Chip,
  Alert,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Upload as UploadIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(24,28,36,0.92)',
  color: '#fff',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[6],
  padding: theme.spacing(3, 2),
  marginBottom: theme.spacing(3),
}));

const DASHBOARD_ACTIVITY_KEY = 'dashboardActivity';
const DASHBOARD_ALERTS_KEY = 'dashboardAlerts';

function getStoredActivity() {
  const data = localStorage.getItem(DASHBOARD_ACTIVITY_KEY);
  return data ? JSON.parse(data) : [];
}
function getStoredAlerts() {
  const data = localStorage.getItem(DASHBOARD_ALERTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function pushDashboardActivity(event) {
  const activity = getStoredActivity();
  activity.unshift(event);
  localStorage.setItem(DASHBOARD_ACTIVITY_KEY, JSON.stringify(activity.slice(0, 10)));
}
export function pushDashboardAlert(alert) {
  const alerts = getStoredAlerts();
  alerts.unshift(alert);
  localStorage.setItem(DASHBOARD_ALERTS_KEY, JSON.stringify(alerts.slice(0, 5)));
}

function getFairnessMetricsHistory() {
  const data = localStorage.getItem('fairnessMetricsHistory');
  return data ? JSON.parse(data) : [];
}

const activityTimelineSample = [
  { type: 'upload', label: 'Resume uploaded', time: '3 min ago' },
  { type: 'analysis', label: 'Bias analysis completed', time: '2 min ago' },
  { type: 'alert', label: 'Gender bias alert', time: '2 min ago' },
  { type: 'report', label: 'Report downloaded', time: 'just now' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(getStoredAlerts());
  const [activity, setActivity] = useState(getStoredActivity());
  const [metricsHistory, setMetricsHistory] = useState(getFairnessMetricsHistory());

  useEffect(() => {
    const handleStorage = () => {
      setAlerts(getStoredAlerts());
      setActivity(getStoredActivity());
      setMetricsHistory(getFairnessMetricsHistory());
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Use the latest metrics for the chart
  const latestMetrics = metricsHistory[0] || {};
  const fairnessMetrics = [
    {
      name: 'Education Level',
      value: latestMetrics.education_level ?? 0,
      tooltip: '0: None, 1: Bachelor, 2: Master, 3: PhD',
    },
    {
      name: 'Years Experience',
      value: latestMetrics.years_experience ?? 0,
      tooltip: 'Total years of relevant experience',
    },
    {
      name: 'Skills Match (%)',
      value: Math.round((latestMetrics.skills_match ?? 0) * 100),
      tooltip: 'Percentage of required skills matched',
    },
    {
      name: 'Project Complexity',
      value: latestMetrics.project_complexity ?? 0,
      tooltip: '0: Basic, 1: Medium, 2: Complex, 3: Advanced',
    },
  ];

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

  const handleDownloadReport = (type = 'pdf') => {
    // Prepare data
    const metrics = metricsHistory.map(m => ({
      Timestamp: m.timestamp,
      Education_Level: m.education_level,
      Years_Experience: m.years_experience,
      Skills_Match: m.skills_match,
      Project_Complexity: m.project_complexity,
      Score: m.score,
      Confidence: m.confidence,
    }));
    const activityData = activity.map(e => ({ Event: e.label, Type: e.type, Time: e.time }));

    if (type === 'csv') {
      const csvMetrics = Papa.unparse(metrics, { header: true });
      const csvActivity = Papa.unparse(activityData, { header: true });
      const csvContent = `Fairness Metrics\n${csvMetrics}\n\nRecent Activity\n${csvActivity}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'biasaware_report.csv');
      pushDashboardActivity({ type: 'report', label: 'Report downloaded', time: 'just now' });
      return;
    }

    // PDF
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('BiasAwareRecruitment Report', 14, 18);
    doc.setFontSize(12);
    doc.text('Fairness Metrics:', 14, 30);
    metrics.forEach((m, i) => {
      doc.text(`Time: ${m.Timestamp || ''}`, 18, 38 + i * 8);
      doc.text(`Education: ${m.Education_Level}, Exp: ${m.Years_Experience}, Skills: ${m.Skills_Match}, Proj: ${m.Project_Complexity}, Score: ${m.Score}, Conf: ${m.Confidence}`, 18, 44 + i * 8);
    });
    let y = 38 + metrics.length * 8 + 8;
    doc.text('Recent Activity:', 14, y);
    activityData.forEach((a, i) => {
      doc.text(`${a.Time} - ${a.Event} (${a.Type})`, 18, y + 8 + i * 8);
    });
    doc.save('biasaware_report.pdf');
    pushDashboardActivity({ type: 'report', label: 'Report downloaded', time: 'just now' });
  };

  return (
    <Container maxWidth="lg">
      {/* Live Bias Alerts */}
      <GlassCard sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <WarningIcon color="warning" />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>Live Bias Alerts</Typography>
          <Chip label="Official" color="info" size="small" sx={{ fontWeight: 600 }} />
        </Stack>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', mb: 2 }} />
        <Grid container spacing={2}>
          {alerts.length === 0 ? (
            <Grid item xs={12}><Typography variant="body2" sx={{ color: '#b0b8c1' }}>No live alerts.</Typography></Grid>
          ) : alerts.map((alert, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Alert
                severity={alert.type}
                iconMapping={{
                  warning: <WarningIcon fontSize="inherit" />, info: <CheckCircleIcon fontSize="inherit" color="success" />,
                }}
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  background: alert.type === 'warning' ? 'rgba(255,193,7,0.12)' : 'rgba(76,175,80,0.10)',
                  color: alert.type === 'warning' ? '#ff9800' : '#4caf50',
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{alert.title}</Typography>
                  <Typography variant="body2">{alert.message}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)', mt: 0.5 }}>{alert.timestamp}</Typography>
                </Box>
              </Alert>
            </Grid>
          ))}
        </Grid>
      </GlassCard>

      {/* Interactive Fairness Metrics Chart */}
      <GlassCard>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <BarChartIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>Fairness Metrics</Typography>
          <Chip label="Live" color="success" size="small" sx={{ fontWeight: 600 }} />
        </Stack>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', mb: 2 }} />
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={fairnessMetrics} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" tick={{ fontSize: 13 }} />
            <YAxis stroke="#fff" tick={{ fontSize: 13 }} />
            <RechartsTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const { name, value, tooltip } = payload[0].payload;
                  return (
                    <Paper sx={{ p: 1, background: 'rgba(24,28,36,0.95)', color: '#fff' }}>
                      <Typography variant="subtitle2">{name}</Typography>
                      <Typography variant="body2">Value: <b>{value}</b></Typography>
                      <Typography variant="caption">{tooltip}</Typography>
                    </Paper>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="#1976d2" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {fairnessMetrics.map((m, i) => (
            <Chip
              key={i}
              icon={<InfoOutlinedIcon />}
              label={<span><b>{m.name}:</b> {m.tooltip}</span>}
              size="small"
              sx={{ background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 500 }}
            />
          ))}
        </Box>
      </GlassCard>

      {/* Recent Activity Timeline */}
      <GlassCard>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <TimelineIcon color="secondary" />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>Recent Activity</Typography>
        </Stack>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', mb: 2 }} />
        <Stack spacing={2}>
          {activity.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#b0b8c1' }}>No recent activity yet.</Typography>
          ) : activity.map((event, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                color={event.type === 'alert' ? 'warning' : event.type === 'report' ? 'success' : 'primary'}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>{event.label}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', ml: 'auto' }}>{event.time}</Typography>
            </Box>
          ))}
        </Stack>
      </GlassCard>

      {/* Downloadable Reports */}
      <Box sx={{ textAlign: 'right', mb: 4 }}>
        <Tooltip title="Download fairness/bias report as PDF or CSV" arrow>
          <Box component="span">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownloadReport('pdf')}
              sx={{ fontWeight: 700, borderRadius: 2, mr: 2 }}
            >
              Download PDF
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownloadReport('csv')}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Download CSV
            </Button>
          </Box>
        </Tooltip>
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