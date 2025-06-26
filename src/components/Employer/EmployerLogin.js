import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Grid,
  Container
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { login } from "../../store/employerSlice";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../../images/desk-logo.svg"
import feedbackImg from "../../images/feedback-7323668_1280.png"

function EmployerLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, getEmail] = useState("");
  const [password, getPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const baseUrl = "http://localhost:8001/employersOn";


   useEffect(() => {
      const verifyToken = async () => {
        try {
          const res = await axios.get(`${baseUrl}/verify-login-token`, { withCredentials: true });
          if (res.data.valid) {
            navigate("/employer/all_professionals");
            // toast.success("you are already logged In");
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
        }
      };
  
      verifyToken();
    }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("All fields are mandatory");
    } else {
      setIsLoading(true);

      await axios
        .post(
          baseUrl + "/employer-login",
          { email: email.toLowerCase(), password: password },
           { withCredentials: true }
        )
        .then((res) => {

             if (res.data.success) {

                   const user_id = res.data.user.user_id;
                   const user_email = res.data.user.user_email;
                   const employerDetails = { user_email, user_id };
             
                   dispatch(login(employerDetails));
                   setIsLoading(false);
             navigate("/employer/all_professionals");

           
                 }

          else if(!res.data.success){

            toast.error("Invalid email or password!");
           
      
          }
           else{
       
             toast.error("Something Wrong. Please try again.");
                 
           }
        })
        .catch((err) => {
          setIsLoading(false);

          if (
            err.response &&
            err.response.data.error === "All fields are mandatory"
          ) {
            toast.warning("All fields are mandatory");
          } else if (err.response && err.response.status === 401) {
            // Handle 401 error (Unauthorized)
            toast.error("Session expired. Please login again.");
            // navigate('/login/brand');
          } else if (
            err.response &&
            err.response.data.error === "User does not exists!"
          ) {
            toast.warning("User does not exists");
          } else if (
            err.response &&
            err.response.data.error === "email, password mismatch"
          ) {
            toast.warning("Invalid email or password");
          } else {
            toast.error("An error occurred. Please try again later.");
          }
        });
    }
  };


  return (
    <>
      {isSmallScreen ? (
         <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', position: 'relative' }}>
      {/* Logo at top-left */}
      <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
        <a href="/">
          <img src={logo} alt="New Role Logo" width={110} />
        </a>
      </Box>

      {/* Centered Content */}
      <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={feedbackImg}
              alt="Desktop Illustration"
              sx={{ width: '100%', borderRadius: 3, boxShadow: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Please Switch to Desktop
            </Typography>
            <Typography variant="body1" color="text.secondary">
              For the best experience using Newrole's employer dashboard, please log in from a desktop or laptop device.
              Some features are not optimized for smaller screens yet.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
      ) : (
        <Grid container spacing="1" sx={{ height: "100vh" }}>
          <Grid item xs={4} sx={{ background: "#362FD9" }}>
            <Box
              display="flex"
              flexDirection={"column"}
              margin="auto"
              padding={1}
            >
             <Typography
  textAlign="start"
  sx={{
    fontSize: "46px",
    fontWeight: "500",
    color: "white",
    paddingX: "20px",
    paddingTop: "30%",
  }}
>
  Profiles... Preferences...
</Typography>

<Typography
  textAlign="start"
  sx={{
    fontSize: "22px",
    color: "white",
    paddingX: "20px",
    paddingTop: "10%",
  }}
>
  Discover top professionals with the right skills — instantly and intelligently.
</Typography>

            </Box>

          </Grid>

          <Grid item xs={8}>

                <Box
       sx={{ mt: 3, ml: 2}}
      >
        <a href="/">
          <img src={logo} alt="Newrole Logo" width={120} />
        </a>
      </Box>


            <form action="#" method="post">
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    marginTop: "30%",
                  }}
                >
                  <CircularProgress color="success" />
                </div>
              ) : (
                <>
                  <Box
                    display="flex"
                    flexDirection={"column"}
                    maxWidth={450}
                    margin="auto"
                    marginTop={15}
                    padding={1}
                  >
                    <Typography variant="h5" padding={3} textAlign="center">
                      Employer Login
                    </Typography>

                    <TextField
                      type="email"
                      id="email"
                      onChange={(e) => {
                        getEmail(e.target.value);
                      }}
                      sx={{ marginBottom: "12px" }}

                      margin="normal"
                      variant="outlined"
                      label="Email"
                    ></TextField>
                    <TextField
                      type="password"
                      id="password"
                      onChange={(e) => {
                        getPassword(e.target.value);
                      }}
                      variant="outlined"
                      label="Password"
                    ></TextField>

                    <Typography
                      variant="body2"
                      sx={{ display: "flex", justifyContent: "flex-end", mt: '8px' }}
                    >
                      <Link
                        href="/forgotPassword"
                        underline="none"
                        sx={{ color: "#362FD9" }}
                      >
                        Forgot password?
                      </Link>
                    </Typography>

                    <Button
                      type="submit"
                      onClick={handleSubmit}
                      variant="contained"
                      sx={{
                        marginTop: 2,
                        textTransform: "capitalize",
                        fontWeight: "300",
                        fontSize: 16,
                        background: "#362FD9",
                      }}
                      size="large"
                    >
                      Login
                    </Button>
                    <ToastContainer autoClose={2000} />

                    <Typography variant="body2" sx={{ marginTop: "5px" }}>
                      I agree to{" "}
                      <Link
                        href="https://newrole.in/terms"
                        target="_blank"
                        underline="none"
                        sx={{ color: "#362FD9" }}
                      >
                        Newrole's Terms of Service
                      </Link>
                    </Typography>

                  </Box>
                </>
              )}
            </form>
          </Grid>

        </Grid>
      )}
    </>
  );
}

export default EmployerLogin;
