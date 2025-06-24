import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useTheme, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import VerifiedIcon from '@mui/icons-material/Verified';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <VerifiedIcon sx={{ color: theme.palette.secondary.main, fontSize: 28, mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, color: '#1976d2' }}>
          BiasAwareRecruitment
        </Typography>
      </Box>
      <Divider />
      <List>
        {navLinks.map(link => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton component={RouterLink} to={link.path} selected={location.pathname === link.path}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
  );

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
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <VerifiedIcon sx={{ color: theme.palette.secondary.main, fontSize: { xs: 24, sm: 32 }, mr: 1 }} />
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
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            BiasAwareRecruitment
          </Typography>
        </Box>
        {isMobile ? (
          <>
            <IconButton color="inherit" edge="end" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              {drawer}
            </Drawer>
          </>
        ) : (
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
        )}
      </Toolbar>
    </AppBar>
  );
} 