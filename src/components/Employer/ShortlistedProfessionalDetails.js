
import { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Avatar, CircularProgress, Dialog, IconButton, DialogContent, Divider, Chip, Stack, Tabs, Tab, Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import axios from 'axios';
import manImage from '../../images/man-6086273_1280.jpg';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';


const ShortlistedProfessionalDetails = ({userId, open, onClose}) => {
  const [user, setUser] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const baseUrl = "http://localhost:8001/employersOn";
      const baseUrl="/api/employersOn";

  const [activeTab, setActiveTab] = useState(0);
   const [shortlisted, setShortlisted] = useState(false);
   const [invited, setInvited] = useState(false);


const handleTabChange = (event, newValue) => {
  setActiveTab(newValue);
};

const handleClick = async () => {
  if (shortlisted || isLoading) return;

  setIsLoading(true);
  try {
    const res = await axios.post(
      baseUrl + '/shortlist-a-candidate',
      { userId },
      { withCredentials: true }
    );
    if (res.data.success) {
      setShortlisted(true);
      toast.success("Added to Shortlist");
    }
  } catch (err) {
    console.error("Shortlisting failed", err);
  } finally {
    setIsLoading(false);
  }
};



 const formatCTC = (amount, currency) => {
      if (currency === 'INR') {
        return new Intl.NumberFormat('en-IN').format(amount);
      }
      return amount; // return as-is for other currencies
    };


 useEffect(() => {
 

  if (userId) {
    axios.post(baseUrl + '/get-professional-details', { userId }, { withCredentials: true })
      .then(res => {
        setUser(res.data);
        setShortlisted(res.data.isShortlisted)
        setInvited(res.data.isInvited)
        setIsDataLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user details:', err);
        setIsDataLoading(false);
      });
  }
}, [userId]);


 if (isDataLoading) {
  return (
    <Dialog
      open={open}
      fullScreen
      onClose={onClose} 
      slotProps={{
        paper: {
          sx: {
            width: '84vw',
            height: '100vh',
            ml: 'auto',
            borderRadius: 0,
            position: 'relative',
          },
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 20,
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Centered Loader with Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        <CircularProgress />
      </Box>
    </Dialog>
  );
}


  if (!user) {
    return (
      <Dialog open={open} fullScreen>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Typography variant="h6">User not found</Typography>
        </Box>
      </Dialog>
    );
  }

  const { basicDetails, employmentDetails = [], jobPreferences, skills =[]} = user;

  return (
    
    <Dialog 
     open={open}
     fullScreen
     slotProps={{
    paper: {
      sx: {
        width: '84vw',
        height: '100vh',
        ml: 'auto',
        borderRadius: 0,
      },
    },
  }}>


      <Box position="absolute" top={10} right={10}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent>



        <Grid container>
          
                <>
          {/* Left Panel */}
          <Grid item xs={12} md={4} sx={{ border : '1px solid grey', mt: 3, height : '90vh', borderRadius : 1, px: 1}}>
           <Box
  sx={{
    display: 'flex',
    flexDirection : 'column',
    alignItems: 'center',
    justifyContent: 'center', 
    height: '150px'             
  }}
>
  <Avatar
    alt={basicDetails?.fullName || "User"}
    src={manImage}
    sx={{ width: 100, height: 100 }}
  />
  <Typography sx={{  mt: 1, fontSize : '16px'}}>{basicDetails?.name} </Typography>
</Box>


            <Divider sx={{ my: 3 }} />

            {employmentDetails?.map((employment, index) => {
              if (employment.isCurrentEmployment && employment.jobRole) {
                const totalExpInMonths = employment.totalExpInMonths || 0;
                const years = Math.floor(totalExpInMonths / 12);
                const months = totalExpInMonths % 12;

                return (

                    <>
                  <Box key={index} mb={2} sx={{ background : '#F5F5F5', mx: 2, px: 2, py: 1, borderRadius : 1 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>
                      {employment.jobRole.name}
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                      {years > 0 && `${years} Year${years > 1 ? 's' : ''}`}
                      {years > 0 && months > 0 ? ' ' : ''}
                      {months > 0 && `${months} Month${months > 1 ? 's' : ''}`}
                    </Typography>
                  </Box>

<Box sx={{ mt: 5, mx: 2}}>
  <Typography sx={{ fontSize : '15px', fontWeight: 500, mb: 1 }}>
    Skills
  </Typography>

  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
    {skills?.map((skill, index) => (
      <Chip
        key={index}
        label={skill.name}
        sx={{
          px: 1,
          py: 1,
          backgroundColor: skill.color,
          fontWeight: 400,
          fontSize: '14px',
          borderRadius: '16px'
        }}
      />
    ))}
  </Box>
</Box>



{/* ----------------------------Shortlist button------------------------ */}

  <Box
      sx={{
        mt: 4,
        mx: 2,
        background: shortlisted ? '#1E5631' : '#3F7D58',
        width: 'fit-content',
        py: '6px',
        px: 2,
        borderRadius: '22px',
        cursor: shortlisted ? 'default' : 'pointer',
        position: 'relative',
        minWidth: 120,
      }}
       onClick={handleClick}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          <CircularProgress size={20} sx={{ color: '#fff' }} />
        </Box>
      )}

      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        justifyContent="center"
        sx={{
          opacity: isLoading ? 0.3 : 1,
        }}
      >
      {invited ? (
  <>
    <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
    <Typography sx={{ fontSize: '15px', color: '#FFFFFF' }}>Invited</Typography>
  </>
) : shortlisted ? (
  <>
    <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
    <Typography sx={{ fontSize: '15px', color: '#FFFFFF' }}>Shortlisted</Typography>
  </>
) : (
  <Typography sx={{ fontSize: '15px', color: '#FFFFFF' }}>Shortlist</Typography>
)}


      </Stack>
    </Box>

{/* ----------------------------Shortlist button------------------------ */}

           <ToastContainer autoClose= {2000}/>


                   

                    </>

                );
              }
              return null;
            })}
          </Grid>

          {/* Right Panel */}
        <Grid item xs={12} md={8} sx={{ mt: 3, pl: 2 }}>
  {/* Tabs Header */}
  <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
    <Tab label="Employment Details" sx={{ textTransform : 'none'}}/>
    <Tab label="Projects" sx={{ textTransform : 'none'}}/>
    <Tab label="Job Preferences" sx={{ textTransform : 'none'}}/>
  </Tabs>

  <Box mt={2}>
 {activeTab === 0 && (
  <Box>
   {activeTab === 0 && (
  <Box>
    {employmentDetails
      ?.slice()
      .sort((a, b) => (b.isCurrentEmployment === true) - (a.isCurrentEmployment === true))
      .map((emp, index) => (
        <Box key={emp._id || index} sx={{ mt: 4, mb: 6 }}>
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography sx={{ fontSize: '15px', fontWeight: 500 }}>
              {emp.jobRole?.name}
            </Typography>
          
          </Stack>

          {emp.hideCompanyName ? (
           <Tooltip
  title={
    emp.hideCompanyName
      ? 'Current company name is hidden by the working professional.'
      : ''
  }
  arrow
>
  <Typography
    sx={{
      fontSize: '16px',
      fontWeight: 400,
      mt: '4px',
      filter: emp.hideCompanyName ? 'blur(3px)' : 'none',
      userSelect: emp.hideCompanyName ? 'none' : 'auto',
      cursor: emp.hideCompanyName ? 'help' : 'default'
    }}
  >
    {emp.companyName}
  </Typography>
</Tooltip>


          ) : (
            <Typography sx={{ fontSize: '16px', fontWeight: 400, mt: '4px' }}>
            {emp.companyName}
          </Typography>
          )}

          

          <Stack direction="row" mt="4px" gap={1}>
            <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
              {emp.employmentType}
            </Typography>

            <Divider orientation="vertical" flexItem />

             <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
    {Math.floor(emp.totalExpInMonths / 12)} Year
    {Math.floor(emp.totalExpInMonths / 12) !== 1 ? 's' : ''}&nbsp;
    {emp.totalExpInMonths % 12 > 0 && (
      <>
        {emp.totalExpInMonths % 12} Month
        {emp.totalExpInMonths % 12 !== 1 ? 's' : ''}
      </>
    )}
  </Typography>

            <Divider orientation="vertical" flexItem />




            <Stack direction="row" alignItems="center">
              <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
                {emp.fromMonth} {emp.fromYear} – {' '}
                {emp.isCurrentEmployment
                  ? 'Present'
                  : `${emp.toMonth} ${emp.toYear}`}
              </Typography>
            </Stack>
          </Stack>

          {emp.employmentType !== 'Internship' && (
            <Stack direction="row" alignItems="center" gap={1} mt={1}>
              <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
                <Box component="span" sx={{ color: 'grey' }}>
                  CTC:
                </Box>{' '}
                {formatCTC(emp.ctc, emp.currency)}
              </Typography>

              <Typography sx={{ fontSize: '16px', fontWeight: 300 }}>
                {emp.currency}
              </Typography>

              {emp.isCurrentEmployment && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ ml: 1, mr: 1 }} />
                  <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
                    <Box component="span" sx={{ color: 'grey' }}>
                      Notice Period:
                    </Box>{' '}
                    {emp.noticePeriod}
                  </Typography>
                </>
              )}
            </Stack>
          )}

     
        </Box>
      ))}
  </Box>
)}

  </Box>
)}


 {activeTab === 1 && (
  <Box>
    {employmentDetails
      ?.filter(emp => emp.projects && emp.projects.length > 0)
      .map((emp, empIndex) => (
        <Box key={emp._id || empIndex} mb={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
            @ {emp.companyName || 'Company'}
          </Typography>

          {emp.projects.map((proj, projIndex) => (
            <Box
              key={projIndex}
              sx={{
                mt: 1.5,
                p: 2,
                backgroundColor: '#FAFAFA',
                borderRadius: 2,
              }}
            >
              <Typography sx={{ fontSize: '16px', fontWeight: 500, mb: 2 }}>
                {proj.projectName}
              </Typography>

              <Grid container spacing={1} mb={1}>
                <Grid item sx={{ width: 80 }}>
                  <Typography sx={{ fontSize: '15px', fontWeight: 500 }}>Role</Typography>
                </Grid>
                <Grid item xs>
                  <Typography sx={{ fontSize: '15px' }}>{proj.roleInProject}</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={1} mb={1}>
                <Grid item sx={{ width: 80 }}>
                  <Typography sx={{ fontSize: '15px', fontWeight: 500 }}>Summary</Typography>
                </Grid>
                <Grid item xs>
                  <Typography sx={{ fontSize: '15px' }}>{proj.projectSummary}</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={1} mb={1}>
                <Grid item sx={{ width: 80 }}>
                  <Typography sx={{ fontSize: '15px', fontWeight: 500 }}>Impact</Typography>
                </Grid>
                <Grid item xs>
                  <Typography sx={{ fontSize: '15px' }}>{proj.projectImpact}</Typography>
                </Grid>
              </Grid>

              {proj.projectLinks?.length > 0 && (
                <Box mt={2}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 0.5 }}>Links:</Typography>
                  {proj.projectLinks.map((link, linkIndex) => (
                    <Typography
                      key={linkIndex}
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
                        wordBreak: 'break-word',
                      }}
                    >
                      {link}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ))}
  </Box>
)}


{activeTab === 2 && (
  <Box sx={{ mt: 5}}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ fontSize : '15px', fontWeight: 500, width: 240 }}>Preferred Company Type</Typography>
       <Typography>
  {jobPreferences?.pref_company_type === 'Any'
    ? 'MNC, StartUp'
    : jobPreferences?.pref_company_type || 'N/A'}
</Typography>

      </Box>

    <Box sx={{ display: 'flex' }}>
  <Typography sx={{fontSize : '15px', fontWeight: 500, width: 240 }}>Preferred Locations</Typography>
  <Typography>
    {jobPreferences?.pref_job_locations?.length > 0
      ? jobPreferences.pref_job_locations.map(loc => loc.city).join(", ")
      : "N/A"}
  </Typography>
</Box>


      <Box sx={{ display: 'flex' }}>
        <Typography sx={{fontSize : '15px', fontWeight: 500, width: 240 }}>Job Type</Typography>
        <Typography>
          {jobPreferences?.pref_job_type || "N/A"}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Typography sx={{fontSize : '15px', fontWeight: 500, width: 240 }}>Expected CTC</Typography>
        <Typography>
          {jobPreferences?.expected_ctcFrom && jobPreferences?.expected_ctcTo
            ? `₹${formatCTC(jobPreferences.expected_ctcFrom, 'INR')} - ₹${formatCTC(jobPreferences.expected_ctcTo, 'INR')} INR`
            : "N/A"}
        </Typography>
      </Box>
    </Box>
  </Box>
)}


  
  </Box>
</Grid>
</>

        </Grid>


      </DialogContent>
    </Dialog>
  );
};

export default ShortlistedProfessionalDetails;


