import { Box, Typography, Container, Grid } from '@mui/material';
import directEmployerImage from '../images/business-7768170_1280.jpg';
import Navbar from './Navbar';
import Footer from './Footer';

export default function DirectEmployerOutreach() {
  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 10 }}>
        {/* Title Section */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Direct Employer Outreach
          </Typography>
          <Typography variant="h7" color="text.secondary">
            Interested employers reach out to you directly, saving time and skipping the initial job hunt phase.
          </Typography>
        </Box>

        {/* Content Section */}
        <Grid container spacing={6} alignItems="center">
          {/* Image or Illustration */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={directEmployerImage}
              alt="employer outreach"
              sx={{ width: '100%', borderRadius: 3, boxShadow: 3 }}
            />
          </Grid>

          {/* Text Content */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="medium" gutterBottom>
              Skip the Job Hunt — Let Companies Come to You
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              With Direct Employer Outreach, we flip the script on traditional hiring. Once your profile is complete, employers who are genuinely interested in your background and expertise will reach out directly — no need for cold applications or endless job scrolling.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              This streamlined process means you can focus more on preparing for meaningful conversations and interviews rather than chasing down job postings. Let your profile do the heavy lifting, highlighting your strengths and aspirations.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Our algorithm ensures only relevant, verified employers are matched with your profile, resulting in high-quality opportunities that align with your career direction. Save time, reduce stress, and gain the confidence that the right roles will find you.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  );
}