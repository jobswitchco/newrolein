import { useState, useEffect } from "react";
import { Button, Typography, Grid, Stack, Box, Skeleton, Dialog, DialogTitle, DialogContent, TextField, DialogActions} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { logout } from "../../store/employerSlice.js";
import { useDispatch } from "react-redux";
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";




const AccountDetailsPage1 = () => {

      const dispatch = useDispatch();
      const navigate = useNavigate();
      const [ loading, setLoading ] = useState(false);
      const [ userDetails, setUserDetails ] = useState({});
      const [originalPassword, setOriginalPassword] = useState("");
      const [newPassword, setNewPassword] = useState("");
      const [passwordDialogue, setPasswordDialogue] = useState(false);

      // const baseUrl = "http://localhost:8001/employersOn";
      const baseUrl="/api/employersOn";

      const theme = useTheme();
      const isMobile = useMediaQuery(theme.breakpoints.down("sm"));



      const handleSignOut = async () => {
        try {
            await axios.post(baseUrl + "/logout", {}, { withCredentials: true });
            dispatch(logout()); // Clear Redux state
            window.location.href = "/employer/login"; // Ensures full logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

     const handleDialogPasswordClose = () => {
      setPasswordDialogue(false);
    };


     const updatePassword = async (e) => {
      e.preventDefault();
      setLoading(true);
    
      if (!originalPassword || !newPassword) {
        toast.warning("Enter a valid password");
        setLoading(false);
        return;
      }
    
      try {
        const res = await axios.post(
          `${baseUrl}/change-password`,
          { password: originalPassword, newPassword: newPassword },
          { withCredentials: true }
        );
    
        if (res.data.success) {
          toast.success("Password updated successfully");
          setPasswordDialogue(false);
        } else {
          toast.error(res.data.message || "Password update failed. Please try again.");
        }
      } catch (err) {
        if (err.response) {
          const errorMessage = err.response.data.message || "An error occurred. Please try again later.";
          
          if (errorMessage === "Wrong current password") {
            toast.warning("Wrong current password");
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error("Network error. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

      
    const handleSessionExpired = () => {
      toast.error("Session expired. Please log in again.");
      setTimeout(() => {
        navigate('/employer/login');
      }, 2000);
    };
 

    useEffect(() => {
      const verifyToken = async () => {
        setLoading(true);
      
        try {
          const res = await axios.get(`${baseUrl}/verify-login-token`, { withCredentials: true });
      
          if (res.data.valid) {
            fetchData();
          } else {
            handleSessionExpired();
          }
        } catch (error) {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            handleSessionExpired();
          } else {
            toast.error("Network error, please try again later.");
            handleSessionExpired();

          }
        } finally {
          setLoading(false);
        }
      };
      
  
      verifyToken();
    }, []);

 
          const fetchData = async () => {
            try {
      
                    await axios.post(baseUrl + "/get-employer-details", { }, { withCredentials : true}).then(ress=>{

                      if(ress.data.success){
                        setUserDetails(ress.data.data);
                      }
                      else {
                        setLoading(false);
                        toast.error("Session expired. Please log in again.");
                        setTimeout(() => {
                        navigate('/employer/login');
                        }, 2000);
                      }
            
                }).catch(e=>{
            
                })
            
            } catch (error) {
              setLoading(false);
              toast.error("Network error. Please log in again.");
              setTimeout(() => {
              navigate('/employer/login');
              }, 2000);
            }
          };

  return (
  <>

 

      <>
      {isMobile ? (
        <>

        <Stack sx={{ display : 'flex', flexDirection : 'column', gap: '1rem'}}>


        <Box sx={{display : 'flex', flexDirection : 'column', gap: '4px', py: '4px'}}>

                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Name</Typography>

                  {loading ? (      <Skeleton variant="rectangular" height={20} />
                  ): (<Typography sx={{ fontSize : '14px', fontWeight : '400'}}>{userDetails.firstName} {userDetails.lastName}</Typography>) }

        </Box>


         <Box sx={{display : 'flex', flexDirection : 'column', gap: '4px', py: '4px'}}>

                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Email</Typography>

                  {loading ? (      <Skeleton variant="rectangular" height={20} />
                  ): (<Typography sx={{ fontSize : '14px', fontWeight : '400'}}>{userDetails.email}</Typography>) }

        </Box>



          <Box sx={{display : 'flex', flexDirection : 'column', gap: '4px', py: '4px'}}>

                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Country</Typography>

                  {loading ? (      <Skeleton variant="rectangular" height={20} />
                  ): (<Typography sx={{ fontSize : '14px', fontWeight : '400'}}>{userDetails.country}</Typography>) }
                    
        </Box>

          <Box sx={{display : 'flex', flexDirection : 'column', gap: '4px', py: '4px'}}>

                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Alerts & SMS</Typography>

                   {loading ? (      <Skeleton variant="rectangular" height={20} />
                  ): (<Typography sx={{ fontSize : '14px', fontWeight : '400'}}>+91 - {userDetails.mobile_number}</Typography>) }
                  
        </Box>

          <div style={{ textAlign: 'start'}}>
                    <Button startIcon={<LogoutIcon />} sx={{ color : 'grey', textTransform : 'none'}} variant="outlined" color="warning" onClick={handleSignOut} size="small">
                      Sign Out
                    </Button>
                  </div>


                  

        </Stack>

         
        </>
      ) : (
        

          <Grid container mt={5}>

        <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ fontSize : '18px', fontWeight : '500'}}>Your Account</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={8}>
            
            <Grid container fullWidth sx={{  borderStyle : 'solid', borderWidth :'1px', borderColor : '#BCCCDC', marginBottom : '22px', paddingY : '12px', paddingX : '12px'}}>
                
                <Grid item md={4}>
                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Organization</Typography>
                </Grid>

                <Grid item md={8}>
                  {loading ? (      <Skeleton variant="rectangular" width={300} height={20} />
                  ): (<Typography sx={{ fontSize : '14px', fontWeight : '400'}}>{userDetails.company_name}</Typography>) }
                        
                </Grid>

            </Grid>


              <Grid container fullWidth sx={{  borderStyle : 'solid', borderWidth :'1px', borderColor : '#BCCCDC', marginBottom : '22px', paddingY : '12px', paddingX : '12px'}}>
                
                <Grid item md={4}>
                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Head Quarters</Typography>
                </Grid>

                <Grid item md={8}>
                  {loading ? (      <Skeleton variant="rectangular" width={300} height={20} />
                  ): (<Typography sx={{ fontSize : '14px', fontWeight : '400'}}>{userDetails.city}, {userDetails.country}</Typography>) }
                        
                </Grid>

            </Grid>




                <Grid container fullWidth sx={{  borderStyle : 'solid', borderWidth :'1px', borderColor : '#BCCCDC', marginBottom : '22px', paddingY : '12px', paddingX : '12px'}}>
                
                <Grid item md={4}>
                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Registered Email</Typography>
                </Grid>

                <Grid item md={8}>
                  {loading ? (      <Skeleton variant="rectangular" width={300} height={20} />
                  ): (<Typography sx={{ fontSize : '14px', fontWeight : '400'}}>{userDetails.email}</Typography>) }
                        
                </Grid>

            </Grid>


               <Grid container fullWidth sx={{  borderStyle : 'solid', borderWidth :'1px', borderColor : '#BCCCDC', marginBottom : '22px', paddingY : '12px', paddingX : '12px', alignItems : 'center'}}>
                
                <Grid item md={4}>
                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Password</Typography>
                </Grid>

                <Grid item md={8}>
                  
                  {loading ? (      
                  <Stack sx={{ display : 'flex', flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
                    <Skeleton variant="rectangular" width={160} height={20} />
                    <Skeleton variant="rectangular" width={100} height={20} />
                    
                    </Stack>

                  ): (
                  <>
                  <Stack sx={{ display : 'flex', flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>

                  <Typography sx={{ fontSize : '14px', fontWeight : '400'}}>***************</Typography>
 
                  <Box sx={{ border : '1px solid grey', borderRadius : '4px', px: '12px', py: '4px', cursor: 'pointer', ":hover": { backgroundColor: "#D6D6D6" }}}onClick={()=> {setPasswordDialogue(true)}}>
                   <Typography sx={{ fontSize : '14px', fontWeight : 400}}>Change Password</Typography>
                </Box>

                </Stack>   

                  </>)}
                      
              
                </Grid>

                

            </Grid>


            
       

            <div style={{ textAlign: 'start'}}>
                    <Button startIcon={<LogoutIcon />} sx={{ color : 'grey', textTransform : 'none'}} variant="outlined" color="warning" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>

                



            
        </Grid>

     </Grid> 

    )}
    </>



 {passwordDialogue && (
          <Dialog
            open={passwordDialogue}
            onClose={handleDialogPasswordClose}
            disableEscapeKeyDown
            keepMounted
            maxWidth="sm" // Makes the dialog wider
            fullWidth // Ensures it takes full width of "sm"
          >
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent dividers>
          
            <Typography sx={{fontSize: '16px', marginTop: '5px'}} >
                Please enter current password
              </Typography>

              <TextField
                type="password"
                id="password"
                onChange={(e) => {
                  setOriginalPassword(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="Current Password"
              />

              <Typography sx={{fontSize: '16px', marginTop: '5px'}} >
                Please enter new password
              </Typography>

              <TextField
                type="password"
                id="password"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="New Password"
              />

        </DialogContent>
            <DialogActions>
              <Button onClick={()=> setPasswordDialogue(false)} color="primary">
                Cancel
              </Button>
              <Button color="success" onClick={updatePassword}>
                SUBMIT
              </Button>
            </DialogActions>
          </Dialog>
      )}




  </>
  );
};

export default AccountDetailsPage1;
