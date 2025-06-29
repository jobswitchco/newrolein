import { useEffect } from 'react';
import {
  Typography,
  Stack,
  Box,
  Grid,
  useMediaQuery,
  useTheme,
  Link
} from "@mui/material";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import noresumes from "../images/noresumes.svg";
import employerHire from "../images/employersHire.svg";

import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';

function BodyMain1() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 

  return (
   <>

   <Grid container sx={{ px : isMobile ? 4 : 10, mb: isMobile ? 10 : 4, alignItems : 'center'}}>

     <Grid item xs={12} md={6}>
      <Stack sx={{ display : 'flex', flexDirection : 'column', px: isMobile ? 0 : 3}}>

<WavingHandOutlinedIcon sx={{ fontSize : '44px', mb: 1, color : '#261FB3'}}/>
<Typography sx={{ fontSize : isMobile ? '17px' : '19px', fontWeight : 500, mb: 2}}>No Resumes. No Applications.</Typography>
<Typography sx={{ fontSize : isMobile ? '16px' : '18px', pr: isMobile ? 0 : 7, mb: isMobile ? 2 : 0}}>
  Working professionals shouldn't need to post <span style={{ display : 'inline-block', textDecoration : 'underline', fontWeight : 500}}> resumes </span> or apply for <span style={{ display : 'inline-block', textDecoration : 'underline', fontWeight : 500}}>jobs.</span> Get discovered by top companies based on your experience and preferences — while staying in your current role.

</Typography>

      </Stack>
</Grid>

 <Grid item xs={12} md={6} >
      <img  
        className="img-fluid rounded points-image-dimen" 
        src={noresumes} 
        alt="noresumes" 
      
      />

 </Grid>

   </Grid>

     <Grid container sx={{ px : isMobile ? 4 : 10, mb: isMobile ? 10 : 14, alignItems : 'center'}}>

     <Grid item xs={12} md={6}>
      <Stack sx={{ display : 'flex', flexDirection : 'column', px: isMobile ? 0 : 3}}>

<PersonSearchOutlinedIcon sx={{ fontSize : '44px', mb: 1, color : '#B13BFF'}}/>
<Typography sx={{ fontSize : isMobile ? '18px' : '20px', fontWeight : 500, mb: 2}}>How Employers Hire</Typography>
<Typography sx={{ fontSize : isMobile ? '16px' : '18px', pr: isMobile ? 0 : 7, mb: isMobile ? 2 : 0}}>
  Recruiters actively explore professionals based on <span style={{ display : 'inline-block', fontStyle : 'italic', textDecoration : 'underline'}}>role</span>, <span style={{ display : 'inline-block', fontStyle : 'italic', textDecoration : 'underline'}}>experience</span>, and <span style={{ display : 'inline-block', fontStyle : 'italic', textDecoration : 'underline'}}>skills</span>. 
  They review your full profile, assess project details & <span style={{ display : 'inline-block', textDecoration : 'underline'}}>shortlist</span> suitable candidates. 
  Once shortlisted, they can directly send <span style={{ display : 'inline-block', textDecoration : 'underline', fontWeight : 500}}>interview invitations</span> —no middlemen involved.
</Typography>

      </Stack>
</Grid>

 <Grid item xs={12} md={6} >
      <img  
        className="img-fluid rounded points-image-dimen" 
        src={employerHire} 
        alt="employerHire" 
      
      />

 </Grid>

   </Grid>


   <Grid container spacing={ isMobile ? 1 : 4} sx={{ px: isMobile ? 4 : 10, mb: isMobile ? 6 : 8, alignItems : 'center'}}>

    <Grid item xs={12} md={6}>

      <Typography sx={{ fontSize : isMobile ? '26px' :'38px', fontWeight : 500}}>We have Flipped the Hiring Process.</Typography>

    </Grid>

     <Grid item xs={12} md={6} sx={{ mt: isMobile ? 2 : 0}}>

      <Typography sx={{ fontSize : '18px'}}>Skip the job hunt. Let companies find and contact you based on your profile — no applications needed.</Typography>


    </Grid>

   </Grid>

   <Grid container spacing={isMobile ? 4 : 10} sx={{ px: isMobile ? 4 : 10}}>

    <Grid item xs={12} md={4} lg={4}>

      <Box sx={{ 
        display : 'flex', 
        flexDirection : 'column', 
        borderRadius : '12px',
        py: 8,
        gap: 2,
        px: isMobile ? 3 : 3,
        background : '#6439FF'
        }}>

        <WorkHistoryIcon sx={{ fontSize : '44px', color : '#FFFFFF'}}/>
        <Typography sx={{ fontSize : '22px', fontWeight : 500, color : '#FFFFFF'}}>Profile-Based Discovery</Typography>
        <Typography sx={{ fontSize : '18px', color : '#F2F9FF'}}>Companies explore your detailed experience, skills, and preferences — no need to apply manually.</Typography>
     
   <Link
  href="/profile-based-discovery"
  target="_blank"
  rel="noopener noreferrer"
  underline="none"
  sx={{ textDecoration: 'none' }} // removes default underline on hover
>
  <Stack
    sx={{
      display: 'flex',
      flexDirection: 'row',
      gap: 2,
      color: '#FFFFFF',
      alignItems: 'center',
      mt: 2,
      cursor: 'pointer'
    }}
  >
    <Typography sx={{ color: '#FFFFFF' }}>Learn more</Typography>
    <ArrowRightAltOutlinedIcon />
  </Stack>
</Link>

      </Box>

    </Grid>

    <Grid item xs={12} md={4} lg={4}>

      <Box sx={{ 
        display : 'flex', 
        flexDirection : 'column', 
        borderRadius : '12px',
        border : '1px solid #BCCCDC',
        py: 8,
        gap: 2,
        px: isMobile ? 3 : 3,
        }}>

        <AssignmentIndIcon sx={{ fontSize : '44px'}}/>
        <Typography sx={{ fontSize : '22px', fontWeight : 500}}>Direct Employer Outreach</Typography>
        <Typography sx={{ fontSize : '18px'}}>Interested employers reach out to you directly, saving time and skipping the initial job hunt phase.</Typography>
     

     <Link
  href="/employer-reachout"
  target="_blank"
  rel="noopener noreferrer"
  underline="none"
  sx={{ textDecoration: 'none' }} 
>

  
  <Stack
    sx={{
      display: 'flex',
      flexDirection: 'row',
      gap: 2,
      alignItems: 'center',
      mt: 2,
      cursor: 'pointer'
    }}
  >
    <Typography sx={{ color: '#000000' }}>Learn more</Typography>
    <ArrowRightAltOutlinedIcon  sx={{ color : '#000000'}}/>
  </Stack>
</Link>


      </Box>

    </Grid>

   <Grid item xs={12} md={4} lg={4}>

      <Box sx={{ 
        display : 'flex', 
        flexDirection : 'column', 
        borderRadius : '12px',
        border : '1px solid #BCCCDC',
        py: 8,
        gap: 2,
        px: isMobile ? 3 : 3,
        }}>

        <ElectricBoltIcon sx={{ fontSize : '44px'}}/>
        <Typography sx={{ fontSize : '22px', fontWeight : 500}}>Faster Hiring</Typography>
        <Typography sx={{ fontSize : '18px'}}>Streamlined screening helps companies move quickly, reducing delays & speeding up interview calls.</Typography>
     

    <Link
  href="/faster-hiring"
  target="_blank"
  rel="noopener noreferrer"
  underline="none"
  sx={{ textDecoration: 'none' }} 
>
  <Stack
    sx={{
      display: 'flex',
      flexDirection: 'row',
      gap: 2,
      alignItems: 'center',
      mt: 2,
      cursor: 'pointer'
    }}
  >
    <Typography sx={{ color: '#000000' }}>Learn more</Typography>
    <ArrowRightAltOutlinedIcon  sx={{ color : '#000000'}}/>
  </Stack>
</Link>

      </Box>

    </Grid>


   </Grid>
   
   </>
  );
}

export default BodyMain1;
