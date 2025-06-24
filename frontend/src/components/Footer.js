import React from 'react';
import { Box, Typography, Link, Chip, Stack } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'rgba(24,28,36,0.85)',
        color: '#fff',
        backdropFilter: 'blur(8px)',
        borderTop: '1.5px solid rgba(255,255,255,0.08)',
        py: 4,
        px: 2,
        mt: 8,
        textAlign: 'center',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
        <Chip label="Verified by FATE" color="secondary" icon={<VerifiedIcon />} sx={{ fontWeight: 600 }} />
        <Chip label="Research-backed" color="primary" icon={<SchoolIcon />} sx={{ fontWeight: 600 }} />
        <Chip label="Open Source" color="success" icon={<PublicIcon />} sx={{ fontWeight: 600 }} />
      </Stack>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Contact: <Link href="mailto:pes1ug24cs804@pesu.pes.edu" color="inherit">pes1ug24cs804@pesu.pes.edu</Link> | 
        <Link href="http://dx.doi.org/10.13140/RG.2.2.11411.80163" color="inherit" target="_blank" sx={{ mx: 1 }}>Research Paper</Link> | 
        <Link href="https://github.com/dchaudhari7177/BiasAwareRecruitment" color="inherit" target="_blank">GitHub</Link>
      </Typography>
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
        © {new Date().getFullYear()} BiasAwareRecruitment. For research and educational use only. All rights reserved.
      </Typography>
    </Box>
  );
} 