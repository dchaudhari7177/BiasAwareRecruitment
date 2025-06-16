import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      // Store the analysis results
      localStorage.setItem('analysisResults', JSON.stringify(response.data));
      
      // Navigate to analysis page
      navigate('/analysis');
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'Error uploading file. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Upload Resume
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Upload a PDF resume to analyze for potential biases in the recruitment process
        </Typography>

        <Box
          sx={{
            width: '100%',
            height: 200,
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            mb: 3,
            backgroundColor: file ? 'action.hover' : 'background.paper',
            transition: 'background-color 0.2s',
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" color="primary">
            {file ? file.name : 'Drag and drop your resume here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to select a file
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={handleUpload}
          disabled={!file || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </Button>
      </Paper>
    </Container>
  );
};

export default ResumeUpload; 