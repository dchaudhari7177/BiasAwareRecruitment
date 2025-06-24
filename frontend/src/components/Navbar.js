import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useTheme } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import VerifiedIcon from '@mui/icons-material/Verified';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Upload', path: '/upload' },
  { label: 'Analysis', path: '/analysis' },
  { label: 'About', path: '/about' },
];

export default function Navbar({ children }) {
  const theme = useTheme();
  const location = useLocation();
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'rgba(24,28,36,0.75)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)',
        borderBottom: '1.5px solid rgba(255,255,255,0.08)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <VerifiedIcon sx={{ color: theme.palette.secondary.main, fontSize: 32, mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 800,
              letterSpacing: 1,
              mr: 3,
            }}
          >
            BiasAwareRecruitment
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {navLinks.map(link => (
            <Button
              key={link.path}
              component={RouterLink}
              to={link.path}
              color={location.pathname === link.path ? 'secondary' : 'inherit'}
              sx={{
                fontWeight: 600,
                color: location.pathname === link.path ? theme.palette.secondary.main : '#fff',
                textTransform: 'none',
                fontSize: '1rem',
                px: 2,
                borderRadius: 2,
                background: location.pathname === link.path ? 'rgba(255,255,255,0.08)' : 'none',
                transition: 'background 0.2s',
                '&:hover': {
                  background: 'rgba(255,255,255,0.12)',
                },
              }}
            >
              {link.label}
            </Button>
          ))}
          {children}
        </Box>
      </Toolbar>
    </AppBar>
  );
} 