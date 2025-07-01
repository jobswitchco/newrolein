import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormLabel,
    Switch,
    Tooltip,
    Select,
    IconButton,
    AppBar,
    Slide,
    Toolbar,
    Accordion,
AccordionSummary,
AccordionDetails,
DialogContentText,
CircularProgress,
Menu
  } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SkillsComp from "./SkillsComp";
import JobPreferences from "./JobPreferences";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import JobRoleSelector from "./JobRoleSelector";
import UANDetails from "./UANDetails";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function CareerDetails() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // const baseUrl = "http://localhost:8001/usersOn";
      const baseUrl="/api/usersOn";

  const [ loading, setLoading ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({});
  const [open, setOpen] = useState(false);
  const [currEmpTrue, setCurrEmpTrue] = useState(false);
  const [isNameEditDialogOpen, setIsNameEditDialogOpen] = useState(false);
const [editApName, setEditApName] = useState('');
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
  


  
    const currentYear = new Date().getFullYear();
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const handleOpenNameEditDialog = () => {
  setEditApName(userDetails.applicantName || '');
  setIsNameEditDialogOpen(true);
};

  const handleClose = () => {
    setAnchorEl(null);
  };

const handleCloseNameEditDialog = () => {
  setIsNameEditDialogOpen(false);
};


 const handleSaveNameEdit = async () => {
    try {
      const response = await axios.post(
        baseUrl + '/update_anonymous_name',
        {editApName},
        { withCredentials: true }
      );

      if(response.data.success){

                handleCloseNameEditDialog();
              toast.success("Name updated successfully.");

       const updatedUserResponse = await axios.post(baseUrl + '/get-user-details', {}, { withCredentials: true });
              
              if (updatedUserResponse.data.success) {
                setUserDetails(updatedUserResponse.data.data);
              }

      }


    } catch (error) {
              toast.error("Error! Please try again.");

    }
  };

  


    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
const [selectedEmploymentId, setSelectedEmploymentId] = useState(null);

    const formatCTC = (amount, currency) => {
      if (currency === 'INR') {
        return new Intl.NumberFormat('en-IN').format(amount);
      }
      return amount;
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

                            await axios.post(baseUrl + "/get-user-details", { }, { withCredentials : true}).then(ress=>{
        
                              if(ress.data.success){
                                setUserDetails(ress.data.data);
                                // console.log('Data::::::::', ress.data.data);
                                const hasCurrentEmployment = ress.data.data.employmentDetails.some((curr) => curr.isCurrentEmployment);
                                setCurrEmpTrue(hasCurrentEmployment);
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

                  useEffect(() => {
                    if (userDetails && Object.keys(userDetails).length > 0) {
                      setFormData(prev => ({
                        ...prev,
                        isCurrentEmployment: userDetails?.employmentDetails?.length > 0 ? false : true
                      }));
                    }
                  }, [userDetails]);
                  

                    
    const [formData, setFormData] = React.useState({
      isCurrentEmployment: userDetails?.employmentDetails?.length > 0 ? false : true,
      employmentType: 'Full-time',
      totalExperienceYears: '',
      totalExperienceMonths: '',
      companyName: '',
      hideCurrentCompany: false,
      jobRoleId: '',
      fromYear: '',
      fromMonth: '',
      toYear: '',
      toMonth: '',
      ctc: '',
      currency: 'INR',
      noticePeriod: '',
      projects: [],
      workLocation: ''
    });

    const [projectForm, setProjectForm] = useState({
      projectName: '',
      roleInProject: '',
      responsibilities : '', 
      projectSummary: '',
      projectImpact: '',
      projectLinks: []
    });

    const [editingProjectIndex, setEditingProjectIndex] = useState(null);


    const handleProjectChange = (e) => {
      const { name, value } = e.target;
      setProjectForm(prev => ({ ...prev, [name]: value }));
    };

  //    const handleSelect = (cityId) => {
  //   setSelectedCities((prev) =>
  //     prev.includes(cityId)
  //       ? prev.filter((id) => id !== cityId)
  //       : [...prev, cityId]
  //   );
  // };

  const handleSelect = (cityId) => {
  setSelectedCity(cityId);
   setFormData((prev) => ({ ...prev, workLocation: cityId }));
  handleClose(); 
};

    
    const handleAddProject = () => {
      if (!projectForm.projectName || !projectForm.roleInProject) {
        toast.error("Project Name and Role are required");
        return;
      }
    
      if (editingProjectIndex !== null) {
        // Update existing project
        setFormData(prev => {
          const updatedProjects = [...prev.projects];
          updatedProjects[editingProjectIndex] = projectForm;
          return {
            ...prev,
            projects: updatedProjects,
          };
        });
        setEditingProjectIndex(null); // exit edit mode
      } else {
        // Add new project
        setFormData(prev => ({
          ...prev,
          projects: [...prev.projects, projectForm],
        }));
      }
    
      // Reset form
      setProjectForm({
        projectName: '',
        roleInProject: '',
        responsibilities: '',
        projectSummary: '',
        projectImpact: '',
      });
      setOpen(false); // close dialog
    };
    
    
    const handleDeleteProject = (indexToDelete) => {
      setFormData(prev => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== indexToDelete)
      }));
    };

    const handleProjectLinkChange = (e, idx) => {
      const updatedLinks = [...projectForm.projectLinks];
      updatedLinks[idx] = e.target.value;
      setProjectForm({ ...projectForm, projectLinks: updatedLinks });
    };
    
    const handleAddProjectLink = () => {
      setProjectForm({ ...projectForm, projectLinks: [...projectForm.projectLinks, ""] });
    };
    
    const handleRemoveProjectLink = (idx) => {
      const updatedLinks = projectForm.projectLinks.filter((_, i) => i !== idx);
      setProjectForm({ ...projectForm, projectLinks: updatedLinks });
    };


    const handleOpenDialog = (employmentId) => {
      setSelectedEmploymentId(employmentId);
      setOpenDeleteDialog(true);
    };
    
    const handleCloseDialog = () => {
      setOpenDeleteDialog(false);
      setSelectedEmploymentId(null);
    };
    
    

  function getTotalDuration(fromMonth, fromYear, toMonth, toYear, isCurrent) {
  const monthMap = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  // Handle edge cases: missing or invalid fromMonth or fromYear
  if (!fromMonth || !fromYear || !monthMap.hasOwnProperty(fromMonth)) return "N/A";

  const fromDate = new Date(fromYear, monthMap[fromMonth]);

  // If it's a current employment OR toMonth/toYear is missing/invalid, use current date
  const isToDateInvalid =
    isCurrent ||
    !toMonth ||
    !toYear ||
    !monthMap.hasOwnProperty(toMonth);

  const endDate = isToDateInvalid ? new Date() : new Date(toYear, monthMap[toMonth]);

  // Calculate total months
  let totalMonths =
    (endDate.getFullYear() - fromDate.getFullYear()) * 12 +
    (endDate.getMonth() - fromDate.getMonth());

  // Prevent negative durations
  totalMonths = Math.max(0, totalMonths);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const yearStr = years > 0 ? `${years} Year${years > 1 ? "s" : ""}` : "";
  const monthStr = months > 0 ? `${months} Month${months > 1 ? "s" : ""}` : "";

  return [yearStr, monthStr].filter(Boolean).join(" ") || "0 month";
}

    
                  const hasEmployment = userDetails?.employmentDetails?.length > 0;
              

const years = Array.from({ length: 16 }, (_, i) => currentYear - i);

    
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = async (event) => {
  setAnchorEl(anchorEl ? null : event.currentTarget);
  if (cities.length === 0) {
    await fetchJobLocations();
  }
};





  const handleSave = async () => {
    try {
      const response = await axios.post(
        baseUrl + '/save_employment_details',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if(response.data.saved){

        await fetchData();
        handleDialogClose();
        toast.success('Employment Saved');
      }

      else{
        handleDialogClose();
        toast.error('Error! Please try again');
      }
    } catch (error) {
        handleDialogClose();
       toast.error('Error! Please try again');
    }
  };



  const handleConfirmDelete = async () => {
    try {
      const response = await axios.post(
        baseUrl + '/delete_employment_details',
        { employment_id: selectedEmploymentId },
        { withCredentials: true }
      );
      if(response.data.deleted){

                await fetchData();
       toast.success('Employment Deleted');

      }

      else{

       toast.success('Server Error. Please try again');

      }
      // optionally update UI
    } catch (error) {
       toast.success('Server Error. Please try again');

    } finally {
      handleCloseDialog();
    }
  };
  

  const fetchJobLocations = async () => {
    try {
      const response = await axios.post(baseUrl + "/get_job_locations", {
        countryCode: 'IN',
      });
  
      if (response.data.fetched) {
        setCities(response.data.cities || []);
      } else {
        setCities([]);
      }
      return response.data.cities || [];
    } catch (error) {
      // console.error("Error fetching cities:", error);
      setCities([]);
      return [];
    }
  };

  const currencies = [
    { symbol: '₹', label: 'INR' },
    { symbol: '$', label: 'USD' },
    { symbol: '€', label: 'EUR' },
    { symbol: '£', label: 'GBP' },
    { symbol: '¥', label: 'JPY' },
    { symbol: '₩', label: 'KRW' },
    { symbol: '₽', label: 'RUB' },
    { symbol: 'C$', label: 'CAD' },
    { symbol: 'A$', label: 'AUD' },
    { symbol: 'S$', label: 'SGD' },
  ];
  







  return (
    <>
     
      <Grid container >
        {/* <Grid item xs={12} md={4}></Grid> */}

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

        <Grid xs={12} md={12} sx={{ pb: 2, mt: isSmallScreen ? 0 : 5, px: isSmallScreen ? 0 : 5}}>
        
          <Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              {/* <div
                style={{
                  width: isSmallScreen ? "30px" : "40px",
                  height: isSmallScreen ? "30px" : "40px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "inline-block",
                  marginTop : '4px'
                }}
              >
                <img
                  src={propic}
                  alt="propic"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div> */}

              <Stack sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography sx={{ fontSize: isSmallScreen ? "16px" : "20px" }}>{userDetails.applicantName}</Typography>
                  <CreateOutlinedIcon
                    sx={{ fontSize: isSmallScreen ? "16px" : "20px", cursor: "pointer" }}
                    onClick={handleOpenNameEditDialog}
                  />
                </Box>
                <Typography sx={{ fontSize: isSmallScreen ? "13px" : "14px", fontWeight: 300, color: "grey" }}>
                Recruiters see this name. It's editable.
                </Typography>
              </Stack>
            </Box>

            <Divider
              fullWidth
              sx={{
                borderBottomWidth: 2,
                borderColor: "#ccc",
                my: 2,
                width: isSmallScreen ? "100%" : "75%",
              }}
            />
          </Box>

          <div >
          
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                border: "1px solid grey",
                px: 2,
                py: 1,
                borderRadius : '8px'
              }}
            >
              <Stack sx={{ mt: 2, mb:2}}>

                <Stack sx={{ display : 'flex', flexDirection : 'row', gap: 1, alignItems : 'center'}}>
                  <BadgeOutlinedIcon sx={{ fontSize : '22px'}}/>
              <Typography sx={{ fontSize : '16px', fontWeight : 500, color : '#4535C1'}}>Employment</Typography>


                </Stack>


                 {/* Fetched Employment Details  */}
                 {userDetails?.employmentDetails
  ?.slice()
  .sort((a, b) => (b.isCurrentEmployment === true) - (a.isCurrentEmployment === true))
  .map((emp, index) => (
    <Box key={emp._id || index} sx={{ mt: 2, mb: 1 }}>
      <Stack direction="row" alignItems="center" gap={2} sx={{ alignItems : 'center'}}>
        <Typography sx={{ fontSize: '15px', fontWeight: 500 }}>
          {emp.jobRoleId.name}
        </Typography>
        <IconButton
  onClick={() => emp._id && handleOpenDialog(emp._id)}
  size="small"
>
  <DeleteOutlineOutlinedIcon sx={{ fontSize: '18px' }} />
</IconButton>


      </Stack>



      <Stack sx={{ display : 'flex', flexDirection : 'row', gap : 1}}>

         <Typography sx={{ fontSize: isSmallScreen ? '15px' : '16px', fontWeight: 400, mt: '4px' }}>
        {emp.companyName}
      </Typography>

  <Divider orientation="vertical" flexItem/>


       <Typography sx={{ fontSize: isSmallScreen ? '15px' : '16px', fontWeight: 400, mt: '4px' }}>
        {emp.workLocation.city}
      </Typography>

      </Stack>

     



      {isSmallScreen ? (
        <>
         <Stack direction="row" mt="6px" gap={1}>

      <Typography sx={{ fontSize: isSmallScreen ? '15px' : '16px', fontWeight: 400 }}>
    {emp.employmentType}
  </Typography>

  <Divider orientation="vertical" flexItem/>

   <Typography sx={{ fontSize: isSmallScreen ? '15px' : '16px', fontWeight: 400 }}>
  {getTotalDuration(
    emp.fromMonth,
    emp.fromYear,
    emp.toMonth,
    emp.toYear,
    emp.isCurrentEmployment
  )}
</Typography>

</Stack>

  <Typography sx={{ fontSize: isSmallScreen ? '15px' : '16px', fontWeight: 400, alignItems : 'center', mt: '6px'}}>

{emp.fromMonth} {emp.fromYear} -&nbsp;
    {emp.isCurrentEmployment
      ? 'present'
      : `${emp.toMonth} ${emp.toYear}`}
    &nbsp;
  </Typography>


  {/* <Divider orientation="vertical" flexItem sx={{ ml: 1, mr: 1}}/> */}



</>
      ) : (
         <Stack direction="row" mt="4px" gap={1}>
      <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
    {emp.employmentType}
  </Typography>

  <Divider orientation="vertical" flexItem/>

  <Stack sx={{ display : 'flex', flexDirection : 'row'}}>

 <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
  {getTotalDuration(
    emp.fromMonth,
    emp.fromYear,
    emp.toMonth,
    emp.toYear,
    emp.isCurrentEmployment
  )}
</Typography>


  <Divider orientation="vertical" flexItem sx={{ ml: 1, mr: 1}}/>

  <Typography sx={{ fontSize: '16px', fontWeight: 400, alignItems : 'center' }}>

{emp.fromMonth} {emp.fromYear} -&nbsp;
    {emp.isCurrentEmployment
      ? 'present'
      : `${emp.toMonth} ${emp.toYear}`}
    &nbsp;
  </Typography>
  </Stack>

</Stack>
      )}



{isSmallScreen ? (
  <>
  {emp.employmentType !== 'Internship' && (
    <>

  <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center'}}>


   <Typography sx={{ fontSize: '15px', fontWeight: 400, mt: '6px' }}>
  <Box component="span" sx={{ color: 'grey'  }}>
    CTC :
  </Box>{" "}
  {formatCTC(emp.ctc, emp.currency)}
</Typography>


    <Typography sx={{ fontSize: '15px', fontWeight: 300, mt: '6px' }}>
      {emp.currency}
    </Typography>

  </Stack>


  {emp.isCurrentEmployment && (
    <>
    
     <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
    <Typography sx={{ fontSize: '15px', fontWeight: 400, mt: '6px' }}>
      <Box component="span" sx={{ color: 'grey'  }}>
    Notice Period :
  </Box>{" "}
  {emp.noticePeriod}
    </Typography>
  </Stack>
  </>

  )}

</>

)}
</>) : (
  <>
  {emp.employmentType !== 'Internship' && (
  <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>

  <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>


   <Typography sx={{ fontSize: '16px', fontWeight: 400, mt: '4px' }}>
  <Box component="span" sx={{ color: 'grey'  }}>
    CTC :
  </Box>{" "}
  {formatCTC(emp.ctc, emp.currency)}
</Typography>


    <Typography sx={{ fontSize: '16px', fontWeight: 300, mt: '4px' }}>
      {emp.currency}
    </Typography>

  </Stack>


  {emp.isCurrentEmployment && (
    <>
  <Divider orientation="vertical" flexItem sx={{ ml: 1, mr: 1}}/>
    
     <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
    <Typography sx={{ fontSize: '16px', fontWeight: 400, mt: '4px' }}>
      <Box component="span" sx={{ color: 'grey'  }}>
    Notice Period :
  </Box>{" "}
  {emp.noticePeriod}
    </Typography>
  </Stack>
  </>

  )}

  </Stack>

)}
</>
)}




{emp.projects?.length > 0 && (
  <Accordion
    sx={{
      mt: 1,
      backgroundColor: 'transparent',
      boxShadow: 'none',
      border: 'none',
      '&::before': { display: 'none' }, // removes divider line
    }}
    disableGutters
    elevation={0}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreOutlinedIcon />}
      aria-controls="project-details-content"
      id="project-details-header"
      sx={{
        px: 0,
        py: 0.5,
        minHeight: 'auto',
        '& .MuiAccordionSummary-content': {
          margin: 0,
        },
      }}
    >
      <Typography sx={{ fontSize: '15px', fontWeight: 500 }}>Projects</Typography>
    </AccordionSummary>

    <AccordionDetails sx={{ px: 0, pt: 1 }}>
     {emp.projects.map((proj, index) => (
  <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#FAFAFA', borderRadius: 2 }}>
    <Typography sx={{ fontWeight: 500, fontSize: '16px', mb: 1 }}>{proj.projectName}</Typography>

    <Grid container spacing={1}>
      <Grid item xs={12} sm={2}>
        <Typography sx={{ fontWeight: 500, fontSize: '15px' }}>Role:</Typography>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Typography sx={{ fontSize: '15px' }}>{proj.roleInProject || 'N/A'}</Typography>
      </Grid>

      <Grid item xs={12} sm={2}>
        <Typography sx={{ fontWeight: 500, fontSize: '15px' }}>Summary:</Typography>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Typography sx={{ fontSize: '15px' }}>{proj.projectSummary || 'N/A'}</Typography>
      </Grid>

      <Grid item xs={12} sm={2}>
        <Typography sx={{ fontWeight: 500, fontSize: '15px' }}>Responsibilities:</Typography>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Typography sx={{ fontSize: '15px' }}>{proj.responsibilities || 'N/A'}</Typography>
      </Grid>

      <Grid item xs={12} sm={2}>
        <Typography sx={{ fontWeight: 500, fontSize: '15px' }}>Impact:</Typography>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Typography sx={{ fontSize: '15px' }}>{proj.projectImpact || 'N/A'}</Typography>
      </Grid>
    </Grid>

    {proj.projectLinks?.length > 0 && (
      <Box mt={2}>
        <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 0.5 }}>Links:</Typography>
        {proj.projectLinks.map((link, idx) => (
          <Typography
            key={idx}
            component="a"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#3A59D1',
              textDecoration: 'underline',
              fontSize: '14px',
              display: 'block',
              mb: 0.5,
            }}
          >
            {link}
          </Typography>
        ))}
      </Box>
    )}
  </Box>
))}

    </AccordionDetails>
  </Accordion>

)}

    </Box>


))}


              </Stack>
              <AddOutlinedIcon onClick={handleDialogOpen} sx={{ cursor: "pointer", mt: 2, fontSize : '26px', color: '#735557', ":hover": { color: "#261FB3" } }}/>

           
            </Box>

      <SkillsComp />
      <JobPreferences />
      <UANDetails />


          </div>





        </Grid>
                )}

      
      </Grid>

      

      
    

        <Dialog
  fullScreen
  open={isDialogOpen}
  onClose={handleDialogClose}
  TransitionComponent={Transition}
