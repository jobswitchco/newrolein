import { useEffect } from 'react';
import {
  Typography,
  Stack,
  Box,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS CSS
import godaddy_logo from "../images/GoDaddy_logo.svg.png";


function BodyMain2() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in ms
      once: true, // Animation will run once
    });
  }, []);

  return (
   <>
   <Grid xs={12} md={12} lg={12} 
   sx={{
    // px : isMobile ? 4 : 10,
    // mb: isMobile ? 10 : 14, 
    mt: isMobile ? 3 : 6
  }}
  >

  <Box sx={{
    display : 'flex',
    flexDirection : 'column',
    background : '#D9EAFD', 
    textAlign : 'center',
    py : isMobile ? 10 : 12,
    px: isMobile ? 4 : 10
  }}>
    <Typography sx={{ fontSize : isMobile ? '20px' : '28px', fontWeight : 400, mb: 2}}>Trusted by 100+ world best companies</Typography>


{isMobile ? (<>

<Stack sx={{ display : 'flex', flexDirection : 'column', alignItems : 'center'}}>

<Stack sx={{ display : 'flex', flexDirection : 'row', justifyContent : 'space-between', mt: 4}}>
      
        <img  
        className="img-fluid rounded img-company-logos" 
        src={godaddy_logo} 
        alt="youtube-icon" 
        data-aos="zoom-in" 
        data-aos-delay="600"  />

           <img  
        className="img-fluid rounded img-company-logos" 
        src={godaddy_logo} 
        alt="youtube-icon" 
        data-aos="zoom-in" 
        data-aos-delay="600"  />
        </Stack>

        <Stack sx={{ display : 'flex', flexDirection : 'row', justifyContent : 'space-between', mt: 4}}>
      
        <img  
        className="img-fluid rounded img-company-logos" 
        src={godaddy_logo} 
        alt="youtube-icon" 
        data-aos="zoom-in" 
        data-aos-delay="600"  />

           <img  
        className="img-fluid rounded img-company-logos" 
        src={godaddy_logo} 
        alt="youtube-icon" 
        data-aos="zoom-in" 
        data-aos-delay="600"  />
        </Stack>

        <Stack sx={{ display : 'flex', flexDirection : 'row', justifyContent : 'space-between', mt: 4}}>
      
        <img  
        className="img-fluid rounded img-company-logos" 
        src={godaddy_logo} 
        alt="youtube-icon" 
        data-aos="zoom-in" 
        data-aos-delay="600"  />

        </Stack>

</Stack>

</>) : (<>
  <Stack sx={{ display : 'flex', flexDirection : 'row', justifyContent : 'space-between', mt: isMobile ? 2 : 4}}>
      
        <img  
        className="img-fluid rounded img-company-logos" 
        src={godaddy_logo} 
        alt="youtube-icon" 
        data-aos="zoom-in" 
        data-aos-delay="200"  />

           <img  
        className="img-fluid rounded img-company-logos" 
        src={godaddy_logo} 
        alt="youtube-icon" 
        data-aos="zoom-in" 
        data-aos-delay="200"  />

           <img  
        className="img-fluid rounded img-company-logos" 
        src={godaddy_logo} 
        alt="youtube-icon" 
        data-aos="zoom-in" 
        data-aos-delay="200"  />

           <img  
        className="img-fluid rounded img-company-logos" 
        src={godaddy_logo} 
        alt="youtube-icon" 
        data-aos="zoom-in" 
        data-aos-delay="200"  />

           <img  
        className="img-fluid rounded img-company-logos" 
        src={godaddy_logo} 
        alt="youtube-icon" 
        data-aos="zoom-in" 
        data-aos-delay="200"  />


    </Stack>
</>)}
  

  </Box>

   </Grid>


   
   </>
  );
}

export default BodyMain2;
