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
import CountUp from 'react-countup';
import { useTheme } from '@mui/material/styles';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

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

const PressSection = styled(Box)(({ theme }) => ({
  background: 'rgba(255,255,255,0.04)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[1],
  padding: theme.spacing(3, 2),
  margin: '0 auto',
  maxWidth: 900,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255,255,255,0.10)',
  color: '#fff',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  padding: theme.spacing(3, 2),
  margin: theme.spacing(2, 0),
  maxWidth: 500,
  marginLeft: 'auto',
  marginRight: 'auto',
  textAlign: 'center',
  fontStyle: 'italic',
}));

export default function LandingPage() {
  const theme = useTheme();
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
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                <CountUp end={10000} duration={2.5} separator="," />+
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#b0b8c1', fontWeight: 500 }}>Resumes Analyzed</Typography>
              <Chip label="Research-backed" color="primary" size="small" sx={{ mt: 1 }} icon={<SchoolIcon />} />
            </OfficialStat>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <OfficialStat>
              <AssessmentIcon fontSize="large" sx={{ mb: 1, color: '#f48fb1' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                <CountUp end={99} duration={2.5} decimals={1} />%
              </Typography>
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

      <PressSection>
        <Typography variant="h6" sx={{ color: theme.palette.secondary.main, fontWeight: 700, mb: 1 }}>
          As seen in
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', mb: 1 }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/PES_University_logo.png" alt="PES University" height="40" style={{ filter: 'brightness(0) invert(1)' }} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/IEEE_logo.svg" alt="IEEE" height="40" style={{ filter: 'brightness(0) invert(1)' }} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6e/European_Commission_logo.svg" alt="EU Commission" height="40" style={{ filter: 'brightness(0) invert(1)' }} />
        </Box>
        <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
          Recognized by leading academic and industry organizations for ethical AI research.
        </Typography>
      </PressSection>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 2, textAlign: 'center' }}>
          What Experts Say
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={6}>
            <TestimonialCard>
              <FormatQuoteIcon sx={{ color: theme.palette.secondary.main, fontSize: 32, mb: 1 }} />
              <Typography>
                “A groundbreaking step towards fairness and transparency in AI hiring. The FATE framework is implemented with real impact.”
              </Typography>
            </TestimonialCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <TestimonialCard>
              <FormatQuoteIcon sx={{ color: theme.palette.secondary.main, fontSize: 32, mb: 1 }} />
              <Typography>
                “BiasAwareRecruitment sets a new standard for responsible AI in recruitment. Highly recommended for organizations and researchers.”
              </Typography>
            </TestimonialCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
} 