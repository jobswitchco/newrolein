import { Box, Typography, useMediaQuery, Grid, Card, CardContent, Avatar } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import CodeIcon from '@mui/icons-material/Code';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const AboutUs = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <Navbar />
      <Box sx={{ padding: isMobile ? 3 : 8, mt: 10 }}>
        <Typography sx={{fontWeight: 600, fontSize: isMobile ? '32px' : '36px', mb: 2 }}>
          About Us
        </Typography>

        <Typography sx={{ fontWeight: 400, fontSize: isMobile ? '18px' : '22px', mb: 6 }}>
          NewRole was born out of a passion to reshape how working professionals find better opportunities. I built this platform from the ground up — spending countless nights designing, coding, testing, and refining every feature. The goal was always clear: to eliminate outdated job-hunting stress and empower professionals to get discovered by the right companies based on their real skills, experience, and preferences — without chasing listings or sending out dozens of resumes.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#1976d2', mb: 2 }}>
                  <CodeIcon />
                </Avatar>
               <Typography sx={{ fontSize : '18px', fontWeight: 600 }}>Crafted With Purpose</Typography>
<Typography variant="body1" sx={{ mt: 1 }}>
  Every line of code in New Role was thoughtfully written to serve working professionals. No outsourced teams — just a deep commitment to build a smarter, faster, and more human hiring experience from the ground up.
</Typography>

              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#388e3c', mb: 2 }}>
                  <EmojiObjectsIcon />
                </Avatar>
                <Typography sx={{fontSize : '18px', fontWeight: 600 }}>Professional-First Design</Typography>
<Typography variant="body1" sx={{ mt: 1 }}>
  New Role was built by stepping into the shoes of working professionals — removing the friction of traditional job hunting, simplifying discovery, and making career growth more accessible and efficient.
</Typography>

              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#d32f2f', mb: 2 }}>
                  <FavoriteIcon />
                </Avatar>
               <Typography sx={{fontSize : '18px', fontWeight: 600 }}>Built with Purpose</Typography>
<Typography variant="body1" sx={{ mt: 1 }}>
  New Role is more than just a platform — it's a labor of purpose. Every feature was crafted, refined, and shipped with care to genuinely support working professionals in finding better career opportunities.
</Typography>

              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 8, maxWidth: 1000 }}>
         <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
  A Message From Us
</Typography>
<Typography sx={{ fontSize: '18px' }}>
  I understand how exhausting the job search process can be — tweaking resumes, applying endlessly, and waiting without clarity. I've felt that frustration. That's why I built New Role: to remove the noise and let your profile do the talking. This is just the beginning, and I'm committed to improving the experience every day. Thank you for believing in this platform.
</Typography>

        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default AboutUs;
