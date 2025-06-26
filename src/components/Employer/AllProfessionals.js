import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Pagination, Typography, Stack, Tooltip, IconButton, Box,
  Slide, Dialog, DialogTitle, DialogContent, Autocomplete, TextField, Button, MenuItem, Chip
} from '@mui/material';
import axios from 'axios';
        import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
        import { useNavigate } from "react-router-dom";
        import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import FilterAltIcon from '@mui/icons-material/FilterListOutlined';
import useDebounce from './useDebounce'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ProfessionalDetails from './ProfessionalDetails';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
        


  const baseUrl = "http://localhost:8001/employersOn";
  const searchRoleUrl = "http://localhost:8001/usersOn";



const AllProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

const [filterDialogOpen, setFilterDialogOpen] = useState(false);
const [roleInput, setRoleInput] = useState('');
const [roleOptions, setRoleOptions] = useState([]);
const [selectedRole, setSelectedRole] = useState(null);
const debouncedRoleInput = useDebounce(roleInput, 400);
const [experience, setExperience] = useState('');
const [ctcRange, setCtcRange] = useState({ from: '', to: '' });
const [noticePeriod, setNoticePeriod] = useState('');
const [appliedFilters, setAppliedFilters] = useState({});
const [selectedUserId, setSelectedUserId] = useState(null);
const [dialogOpen, setDialogOpen] = useState(false);



   const handleSessionExpired = () => {
          toast.error("Session expired. Please log in again.");
            navigate('/employer/login');
        };
  

  useEffect(() => {
          const verifyToken = async () => {
            setLoading(true);
          
            try {
              const res = await axios.get(`${baseUrl}/verify-login-token`, { withCredentials: true });
          
              if (res.data.valid) {
                await fetchProfessionals();
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


        useEffect(() => {
  const fetchRoles = async () => {
    if (!debouncedRoleInput) return;
    try {
      const res = await axios.get(`${searchRoleUrl}/search-roles`, {
        params: { query: debouncedRoleInput }
      });
      if (res.data.success) setRoleOptions(res.data.roles || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };
  fetchRoles();
}, [debouncedRoleInput]);

const applyFilters = () => {
  const filters = {
    roleId: selectedRole?._id || null,
    roleName: selectedRole?.name || null,
    experience: experience || null,
    ctcFrom: ctcRange.from || null,
    ctcTo: ctcRange.to || null,
    noticePeriod: noticePeriod || null
  };
  setAppliedFilters(filters);
  setFilterDialogOpen(false);
  fetchProfessionals(1, filters);
};

const handleRemoveFilter = (key) => {
  const updatedFilters = { ...appliedFilters };

  if (key === 'role') {
    delete updatedFilters.roleId;
    delete updatedFilters.roleName;
    setSelectedRole(null);
  } else if (key === 'ctc') {
    delete updatedFilters.ctcFrom;
    delete updatedFilters.ctcTo;
    setCtcRange({ from: '', to: '' });
  } else {
    delete updatedFilters[key];
    if (key === 'experience') setExperience('');
    if (key === 'noticePeriod') setNoticePeriod('');
  }

  setAppliedFilters(updatedFilters);
  fetchProfessionals(1, updatedFilters);
};





 const fetchProfessionals = async (page, filters = {}) => {
  setLoading(true);
  try {
    const response = await axios.post(
      `${baseUrl}/get-all-professional-details`,
      { page, limit: 8, filters },
      { withCredentials: true }
    );

    setProfessionals(response.data.users || []);
    setTotalPages(response.data.totalPages || 1);
  } catch (error) {
    console.error('Error fetching professionals:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProfessionals(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

   const formatCTC = (amount) => {
        return new Intl.NumberFormat('en-IN').format(amount);
    };


  return (
    <div sx={{ padding: 2 }}>

      {loading ? (
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
       

   <Box sx={{ pl: 2, py: 2, mb: 1, background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 
 <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems : 'center' }}>
  <Typography sx={{fontSize : '18px', fontWeight: 500 }}>Working Professionals</Typography>

  <Box sx={{ mt: 0.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>

    {appliedFilters.roleName && (
      <Chip
        label={`Role: ${appliedFilters.roleName}`}
        onDelete={() => handleRemoveFilter('role')}
        size="small"
        sx={{ px: 1, py: '16px'}}
      />
    )}
    {appliedFilters.experience && (
      <Chip
        label={`Experience: >${appliedFilters.experience} years`}
        onDelete={() => handleRemoveFilter('experience')}
        size="small"
        sx={{ px: 1, py: '16px'}}

      />
    )}
    {(appliedFilters.ctcFrom || appliedFilters.ctcTo) && (
      <Chip
        label={`CTC: ${appliedFilters.ctcFrom ? '₹' + appliedFilters.ctcFrom : ''}${appliedFilters.ctcFrom && appliedFilters.ctcTo ? ' - ' : ''}${appliedFilters.ctcTo ? '₹' + appliedFilters.ctcTo : ''}`}
        onDelete={() => handleRemoveFilter('ctc')}
        size="small"
        sx={{ px: 1, py: '16px'}}

      />
    )}
    {appliedFilters.noticePeriod && (
      <Chip
        label={`Notice Period: ${appliedFilters.noticePeriod}`}
        onDelete={() => handleRemoveFilter('noticePeriod')}
        size="small"
        sx={{ px: 1, py: '16px'}}

      />
    )}
  </Box>
</Box>


  <IconButton onClick={() => setFilterDialogOpen(true)}>
    <FilterAltIcon color="primary" />
  </IconButton>
</Box>


       
       <TableContainer component={Paper}>

<Table>
  
  <TableHead>

    <TableRow>
      <TableCell>
        <Typography sx={{ fontSize : '14px', fontWeight : 500, color : 'grey'}}>S.No</Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize : '14px', fontWeight : 500, color : 'grey'}}>Name</Typography>

      </TableCell>
      <TableCell>
        <Stack sx={{ display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
        <Typography sx={{ fontSize : '14px', fontWeight : 500, color : 'grey'}}>Role</Typography>
        
        <Typography sx={{ fontSize : '13px', color : 'grey', ml: '4px'}}>(current)</Typography>
        </Stack>
      </TableCell>
        
      <TableCell>
        <Typography sx={{ fontSize : '14px', fontWeight : 500, color : 'grey'}}>Experience</Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize : '14px', fontWeight : 500, color : 'grey'}}>CTC</Typography>

      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize : '14px', fontWeight : 500, color : 'grey'}}>Company</Typography>

      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize : '14px', fontWeight : 500, color : 'grey'}}>Notice Period</Typography>

      </TableCell>
        
      <TableCell>
        <Typography sx={{ fontSize : '14px', fontWeight : 500, color : 'grey'}}>Action</Typography>
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    { professionals && professionals.map((user, index) => {
      const currentEmployment = user.employmentDetails?.find(emp => emp.isCurrentEmployment);
      const fallbackEmployment = user.employmentDetails?.[0];

      const designation = currentEmployment?.jobRole.name || fallbackEmployment?.jobRole.name || 'N/A';
      const designationColor = currentEmployment?.jobRole.color || fallbackEmployment?.jobRole.color;
      const currentCtc = currentEmployment?.ctc || fallbackEmployment?.ctc || 'N/A';
      const noticePeriod = currentEmployment?.noticePeriod || fallbackEmployment?.noticePeriod || 'N/A';
   const rawCompanyName = currentEmployment?.companyName || fallbackEmployment?.companyName || 'N/A';
const truncatedName = rawCompanyName.length > 15
  ? rawCompanyName.slice(0, 15) + '...'
  : rawCompanyName;

      const experienceSource = currentEmployment || fallbackEmployment;

const { totalExpInMonths } = experienceSource || {};
let experienceJSX = null;

if (typeof totalExpInMonths === 'number') {
  const years = Math.floor(totalExpInMonths / 12);
  const months = totalExpInMonths % 12;

  experienceJSX = (
    <>
      {years > 0 && (
        <>
          <Typography component="span" sx={{ fontWeight: 500, fontSize: '14px', display: 'inline' }}>
            {years}
          </Typography>{' '}
          <Typography
            component="span"
            sx={{ fontWeight: 400, fontSize: '14px', display: 'inline', color: 'text.secondary' }}
          >
            Year{years > 1 ? 's' : ''}
          </Typography>
          {months > 0 && ' '}
        </>
      )}
      {months > 0 && (
        <>
          <Typography component="span" sx={{ fontWeight: 500, fontSize: '14px', display: 'inline' }}>
            {months}
          </Typography>{' '}
          <Typography
            component="span"
            sx={{ fontWeight: 400, fontSize: '14px', display: 'inline', color: 'text.secondary' }}
          >
            Month{months > 1 ? 's' : ''}
          </Typography>
        </>
      )}
    </>
  );
}


      return (
        <TableRow key={user._id}>
          <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
          <TableCell>
            <Typography sx={{ fontSize : '14px', fontWeight : 500}}>
              {user.applicantName}
            </Typography>
            </TableCell>
         <TableCell>
          <Box
            sx={{
              backgroundColor: designationColor,
              px: 1.5,
              py: 0.5,
              borderRadius: '8px',
              display: 'inline-block',
              fontSize: '13px',
              fontWeight: 400
            }}
          >
             {designation}
          </Box>
        </TableCell>

          <TableCell>{experienceJSX || 'N/A'}</TableCell>
          <TableCell>₹ {formatCTC(currentCtc) || 'N/A'}</TableCell>
          <TableCell>
  <Tooltip title={rawCompanyName} arrow>
          <Typography noWrap sx={{ fontSize : '14px'}}>
            {truncatedName}
          </Typography>
        </Tooltip>
      </TableCell>
          <TableCell>{noticePeriod || 'N/A'}</TableCell>
       

  <TableCell>
                   <Tooltip
                     title={
                       <Stack direction="row" alignItems="center" spacing={1}>
                         <Typography variant="body2">More Details</Typography>
                         <ArrowForwardOutlinedIcon fontSize="small" />
                       </Stack>
                     }
                     placement="top"
                     arrow
                   >
                     <IconButton
                   onClick={() => {
                     setLoading(true);
                    setSelectedUserId(user._id);
                     setLoading(false);
                    setDialogOpen(true);
                   }}
                   size="small"
                 >
                   <ArrowForwardOutlinedIcon fontSize="small" color={"primary"} />
                 </IconButton>
                 
                   </Tooltip>
                 </TableCell>

        </TableRow>
      );
    })}
  </TableBody>
</Table>

        </TableContainer>
        </>
      )}

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />

      <Dialog
  open={filterDialogOpen}
  onClose={() => setFilterDialogOpen(false)}
  TransitionComponent={Transition}
  keepMounted
  PaperProps={{ sx: { width: 380, maxWidth: '100%' } }}
  anchor="right"
>
  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography fontSize={18} fontWeight={500}>Filters</Typography>
    <IconButton onClick={() => setFilterDialogOpen(false)}>
      <CloseOutlinedIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers>

    {/* Role Selector */}
    <Typography fontSize={14} fontWeight={500} mb={0.5}>Role</Typography>
    <Autocomplete
      options={roleOptions}
      getOptionLabel={(option) => option.name || ''}
      value={selectedRole}
      onChange={(e, newValue) => setSelectedRole(newValue)}
      inputValue={roleInput}
      onInputChange={(e, newInputValue) => setRoleInput(newInputValue)}
      renderInput={(params) => <TextField {...params} placeholder="Search roles..." size="small" fullWidth />}
    />

    {/* Experience */}
    <Typography mt={2} mb={0.5} fontSize={14} fontWeight={500}>Experience</Typography>
    <TextField
      select
      value={experience}
      onChange={(e) => setExperience(e.target.value)}
      size="small"
      fullWidth
    >
      {[1, 2, 3, 4, 5].map((yr) => (
        <MenuItem key={yr} value={yr}>{`>${yr} year${yr > 1 ? 's' : ''}`}</MenuItem>
      ))}
    </TextField>

    {/* CTC Range */}
    <Typography mt={2} mb={0.5} fontSize={14} fontWeight={500}>CTC Range (INR)</Typography>
    <Box display="flex" gap={1}>
      <TextField
        label="From"
        type="number"
        size="small"
        fullWidth
        value={ctcRange.from}
        onChange={(e) => setCtcRange({ ...ctcRange, from: e.target.value })}
      />
      <TextField
        label="To"
        type="number"
        size="small"
        fullWidth
        value={ctcRange.to}
        onChange={(e) => setCtcRange({ ...ctcRange, to: e.target.value })}
      />
    </Box>

    {/* Notice Period */}
    <Typography mt={2} mb={0.5} fontSize={14} fontWeight={500}>Notice Period</Typography>
    <TextField
      select
      value={noticePeriod}
      onChange={(e) => setNoticePeriod(e.target.value)}
      size="small"
      fullWidth
    >
      {['1 Month', '2 Months', '3 Months'].map((period) => (
        <MenuItem key={period} value={period}>{period}</MenuItem>
      ))}
    </TextField>

    {/* Buttons */}
    <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
      <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
      <Button variant="contained" onClick={applyFilters}>Save</Button>
    </Box>

  </DialogContent>
</Dialog>



   {dialogOpen && selectedUserId && (
<ProfessionalDetails
  userId={selectedUserId}
  open={dialogOpen}
  onClose={() => {
    setProfessionals(prev => prev.filter(user => user._id !== selectedUserId));
    setDialogOpen(false);
    setSelectedUserId(null);
  }}
/>

)}







    </div>
  );
};

export default AllProfessionals;
