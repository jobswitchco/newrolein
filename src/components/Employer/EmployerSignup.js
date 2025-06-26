import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
// import sideImage from "../../images/IMG_1025.jpg";
import CircularProgress from "@mui/material/CircularProgress";

function UserSignup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [designation, setDesignation] = useState("");
  const [company_name, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [company_type, setCompanyType] = useState("");
  const [company_category, setCompanyCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const baseUrl = "http://localhost:8001/adminOn";


  async function submit(e) {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName || !designation || !company_name || !country || !city || !company_type || !company_category) {
      toast.warning("All fields are mandatory");
    } else {
      setIsLoading(true);

      try {
        const response = await axios.post(baseUrl + "/signup-employer", {
          email, password, firstName, lastName, designation, company_name, country, city, company_type, company_category
        });

        if (response.data.success) {
          setIsLoading(false);
          toast.success("Account Created.");

        } else {
          // Handle other errors or display a generic error toast
          setIsLoading(false);
          toast.error("An error occurred. Please try again later.");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data.error === "User already exists"
        ) {
          setIsLoading(false);
          toast.warning("User already exists. Please login to continue...");
        } else if (
          error.response &&
          error.response.data.error === "All fields are mandatory"
        ) {
          setIsLoading(false);
          toast.warning("All fields are mandatory");
        } else {
          setIsLoading(false);
          toast.error("Technical Error. Please try again later.");
        }
      }
    }
  }


  return (
    <>
      {/* <Grid container spacing='2'> */}

     
        <Grid container spacing="1" sx={{ height: "100vh" }}>
       

          <Grid item xs={12}>
            <form action="#" method="post">
              {isLoading ? (
               <Box
                                 sx={{
                                   position: 'fixed',
                                   top: '50%',
                                   left: '50%',
                                   transform: 'translate(-50%, -50%)',
                                   zIndex: 9999
                                 }}
                               >
                                 <CircularProgress />
                               </Box>
              ) : (
                <>
                  <Box
                    display="flex"
                    flexDirection={"column"}
                    maxWidth={450}
                    margin="auto"
                  >
                    <Typography variant="h5" padding={3} textAlign="center">
                      Creator Signup
                    </Typography>

                    <TextField
                      type="email"
                      id="email"
                      sx={{ marginBottom: "12px" }}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      variant="outlined"
                      label="Email"
                      margin="normal"

                    ></TextField>
                    <TextField
                      type="password"
                      id="password"
                      sx={{ marginBottom: "12px" }}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      variant="outlined"
                      label="Create a Password"

                    ></TextField>
                      <TextField
                      type="text"
                      id="firstName"
                      sx={{ marginBottom: "12px" }}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                      variant="outlined"
                      label="First Name"

                    ></TextField>

                     <TextField
                      type="text"
                      id="lastName"
                      sx={{ marginBottom: "12px" }}
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                      variant="outlined"
                      label="Last Name"

                    ></TextField>

                      <TextField
                      type="text"
                      id="designation"
                      sx={{ marginBottom: "12px" }}
                      onChange={(e) => {
                        setDesignation(e.target.value);
                      }}
                      variant="outlined"
                      label="Designation"

                    ></TextField>

                       <TextField
                      type="text"
                      id="companyName"
                      sx={{ marginBottom: "12px" }}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                      }}
                      variant="outlined"
                      label="Company Name"

                    ></TextField>

                      <TextField
                      type="text"
                      id="companyType"
                      sx={{ marginBottom: "12px" }}
                      onChange={(e) => {
                        setCompanyType(e.target.value);
                      }}
                      variant="outlined"
                      label="Company Type"

                    ></TextField>

                      <TextField
                      type="text"
                      id="companyCategory"
                      sx={{ marginBottom: "12px" }}
                      onChange={(e) => {
                        setCompanyCategory(e.target.value);
                      }}
                      variant="outlined"
                      label="Company Category"

                    ></TextField>

                      <TextField
                      type="text"
                      id="country"
                      sx={{ marginBottom: "12px" }}
                      onChange={(e) => {
                        setCountry(e.target.value);
                      }}
                      variant="outlined"
                      label="Country"

                    ></TextField>

                    
                      <TextField
                      type="text"
                      id="city"
                      sx={{ marginBottom: "12px" }}
                      onChange={(e) => {
                        setCity(e.target.value);
                      }}
                      variant="outlined"
                      label="City"

                    ></TextField>


                    {errorMessage && (
                      <p style={{ color: "red" }}>{errorMessage}</p>
                    )}

                    <Button
                      type="submit"
                      onClick={submit}
                      variant="contained"
                      sx={{
                        marginTop: 3,
                        marginBottom: 5,
                        textTransform: "capitalize",
                        fontWeight: "300",
                        fontSize: 16,
                        background: "#362FD9",
                      }}
                      size="large"
                    >
                      Create Account
                    </Button>

                  
                  </Box>
                </>
              )}

              <ToastContainer autoClose={2000} />
            </form>
          </Grid>
        </Grid>
   
    </>
  );
}

export default UserSignup;
