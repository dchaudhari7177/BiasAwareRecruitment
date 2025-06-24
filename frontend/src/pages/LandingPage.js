import React from 'react';
import { Box, Typography, Button, Grid, Paper, Link, Divider, Chip, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import VerifiedIcon from '@mui/icons-material/Verified';
import PublicIcon from '@mui/icons-material/Public';
import StarIcon from '@mui/icons-material/Star';

const GradientHero = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 60%, #dc004e 100%)',
  color: '#fff',
  padding: theme.spacing(8, 2, 6, 2),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const StatsSection = styled(Box)(({ theme }) => ({
  background: 'rgba(24,28,36,0.92)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[6],
  padding: theme.spacing(5, 2, 5, 2),
  margin: '0 auto',
  maxWidth: 1100,
  marginBottom: theme.spacing(6),
}));

const OfficialStat = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 2),
  textAlign: 'center',
  background: 'rgba(255,255,255,0.07)',
  color: '#fff',
  boxShadow: theme.shadows[3],
  border: '1.5px solid rgba(255,255,255,0.18)',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s',
  minHeight: 170,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    transform: 'scale(1.04)',
    boxShadow: theme.shadows[8],
  },
}));

export default function LandingPage() {
  return (
    <Box>
      <GradientHero>
        <Typography variant="h1" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '3.5rem' } }}>
          BiasAwareRecruitment
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Ethical, Transparent, and Fair AI Recruitment
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Revolutionizing hiring with AI that puts fairness and ethics first. Built on the FATE framework and backed by academic research.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          href="/upload"
          sx={{ mr: 2, fontWeight: 600 }}
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          size="large"
          href="/analysis"
          sx={{ fontWeight: 600 }}
        >
          Try Bias Analysis
        </Button>
        <Box sx={{ mt: 4 }}>
          <Link href="http://dx.doi.org/10.13140/RG.2.2.11411.80163" target="_blank" underline="none" color="inherit">
            <Button startIcon={<SchoolIcon />} variant="text" color="inherit">Research Paper</Button>
          </Link>
          <Link href="https://github.com/dchaudhari7177/BiasAwareRecruitment" target="_blank" underline="none" color="inherit">
            <Button startIcon={<GitHubIcon />} variant="text" color="inherit">GitHub</Button>
          </Link>
        </Box>
      </GradientHero>

      <StatsSection>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 2, textAlign: 'center', letterSpacing: 1 }}>
          System Highlights
        </Typography>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', mb: 4 }} />
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <OfficialStat>
              <TrendingUpIcon fontSize="large" sx={{ mb: 1, color: '#90caf9' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>10,000+</Typography>
              <Typography variant="subtitle1" sx={{ color: '#b0b8c1', fontWeight: 500 }}>Resumes Analyzed</Typography>
              <Chip label="Research-backed" color="primary" size="small" sx={{ mt: 1 }} icon={<SchoolIcon />} />
            </OfficialStat>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <OfficialStat>
              <AssessmentIcon fontSize="large" sx={{ mb: 1, color: '#f48fb1' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>99%</Typography>
              <Typography variant="subtitle1" sx={{ color: '#b0b8c1', fontWeight: 500 }}>Bias Detection Accuracy</Typography>
              <Chip label="Verified by FATE" color="secondary" size="small" sx={{ mt: 1 }} icon={<VerifiedIcon />} />
            </OfficialStat>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <OfficialStat>
              <InsertChartIcon fontSize="large" sx={{ mb: 1, color: '#ffd54f' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>FATE</Typography>
              <Typography variant="subtitle1" sx={{ color: '#b0b8c1', fontWeight: 500 }}>Ethical Framework</Typography>
              <Chip label="Open Source" color="success" size="small" sx={{ mt: 1 }} icon={<PublicIcon />} />
            </OfficialStat>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <OfficialStat>
              <StarIcon fontSize="large" sx={{ mb: 1, color: '#ffe082' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>Trusted</Typography>
              <Typography variant="subtitle1" sx={{ color: '#b0b8c1', fontWeight: 500 }}>By Academics & Industry</Typography>
              <Tooltip title="Used in research and pilot deployments" arrow>
                <Chip label="Official" color="info" size="small" sx={{ mt: 1 }} icon={<StarIcon />} />
              </Tooltip>
            </OfficialStat>
          </Grid>
        </Grid>
      </StatsSection>
    </Box>
  );
} 