>
  <AppBar position="relative" sx={{ backgroundColor: "#fff", boxShadow: "none", borderBottom: "1px solid #e0e0e0" }}>
    <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>

      <Stack sx={{ display : 'flex', flexDirection : 'row', gap: 2, alignItems : 'center'}}>

      <IconButton edge="start" color="inherit" onClick={handleDialogClose} aria-label="close">
        <CloseIcon sx={{ color: "#000" }} />
      </IconButton>
      <Typography sx={{fontSize : '16px', textAlign: "center", color: "#000", fontWeight: 500 }}>
        Employment Details
      </Typography>
      </Stack>

      <Button
        onClick={handleSave}
        color="success"
        sx={{
          borderRadius: "18px",
          backgroundColor: "#3A59D1",
          color: "#FFFFFF",
          px: 3,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#5b9f61",
          },
        }}
      >
        Save
      </Button>
    </Toolbar>
  </AppBar>

  <DialogContent dividers sx={{ px: isSmallScreen ? 4 : 9, pt: 0 }}>
    {/* -- Your existing content here -- */}

    {/* Employment section */}
    <Typography sx={{ marginTop: '12px', fontSize: '16px', fontWeight: 500 }} gutterBottom>
      Employment
    </Typography>
    <Typography sx={{ marginTop: '12px', fontSize: '14px', color: 'grey' }} mb={2}>
      Details like job title, company name, etc, help employers understand your work
    </Typography>

    {/* Is current employment */}
    {hasEmployment && currEmpTrue ? ('') : (<>
      <FormLabel sx={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
      Is this your current employment?
    </FormLabel>
    <RadioGroup
  row
  name="isCurrentEmployment"
  value={formData.isCurrentEmployment}
  onChange={handleChange}
  sx={{ gap: 5, marginTop: '6px' }}
>


<Tooltip
    title={
      currEmpTrue
        ? 'Current employment details already added.'
        : ''
    }
    arrow
    placement="right-start"
    componentsProps={{
      tooltip: {
        sx: {
          backgroundColor: '#BCCCDC',
          fontSize: '16px',
          padding: '10px',
          borderRadius: '4px',
          color: 'black',
        },
      },
    }}
  >
    <span>
      <FormControlLabel
        value="yes"
        disabled={currEmpTrue}
        control={
          <Radio
            sx={{
              color: 'black',
              '&.Mui-checked': {
                color: 'black',
              },
            }}
          />
        }
        label={<Typography sx={{ fontSize: '14px', color: 'black' }}>Yes</Typography>}
      />
    </span>
  </Tooltip>

  {/* NO option */}
  <Tooltip
    title={
      !currEmpTrue
        ? 'You need to add current employment details.'
        : ''
    }
    arrow
    placement="right-start"
    componentsProps={{
      tooltip: {
        sx: {
          backgroundColor: '#BCCCDC',
          fontSize: '16px',
          padding: '10px',
          borderRadius: '4px',
          color: 'black',
        },
      },
    }}
  >
    <span>
      <FormControlLabel
        value="no"
        disabled={!currEmpTrue}
        control={
          <Radio
            sx={{
              color: 'black',
              '&.Mui-checked': {
                color: 'black',
              },
            }}
          />
        }
        label={<Typography sx={{ fontSize: '14px', color: 'black' }}>No</Typography>}
      />
    </span>
  </Tooltip>




</RadioGroup>
    </>)}
  


    {/* Employment type */}
    <FormLabel sx={{ fontSize: '14px', fontWeight: 500, color: '#000000', marginTop: '22px' }}>
      Employment Type
    </FormLabel>
    <RadioGroup
      row
      name="employmentType"
      value={formData.employmentType}
      onChange={handleChange}
      sx={{ gap: 5 }}
    >
      <FormControlLabel
        value="Full-time"
        control={<Radio sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
        label={<Typography sx={{ fontSize: '14px', color: 'black' }}>Full-time</Typography>}
      />
      <FormControlLabel
        value="Internship"
        control={<Radio sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
        label={<Typography sx={{ fontSize: '14px', color: 'black' }}>Internship</Typography>}
      />
    </RadioGroup>

    {/* Grid section */}
   
     <Grid container spacing={2} mt={1} mb={4}>


 <Grid container spacing={2} sx={{ pl: isSmallScreen ? 2 : 2, mt: 0.5}}>

     <Grid item xs={12} md={6}>
      <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 0.5,
            }}
          >

            <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
              {currEmpTrue ? 'Company Name' : 'Current Company'}
            </Typography>

   
          </Box>

          <TextField
            label={currEmpTrue?  !formData.companyName ? 'Company Name' : '' : !formData.companyName ? 'Current Company Name' : ''}
            name="companyName"
            fullWidth
            value={formData.companyName}
            onChange={handleChange}
            required
            slotProps={{
              inputLabel: {
                sx: {
                  fontSize: '14px',
                  '&.Mui-focused': { display: 'none' },
                  display: 'block',
                },
                shrink: false,
              },
            }}
          />

  
      </Box>

      </Grid>

      

<Grid item xs={12} md={6}>
  <Typography sx={{ fontSize: "14px", fontWeight: 500, mb: 0.5 }}>
    Work Location
  </Typography>

  <Box>
    <TextField
      label={!selectedCity ? "Select City" : ""}
      value={
        cities.find((city) => city._id === selectedCity)?.city || ""
      }
      onClick={handleToggle}
      fullWidth
      InputProps={{ readOnly: true }}
      sx={{ cursor: "pointer" }}
       slotProps={{ inputLabel: { sx: { fontSize: '14px' } } }}
    />

    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        style: { maxHeight: 200, width: 250, padding: "0.5rem" },
      }}
    >
      {cities.map((city) => (
        <MenuItem
          key={city._id}
          onClick={() => handleSelect(city._id)}
        >
          <FormControlLabel
            control={
              <Radio checked={selectedCity === city._id} />
            }
            label={city.city}
          />
        </MenuItem>
      ))}
    </Menu>
  </Box>
