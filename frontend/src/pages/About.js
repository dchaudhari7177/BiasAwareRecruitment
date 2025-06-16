import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Gavel as GavelIcon,
  Psychology as PsychologyIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const About = () => {
  const principles = [
    {
      title: 'Fairness',
      description:
        'Ensuring that the AI system treats all candidates equitably, without discrimination based on protected attributes such as gender, race, age, or disability.',
      icon: <GavelIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Transparency',
      description:
        'Making the inner workings, data sources, and decision criteria accessible and understandable to stakeholders.',
      icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Ethics',
      description:
        'Embedding moral principles and human values in the design, deployment, and ongoing monitoring of AI systems.',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About BiasAware Recruitment
        </Typography>

        <Typography variant="body1" paragraph>
          BiasAware Recruitment is a research project developed at PES University, Bangalore,
          focusing on the ethical implications of AI in recruitment processes. Our mission
          is to promote fair and transparent hiring practices by identifying and mitigating
          biases in AI-based recruitment systems.
        </Typography>

        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
          Our Mission
        </Typography>

        <Typography variant="body1" paragraph>
          We aim to contribute to the development of responsible, inclusive, and transparent
          AI hiring technologies. By analyzing resumes and recruitment decisions through the
          lens of fairness, we help organizations make more ethical hiring choices while
          maintaining efficiency and scalability.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Core Principles
        </Typography>

        <Grid container spacing={4}>
          {principles.map((principle, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{principle.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {principle.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {principle.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Research Background
          </Typography>

          <Typography variant="body1" paragraph>
            This project is based on extensive research into the ethical implications of
            AI-based hiring tools, particularly focusing on the risks of gender, racial,
            and socioeconomic bias. Our work draws on real-world examples and ethical
            frameworks such as FATE (Fairness, Accountability, Transparency, and Ethics)
            to evaluate the deployment of AI in recruitment.
          </Typography>

          <Typography variant="body1" paragraph>
            The project was developed as part of a research initiative at PES University,
            with the goal of contributing to the development of ethically responsible
            hiring technologies.
          </Typography>
        </Box>

        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Contact Information
          </Typography>

          <Typography variant="body1">
            Dipak Rajendra Chaudhari
            <br />
            Department of Computer Science
            <br />
            PES University, Bangalore
            <br />
            Email: pes1ug24cs804@pesu.pes.edu
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default About; 