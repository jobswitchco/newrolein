import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';


const CircleImage = styled('img')(({ size }) => ({
  width: size,
  height: size,
  borderRadius: '50%',
  objectFit: 'cover',
  border: '3px solid white',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  position: 'absolute',
}));

const BannerLandpage = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{ py: isMobile ? 6 : 10, px: 3 }}>
      <Grid container alignItems="center" justifyContent="center" spacing={4}>
        {/* Left Section with Circles */}
        <Grid item xs={12} md={6} sx={{ position: 'relative', height: isMobile ? 250 : 400 }}>
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <CircleImage
              src="https://randomuser.me/api/portraits/men/32.jpg"
              size={isMobile ? 80 : 120}
              style={{ top: isMobile ? 10 : 20, left: isMobile ? 30 : 60 }}
            />
            <CircleImage
              src="https://randomuser.me/api/portraits/men/45.jpg"
              size={isMobile ? 100 : 150}
              style={{ top: isMobile ? 60 : 130, left: isMobile ? 100 : 160 }}
            />
            <CircleImage
              src="https://randomuser.me/api/portraits/men/67.jpg"
              size={isMobile ? 70 : 100}
              style={{ bottom: isMobile ? 20 : 40, right: isMobile ? 30 : 100 }}
            />
          </Box>
        </Grid>

        {/* Right Section with Text and Buttons */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize : '32px', fontWeight: 600, mb: 2 }}>
            Begin your new journey with us
          </Typography>
          <Typography sx={{fontSize : '16px',  mb: 4 }}>
            Discover a smarter way to grow your career. Our platform connects you with top companies, making job switching faster, easier, and more rewarding.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
            {/* <Button variant="contained" color="warning" sx={{ borderRadius: 1, px: 4, py: 1, textTransform : 'none' }}>
              Enroll Now
            </Button> */}

                <div className="col-12 col-md-12 enrollnow-button-credit-card">
                          <Link to="/login" style={{ textDecoration: 'none' }}>
                            <button
                              className="btn signup-btn-grad btn-g-fonts"
                            >
                              Enroll now
                            </button>
                          </Link>
                        </div>
        
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BannerLandpage;
