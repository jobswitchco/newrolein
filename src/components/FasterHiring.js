import { Box, Typography, Container, Grid } from '@mui/material';
import fasterHiringImage from '../images/startup-3267505_1280.jpg'; // Replace with your actual image
import Navbar from './Navbar';
import Footer from './Footer';

export default function FasterHiring() {
  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 10 }}>
        {/* Title Section */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Faster Hiring
          </Typography>
          <Typography variant="h7" color="text.secondary">
            Streamlined screening helps companies move quickly, reducing delays & speeding up interview calls.
          </Typography>
        </Box>

        {/* Content Section */}
        <Grid container spacing={6} alignItems="center">
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={fasterHiringImage}
              alt="Faster Hiring Illustration"
              sx={{ width: '100%', borderRadius: 3, boxShadow: 3 }}
            />
          </Grid>

          {/* Text Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="medium" gutterBottom>
              Speed Up the Recruitment Pipeline
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Our platform empowers companies to fast-track their hiring process by providing smart filters and a well-structured view of every candidate. With fewer bottlenecks and better insights, decisions are made quickly — saving both sides precious time.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              By eliminating unnecessary screening steps and enabling real-time access to verified professional data, recruiters can initiate conversations faster and more efficiently.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Professionals benefit too — no more waiting endlessly. Once a match is identified, employers can reach out and schedule interviews within days, not weeks. It’s all about reducing friction and accelerating growth.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  );
}
