import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Switch,
  LinearProgress,
  useTheme,
  Stack,
  CircularProgress
} from '@mui/material';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";




const DashboardOverview = () => {
  // const baseUrl = "http://localhost:8001/usersOn";
      const baseUrl="/api/usersOn";

    const navigate = useNavigate();
    const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [ userDetails, setUserDetails ] = useState({});
     const [openForSwitch, setOpenForSwitch] = useState(false);
       const [ loading, setLoading ] = useState(false);
     

const handleToggleSwitch = async (event) => {
  const newValue = event.target.checked;
  setOpenForSwitch(newValue);

  try {
    const res = await axios.post(
      `${baseUrl}/toggle-open-for-jobs`,
      { openForJobs: newValue },
      { withCredentials: true }
    );

    if (res.data.success) {
      toast.success(res.data.message || "Profile visibility updated!");
    } else {
      toast.error("Failed to update status.");
    }
  } catch (err) {
    toast.error("Network error while updating job status.");
  }
};


    const handleSessionExpired = () => {
            toast.error("Session expired. Please log in again.");
            setTimeout(() => {
  
              navigate('/professional/login');
              
            }, 1500);
          };
  

            useEffect(() => {
                    const verifyToken = async () => {
                      setLoading(true);
                    
                      try {
                        const res = await axios.get(`${baseUrl}/verify-login-token`, { withCredentials: true });
                    
                        if (res.data.valid) {
                          await fetchData();
                        } else {
                          handleSessionExpired();
                        }
                      } catch (error) {
                        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                          handleSessionExpired();
                        } else {
                          toast.error("Network error, please try again later.");
                        }
                      } finally {
                        setLoading(false);
                      }
                    };
                    
                
                    verifyToken();
                  }, []);

                     const fetchData = async () => {
                                      try {
                  
                                              await axios.get(baseUrl + "/profile-completion", { withCredentials : true}).then(ress=>{
                          
                                                if(ress.data.success){
                                                  setUserDetails(ress.data);
                                                  setOpenForSwitch(ress.data.openForJobs);
                                                  setLoading(false);
                  
                                                }
                                                else {
                                                  setLoading(false);
                                                  toast.error("Session expired. Please log in again.");
                                                  setTimeout(() => {
                                                  navigate('/professional/login');
                                                  }, 2000);
                                                }
                                      
                                          }).catch(e=>{
                                      
                                          })
                                      
                                      } catch (error) {
                                        setLoading(false);
                                        toast.error("Network error. Please log in again.");
                                        setTimeout(() => {
                                        navigate('/professional/login');
                                        }, 2000);
                                      }
                                    };
                  


  return (


    <Box sx={{ p: { xs: 2, md: 4 }, mt: { xs: 0, md: 2}, mb: 8 }}>
     
 { loading ? ( <Box
                  sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999
                  }}
                >
                  <CircularProgress />
                </Box>) : (

     <Grid container spacing={2}>
  {/* Profile Box */}
  <Grid item xs={12} sm={6} md={3}>
    <Box
      sx={{
        px: 2,
        py: 3,
        background: '#EBD6FB',
        borderRadius: '12px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Typography sx={{ fontSize: isMobile ? '16px' : '18px', mb: isMobile ? 1 : 2, fontWeight: 500 }}>Profile</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ fontSize: isMobile ? '20px' : '28px', fontWeight: 600 }}>
          {userDetails?.completionPercentage}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={userDetails?.completionPercentage}
        sx={{
          height: isMobile ? 5: 10,
          borderRadius: 5,
          backgroundColor: '#FFFCFB',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#093FB4',
          },
          my: 2,
        }}
      />

      <Stack
       onClick={ ()=> navigate('/professional/career_details')}
        sx={{
          flexDirection: 'row',
          gap: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          px: 1.5,
          py: 0.8,
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'border 0.3s ease',
          '&:hover': {
            color: '#06923E',
          },
        }}
      >
        <ArrowRightAltOutlinedIcon />
        <Typography sx={{ fontSize: isMobile ? '14px' : '15px' }}>Update</Typography>
      </Stack>
    </Box>
  </Grid>

 
    {/* Views Profile Box */}
<Grid item xs={12} sm={6} md={3}>
  <Box
    sx={{
      px: 2,
      py: 3,
      background: '#B4EBE6',
      borderRadius: '12px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
      <Typography sx={{ fontSize: isMobile ? '16px' : '18px', mb: 2, fontWeight: 500 }}>Views</Typography>
      <Typography sx={{ fontSize: isMobile ? '12px' : '14px', mb: 2, fontWeight: 400, ml: '4px', color: 'grey', mt: 0.5 }}>
        (profile)
      </Typography>
    </Stack>

    <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, alignItems: 'center' }}>
      <Typography sx={{ fontSize: isMobile ? '22px' : '32px', fontWeight: 600 }}>{userDetails.profileViews}</Typography>
    </Box>

    {userDetails?.profileViews === 0 ? (
      <Typography sx={{ fontSize: '12px', textAlign: 'center', color: 'text.secondary', mt: isMobile ? 2 : 0 }}>
        No worries. Keep your profile open.
      </Typography>
    ) : (
      <Typography sx={{ fontSize: '12px', textAlign: 'center', color: '#06923E', mt: isMobile ? 2 : 0 }}>
        Your profile is getting noticed  👍
      </Typography>
    )}
  </Box>
</Grid>

 {/* Invitations Box */}
  <Grid item xs={12} sm={6} md={3}>
  <Box
    sx={{
      px: 2,
      py: 3,
      background: '#D3ECCD',
      borderRadius: '12px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
      <Typography sx={{ fontSize: isMobile ? '16px' : '18px', mb: 2, fontWeight: 500 }}>Invitations</Typography>
      <Typography sx={{ fontSize: isMobile ? '12px' : '14px', mb: 2, fontWeight: 400, ml: '4px', color: 'grey', mt: 0.5 }}>
        (total)
      </Typography>
    </Stack>

    <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, alignItems: 'center' }}>
      <Typography sx={{ fontSize: isMobile ? '22px' : '32px', fontWeight: 600 }}>{userDetails.totalInvitations}</Typography>
    </Box>

    {userDetails?.totalInvitations === 0 ? (
      <Typography sx={{ fontSize: '12px', textAlign: 'center', color: 'text.secondary', mt: isMobile ? 2 : 0 }}>
        No worries. Keep your profile active!
      </Typography>
    ) : (
      <Typography sx={{ fontSize: '12px', textAlign: 'center', color: '#237804', mt: isMobile ? 2 : 0 }}>
        🎉 New job opportunities.
      </Typography>
    )}
  </Box>
</Grid>



    {/* Switch Box */}

 <Grid item xs={12} sm={6} md={3}>
      <Box
        sx={{
          px: 2,
          py: 3,
          background: '#D9EAFD',
          borderRadius: '12px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontSize: isMobile ? '16px' : '18px', mb: 2, fontWeight : 500 }}>
          Open for Job Switch
        </Typography>

  <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, alignItems: 'center' }}>
       <Switch
          checked={openForSwitch}
          onChange={handleToggleSwitch}
          color="primary"
          sx={{ transform: 'scale(2)', my: 2, justifyContent : 'center' }}
        />
    </Box>
      

        {openForSwitch ? (
          <Typography sx={{ fontSize: isMobile ? '12px' : '14px', color: '#EB5A3C', mt: 2 }}>
            You're visible to recruiters now 🚀
          </Typography>
        ) : (
          <Typography sx={{ fontSize: isMobile ? '12px' : '14px', color: 'text.secondary', mt: 1 }}>
            You are currently hidden from recruiters.
          </Typography>
        )}
      </Box>
    </Grid>

</Grid>
                )}

{/* <Box
  sx={{
    mt: 4,
    width: '100%',
    height: { xs: 250, sm: 400, md: 480 },
    borderRadius: 3,
    overflow: 'hidden',
    boxShadow: 3,
  }}
>
  <iframe
    width="100%"
    height="100%"
    src="https://www.youtube.com/embed/hRKlffMezxQ"
    title="Intro Video"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
  ></iframe>
</Box> */}


    </Box>
  );
};

export default DashboardOverview;
