import { useState, useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Link,
  Grid,
  Rating, 
  Avatar, 
  Stack 
} from '@mui/material';
import { toast } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useDispatch} from 'react-redux';
import {login} from '../../store/professionalSlice';
import logo from "../../images/desk-logo.svg";








function BrandSignup() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  // const baseUrl = "http://localhost:8001/usersOn";
      const baseUrl="/api/usersOn";

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

   useEffect(() => {
            const verifyToken = async () => {
              setLoading(true);
            
              try {
                const res = await axios.get(`${baseUrl}/verify-login-token`, { withCredentials: true });
            
                if (res.data.valid) {
                    await isWorkmailVerified(res.data.user.user_id);
                  
                } else {
                }
              } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                } else {
                }
              } finally {
                setLoading(false);
              }
            };
            
        
            verifyToken();
          }, []);
  

  const handleLoginSuccess = async (email_gm, firstName, lastName) => {
    setIsLoading(true);
  
    try {
      const res = await axios.post(
        baseUrl + "/user-login-gmail",
        { email: email_gm, firstName, lastName },
        { withCredentials: true }
      );
  
      if (res.data.success) {
        const user_id = res.data.user.user_id;
        const user_email = res.data.user.user_email;
        const professionalDetails = { user_email, user_id };
  
        dispatch(login(professionalDetails));
        setIsLoading(false);
       await isWorkmailVerified(user_id);

      } else {
        toast.error(res.data.message || "An error occurred. Please try again later.");
        setIsLoading(false);
      }
    } catch (err) {
      // console.error(err);
      // toast.error(err?.response?.data?.message || "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

   async function isWorkmailVerified(user_id) {
        try {
      
          const res = await axios.post(`${baseUrl}/is-workmail-verified`, { user_id });
  
          if (res.data.verified) {
              navigate("/professional/dashboard");
         
          } else {
            navigate("/verify/workmail");
          }
        } catch (error) {
          if (error.response?.status === 401 || 400 || 403) {
            toast.error("Session expired. Please log in again.");
          } else {
            toast.error("Network Error. Please log in again.");
          }
        } finally {
          setIsLoading(false);
        }
      }
  


  return (
    <>
{/* <Grid container spacing='2'> */}

{isSmallScreen ? ( 

<Grid item xs={12} paddingX={2}>
  
<form action='#' method='post'>


{loading ? (
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', marginTop: '30%' }}>
<CircularProgress color= 'success' />
</div>
) : ( <>

<Box position="relative" minHeight="100vh">
  {/* Top-left Logo */}
  <Box position="absolute" top={15}>
    <Typography variant="h4">
      <a href="/">
        <img
          className="img-fluid"
          src={logo}
          alt="newrole"
          width={110}
        />
      </a>
    </Typography>
  </Box>

  {/* Centered Login Box */}
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <Box
      display="flex"
      flexDirection="column"
      maxWidth={450}
      padding={1}
    >
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const decoded = jwtDecode(credentialResponse.credential);
            handleLoginSuccess(decoded.email, decoded.given_name, decoded.family_name);
          }}
          onError={() => {
            // console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>

      <Typography variant="body2" sx={{ marginTop: '5px' }}>
        I agree to{" "}
        <Link
          href="https://newrole.in/terms"
          target="_blank"
          underline="none"
          sx={{ color: '#362FD9' }}
        >
          Newrole's Terms of Service
        </Link>
      </Typography>
    </Box>
  </Box>
</Box>



    </>)}


    </form>
</Grid> ) : (

<Grid container sx={{ height: '100vh' }}>



<Grid item xs={4} sx={{ background: '#362FD9' }}>

              <Box
              display="flex"
              flexDirection={"column"}
              margin="auto"
              padding={1}
              
               >
                      
              <Typography textAlign="start"  sx={{
                fontSize: '46px', 
                fontWeight: '500', 
                color: 'white', 
                paddingX: '20px', 
                paddingTop: '25%',

                }}>
               Welcome to your Next Career Move.
              </Typography>

              <Typography textAlign="start"  sx={{fontSize: '22px', color: 'white', paddingX: '20px', paddingTop: '3%'}}>
              Unlock new opportunities for unmatched visibility and growth.
              </Typography>

              </Box>


                <Box
                  display="flex"
                  flexDirection={"column"}
                  margin="auto"
                  padding={1}
                  sx={{ marginTop : '20%'}}
                >
                    
                <Rating
                sx={{ paddingX : '20px'}} 
                name="half-rating-read" defaultValue={4.5} precision={0.5} readOnly />

                <Typography textAlign="start"  sx={{fontSize: '14px', color: 'white', paddingX: '20px', paddingTop: '2%'}}>
                "We're excited about this game-changing platform for job switching. It connects professionals directly with companies—something we didn't know we needed until now!"
                </Typography>


                <Stack 
                display="flex"
                flexDirection={'row'}
                padding={1}
                sx={{marginTop : '5%', paddingX: '20px'}}
                >

                <Avatar alt="Travis Howard" sx={{ width: 40, height: 40 }}/>
                <Box 
                display ='flex'
                flexDirection={'column'}
                >
                <Typography textAlign="start"  sx={{fontSize: '14px', color: 'white', paddingX: '20px' }}>
                Karan Jaiswal <br />
                </Typography>

                <Typography textAlign="start"  sx={{fontSize: '12px', color: '#E4F1FF', paddingX: '20px' }}>
                Recruitment, BuzzerStudio
                </Typography>
                </Box>

                

                </Stack>



                </Box>




        </Grid>

  <Grid item xs={8}>
  
  <form action='#' method='post'>


{isLoading ? (
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
 <CircularProgress color= 'success' />
</div>
) : ( <>

  <Box position="relative" minHeight="100vh">
  {/* Logo at top-left */}
  <Box position="absolute" top={16} left={24}>
    <Typography variant="h4">
      <a href="/">
        <img className="img-fluid" src={logo} alt="newrole" width={120} />
      </a>
    </Typography>
  </Box>

  {/* Centered Box */}
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <Box
      display="flex"
      flexDirection="column"
      maxWidth={550}
     
    >
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const decoded = jwtDecode(credentialResponse.credential);
            handleLoginSuccess(decoded.email, decoded.given_name, decoded.family_name);
          }}
          onError={() => {
            // console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>

      <Typography variant="body2" sx={{ marginTop: '5px' }}>
        I agree to{" "}
        <Link
          href="https://newrole.in/terms"
          target="_blank"
          underline="none"
          sx={{ color: '#362FD9' }}
        >
          Newrole's Terms of Service
        </Link>
      </Typography>
    </Box>
  </Box>
</Box>



      </>)}

      </form>
</Grid>


</Grid>
)}




    </>
  )
}

export default BrandSignup