</Grid>




      

 </Grid>

   

      {/* Designation */}

      <Grid container spacing={2} sx={{ pl: isSmallScreen ? 2 : 2, mt: 0.5}}>

          <Grid item xs={12} md={6}>


        <JobRoleSelector
  selectedRoleId={formData.jobRoleId}
  onRoleSelect={(roleId) => setFormData({ ...formData, jobRoleId: roleId })}
/>

      </Grid>

        {/* CTC */}
      {( formData.employmentType !== 'Internship' && !currEmpTrue ) && (
      <Grid item xs={12} md={6}>
  <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 0.5 }}>
  {currEmpTrue?  'CTC' : 'Current CTC'}
  </Typography>
  <Box sx={{ display: 'flex', gap: 1, alignItems : 'center'}}>
   
    <Select
      value={formData.currency || 'INR'}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          currency: e.target.value,
        }))
      }
      displayEmpty
      variant="outlined"
      sx={{ minWidth: 80, height: '100%', fontSize: '14px' }}
    >
      {currencies.map((curr) => (
        <MenuItem key={curr.label} value={curr.label}>
          {curr.label}
        </MenuItem>
      ))}
    </Select>

    <TextField
    label={currEmpTrue?  !formData.ctc ? 'CTC' : '' : !formData.ctc ? 'Current CTC' : ''}
      name="ctc"
      type="number"
      value={formData.ctc}
      onChange={handleChange}
      required
      fullWidth
      sx={{ flex: 1 }}
      slotProps={{
        inputLabel: {
          sx: {
            fontSize: '14px',
            '&.Mui-focused': { display: 'none' },
            display: 'block',
          },
          shrink: false,
        },
      }}
    
    />
  </Box>
