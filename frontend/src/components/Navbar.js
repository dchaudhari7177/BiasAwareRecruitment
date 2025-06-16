import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InfoIcon from '@mui/icons-material/Info';

const Navbar = () => {
  return (
    <AppBar position="fixed">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <AssessmentIcon sx={{ mr: 1 }} />
            BiasAware Recruitment
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/upload"
              color="inherit"
              startIcon={<UploadFileIcon />}
            >
              Upload Resume
            </Button>
            <Button
              component={RouterLink}
              to="/analysis"
              color="inherit"
              startIcon={<AssessmentIcon />}
            >
              Bias Analysis
            </Button>
            <Button
              component={RouterLink}
              to="/about"
              color="inherit"
              startIcon={<InfoIcon />}
            >
              About
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 