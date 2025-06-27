import {useEffect} from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import profilebasedImage from '../images/man-6086273_1280.jpg'
import Navbar from './Navbar';
import Footer from './Footer';
import { Helmet } from "react-helmet";



export default function ProfileBasedDiscovery() {
   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <>

      <Helmet>
            <title>Profile-Based Job Discovery | No Applications Needed | Newrole</title>
            <meta
              name="description"
              content="Tired of applying? With Newrole, your profile does the work. Get discovered by companies based on skills, experience, and goals — no resume spam or cold outreach."
            />
            <meta
              property="og:title"
              content="Profile-Based Job Discovery | No Applications Needed | Newrole"
            />
            <meta
              property="og:description"
              content="Tired of applying? With Newrole, your profile does the work. Get discovered by companies based on skills, experience, and goals — no resume spam or cold outreach."
            />
            <meta property="og:type" content="website" />
          </Helmet>

    <Navbar />

    <Container maxWidth="lg" sx={{ py: 10 }}>
      {/* Title Section */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Profile-Based Discovery
        </Typography>
        <Typography variant="h7" color="text.secondary">
          Companies explore your detailed experience, skills, and preferences — no need to apply manually.
        </Typography>
      </Box>

      {/* Content Section */}
      <Grid container spacing={6} alignItems="center">
        {/* Image or Illustration */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={profilebasedImage}
            alt="profile discovery"
            sx={{ width: '100%', borderRadius: 3, boxShadow: 3 }}
          />
        </Grid>

        {/* Text Content */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight="medium" gutterBottom>
            Let Your Profile Speak for You
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Our platform eliminates the tedious job application process by putting your comprehensive profile front and center. With details on your work history, skills, certifications, and job preferences, companies discover and approach you directly.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            This means no more mass applying or tailoring resumes for every opportunity. Instead, your verified information, project experience, and achievements help you stand out. Companies can filter and connect with professionals based on specific needs — making the discovery process smart, fast, and focused.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            As a working professional, your time is valuable. Our system ensures you only get contacted for relevant roles that match your expectations, skills, and goals.
          </Typography>

       
        </Grid>
      </Grid>
    </Container>

    <Footer />
    </>
  );
}