</Grid>
      )}

    
      </Grid>


      <Grid item xs={12}>

            { !currEmpTrue ? (
  <>

  <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 0.5}}>
          Working From
        </Typography>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              label={!formData.fromYear ? 'Year of Joining' : ''}
              name="fromYear"
              select
              fullWidth
              value={formData.fromYear}
              onChange={handleChange}
              slotProps={{ inputLabel: { sx: { fontSize: '14px' } } }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label={!formData.fromMonth ? 'Month of Joining' : ''}
              name="fromMonth"
              select
              fullWidth
              value={formData.fromMonth}
              onChange={handleChange}
              slotProps={{ inputLabel: { sx: { fontSize: '14px' } } }}
            >
              {months.map((month, index) => (
                <MenuItem key={index} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        
        </>
        
      ) : (
        
        <>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 0.5}}>
          Joining date
        </Typography>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              label={!formData.fromYear ? 'Select Year' : ''}
              name="fromYear"
              select
              fullWidth
              value={formData.fromYear}
              onChange={handleChange}
              slotProps={{ inputLabel: { sx: { fontSize: '14px' } } }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label={!formData.fromMonth ? 'Select Month' : ''}
              name="fromMonth"
              select
              fullWidth
              value={formData.fromMonth}
              onChange={handleChange}
              slotProps={{ inputLabel: { sx: { fontSize: '14px' } } }}
            >
              {months.map((month, index) => (
                <MenuItem key={index} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 0.5, mt : 3}}>
          Worked till
        </Typography>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              label={!formData.toYear ? 'Select Year' : ''}
              name="toYear"
              select
              fullWidth
              value={formData.toYear || ''}
              onChange={handleChange}
              slotProps={{ inputLabel: { sx: { fontSize: '14px' } } }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label={!formData.toMonth ? 'Select Month' : ''}
              name="toMonth"
              select
              fullWidth
              value={formData.toMonth}
              onChange={handleChange}
              slotProps={{ inputLabel: { sx: { fontSize: '14px' } } }}
            >
              {months.map((month, index) => (
                <MenuItem key={index} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
          </>

        ) }
      </Grid>
    
    

    


{currEmpTrue ? ('') : (<>
  <Grid item xs={12} >
  <Typography sx={{ fontSize: "14px", fontWeight: 500, mb: 0.5 }}>
    Notice Period
  </Typography>
  <TextField
    name="noticePeriod"
    select
    fullWidth
    value={formData.noticePeriod}
    onChange={handleChange}
    label={!formData.noticePeriod ? "Select Notice Period" : ""}
    slotProps={{
      inputLabel: {
        sx: {
          fontSize: "14px",
          "&.Mui-focused": {
            display: "none",
          },
          display: "block",
        },
        shrink: false,
      },
    }}
  >
    {[
      "15 Days or less",
      "1 Month",
      "2 Months",
      "3 Months",
      "Serving Notice Period",
    ].map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
</Grid>
</>)}


<Grid item xs={12} mt={3}>
  <Stack sx={{ display : 'flex', flexDirection : 'row', gap : 2, alignItems : 'center'}}>

  <Typography sx={{ fontSize: '16px', fontWeight: 500, mb: 0.5 }}>
    Projects
  </Typography>

  <Button
  variant="outlined"
  size="small"
  startIcon={<AddOutlinedIcon />}
  sx={{
    textTransform: 'none',
    borderStyle: 'dashed',
    borderColor: 'gray',
    color: 'grey'
  }}
  onClick={() => setOpen(true)}
>
  Add project
</Button>



  </Stack>

  <Typography sx={{ marginTop: '12px', fontSize: '14px', color: 'grey' }} mb={2}>
      Share projects you worked on in this organization to showcase your contributions.
    </Typography>

    <Box mt={2}>
  {formData.projects.map((proj, index) => (
    <Box key={index} sx={{ mt: 1, p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
     <Stack sx={{ display : 'flex', flexDirection : 'row'}}>

      <Box>
        <Stack sx={{ display : 'flex', flexDirection : 'row', alignItems : 'center', gap: 2}}>
      <Typography sx={{ fontSize : '15px', fontWeight : 500}}>{proj.projectName}</Typography>
     
     <Stack sx={{ display : 'flex', flexDirection : 'row', gap : 1}}>
     <DeleteOutlineOutlinedIcon 
      sx={{ color : '#E55050', fontSize : '22px', cursor : 'pointer'}}
      onClick={() => handleDeleteProject(index)} />
    <EditOutlinedIcon 
  sx={{ color: '#393E46', fontSize: '22px', cursor: 'pointer' }}
  onClick={() => {
    setProjectForm(proj);              // populate form with selected project
    setEditingProjectIndex(index);     // store index to update later
    setOpen(true);                     // open dialog
  }}
/>


     </Stack>
     
        </Stack>
      <Typography sx={{ fontSize : '14px', fontWeight : 400, mt: 1}}>{proj.roleInProject}</Typography>
      <Typography sx={{ fontSize : '14px', fontWeight : 400, mt: 0.5}}>{proj.projectSummary}</Typography>
      <Typography sx={{ fontSize : '14px', fontWeight : 400, mt: 1}}>{proj.responsibilities}</Typography>
      <Typography sx={{ fontSize : '14px', fontWeight : 400, mt: 0.5}}>{proj.projectImpact}</Typography>
      {proj.projectLinks && proj.projectLinks.length > 0 && (
    <Box mt={1}>
      {proj.projectLinks.map((link, idx) => (
        <Typography
          key={idx}
          sx={{ fontSize: '14px', color: '#3A59D1', textDecoration: 'underline', cursor: 'pointer', mr: 1 }}
          component="a"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link}
        </Typography>
      ))}
    </Box>
  )}
      </Box>



     </Stack>
    
    </Box>
  ))}
</Box>
  </Grid>


    </Grid>
  </DialogContent>

</Dialog>

<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontSize : '18px', fontWeight : 500}}>Add Project Details</DialogTitle>
        <DialogContent dividers >
          <Stack mt={1}>
          <Typography sx={{ fontSize: "14px", fontWeight: 500, mb: 0.5 }}>
            Project Name
          </Typography>
            <TextField
              name="projectName"
             label={!projectForm.projectName ? "e.g., Invoice Automation System, Sales Dashboard" : "" }
              fullWidth
              value={projectForm.projectName}
              onChange={handleProjectChange}
              slotProps={{
                inputLabel: {
                  sx: {
                    fontSize: "14px",
                    "&.Mui-focused": {
                      display: "none",
                    },
                    display: "block",
                  },
                  shrink: false,
                },
              }}
            />

<Typography sx={{ fontSize: "14px", fontWeight: 500, mb: 0.5, mt : 2 }}>
            Role
          </Typography>
            <TextField
              name="roleInProject"
              label={!projectForm.roleInProject ? "eg., UI/UX Designer, Lead Developer" : "" }
              fullWidth
              value={projectForm.roleInProject}
              onChange={handleProjectChange}
              slotProps={{
                inputLabel: {
                  sx: {
                    fontSize: "14px",
                    "&.Mui-focused": {
                      display: "none",
                    },
                    display: "block",
                  },
                  shrink: false,
                },
              }}
            />

<Typography sx={{ fontSize: "14px", fontWeight: 500, mb: 0.5, mt : 2 }}>
            Project Summary
          </Typography>
            <TextField
              name="projectSummary"
              label={!projectForm.projectSummary ? "e.g., Developed a scalable API system to handle 1M+ users" : ""}
              fullWidth
              multiline
              value={projectForm.projectSummary}
              onChange={handleProjectChange}
              sx={{
                '& .MuiInputBase-root': {
                  minHeight: '120px', // Fixed overall field height
                  alignItems: 'flex-start', // Align text to top
                },
                '& .MuiInputBase-inputMultiline': {
                  height: '100%', // Ensure textarea fills the container
                  overflow: 'auto', // Scroll if content overflows
                },
              }}
              slotProps={{
                inputLabel: {
                  sx: {
                    fontSize: "14px",
                    "&.Mui-focused": {
                      display: "none",
                    },
                    display: "block",
                  },
                  shrink: false,
                },
              }}
            />

            <Typography sx={{ fontSize: "14px", fontWeight: 500, mb: 0.5, mt : 2 }}>
            Responsibilities
          </Typography>
            <TextField
              name="responsibilities"
              label={!projectForm.responsibilities ? "e.g., Handled all backend API calls" : ""}
              fullWidth
              multiline
              value={projectForm.responsibilities}
              onChange={handleProjectChange}
              sx={{
                '& .MuiInputBase-root': {
                  minHeight: '120px',
                  alignItems: 'flex-start',
                },
                '& .MuiInputBase-inputMultiline': {
                  height: '100%',
                  overflow: 'auto',
                },
              }}
              slotProps={{
                inputLabel: {
                  sx: {
                    fontSize: "14px",
                    "&.Mui-focused": {
                      display: "none",
                    },
                    display: "block",
                  },
                  shrink: false,
                },
              }}
            />

<Stack sx={{ display : 'flex', flexDirection : 'row', gap: 0.5}}>
<Typography sx={{ fontSize: "14px", fontWeight: 500, mb: 0.5, mt : 2 }}>
            Project Impact
          </Typography>

          <Typography sx={{ fontSize: "14px", fontWeight: 400, mb: 0.5, mt : 2, color : 'grey' }}>
          (optional)
          </Typography>
          </Stack>


            <TextField
              name="projectImpact"
              label={!projectForm.projectImpact ? "e.g., Boosted conversion rate by 25% through UX improvements" : "" }
              fullWidth
              multiline
              value={projectForm.projectImpact}
    onChange={handleProjectChange}
              slotProps={{
                inputLabel: {
                  sx: {
                    fontSize: "14px",
                    "&.Mui-focused": {
                      display: "none",
                    },
                    display: "block",
                  },
                  shrink: false,
                },
              }}
            />


<Stack sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, mt: 2, alignItems : 'center' }}>
  <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
    Project Links
  </Typography>
  <Typography sx={{ fontSize: "14px", fontWeight: 400, color: 'grey' }}>
    (optional)
  </Typography>
</Stack>

{(projectForm.projectLinks || []).map((link, idx) => (
  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
    <TextField
    name="projectLinks"
      fullWidth
      placeholder="e.g., https://github.com/project, https://projectdemo.com"
      value={link}
      onChange={(e) => handleProjectLinkChange(e, idx)}
      sx={{
        flexGrow: 1,
        '& input::placeholder': {
          fontSize: '14px',
        },
      }}
    />
    <Button
      onClick={() => handleRemoveProjectLink(idx)}
      sx={{ minWidth: 0, ml: 1 }}
    >
      ❌
    </Button>
  </Box>
))}

<Button
  onClick={handleAddProjectLink}
  variant="outlined"
  sx={{ mt: 1, width: 'fit-content', textTransform: 'none', color : '#7F55B1' }}
>
  ➕ Add link
</Button>



          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color : 'grey'}}>
            Cancel
          </Button>
          <Button
          onClick={handleAddProject}
        color="success"
        sx={{
          borderRadius: "18px",
          backgroundColor: "#3A59D1",
          color: "#FFFFFF",
          px: 3,
          mr: 2,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#5b9f61",
          },
        }}
      >
        Save
      </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
  <DialogTitle>Delete Employment</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete this employment entry? This action cannot be undone.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} color="primary" sx={{ textTransform : 'none'}}>
      Cancel
    </Button>
    <Button onClick={handleConfirmDelete} color="error" variant="contained" sx={{ textTransform : 'none'}}>
      Delete
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={isNameEditDialogOpen} onClose={handleCloseNameEditDialog}>
  <DialogTitle sx={{ fontSize : isSmallScreen ? '16px' : '18px'}}>Edit Applicant Name</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="Applicant Name"
      fullWidth
      value={editApName}
      onChange={(e) => setEditApName(e.target.value)}
    />
   
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseNameEditDialog}>Cancel</Button>
    <Button onClick={handleSaveNameEdit} variant="contained">Save</Button>
  </DialogActions>
</Dialog>


    

    </>
  );
}

export default CareerDetails;
