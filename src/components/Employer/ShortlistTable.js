import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Tooltip,
  Stack,
  CircularProgress,
  Pagination
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import dayjs from "dayjs";
import ShortlistedProfessionalDetails from "./ShortlistedProfessionalDetails";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import InvitationDialog from "./InvitationDialog";
import noInvitationsImg from '../../images/no_invitations_img.svg'


const ShortlistTable = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const today = dayjs();
  const baseUrl = "http://localhost:8001/employersOn";
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [invitationDialogOpen, setInvitationDialogOpen] = useState(false);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const fetchProfessionals = async (pg = page) => {
  try {
              setLoading(true);

    const payload = {
      page: pg,
      limit: 10
    };

    if (startDate) payload.startDate = dayjs(startDate).startOf('day').toISOString();
    if (endDate) payload.endDate = dayjs(endDate).endOf('day').toISOString();

    const response = await axios.post(
      baseUrl + "/get-all-shortlisted-candidates",
      payload,
      { withCredentials: true }
    );

    setUsers(response.data.users || []);
    setTotalPages(response.data.totalPages || 1);
    setPage(pg);
  } catch (error) {
    console.error("Error fetching professionals:", error);
  }

  finally {
                setLoading(false);
              }
};



  const handlePageChange = (event, value) => {
    setPage(value);
    fetchProfessionals(value);
  };


      const handleSessionExpired = () => {
            toast.error("Session expired. Please log in again.");
            setTimeout(() => {
  
              navigate('/employer/login');
              
            }, 1500);
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
              if (startDate || endDate) {
                fetchProfessionals(1);
              }
            }, [startDate, endDate]);



  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((val) => val !== id) : [...prev, id]
    );
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        baseUrl + "/delist-candidates",
        { selectedIds },
        { withCredentials: true }
      );
      if (res.data.success) {
        fetchProfessionals();
        setOpenDeleteDialog(false);
        toast.success("Candidate Deleted Successfully!");
      }
    } catch (err) {
      console.error("Delisting failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleInvite = () => {
    if (selectedIds.length === 0)
      return toast.warn("Select at least one candidate");
    setInvitationDialogOpen(true);
  };

  const formatCTC = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <>
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
      ) : users.length === 0 ? (
      
            <Stack
          sx={{
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <img
            className="img-fluid rounded no-data-img-props"
            src={noInvitationsImg}
            alt="youtube-icon"
            style={{ marginBottom: '12px' }}
          />

        <Stack spacing={1}>
  <Typography>
    Not shortlisted any candidate yet. Check out profiles here{' '}
    <Typography
      component="a"
      href="/employer/all_professionals"
      sx={{
        textDecoration: 'underline',
        color: 'primary.main',
        fontWeight: 400,
        cursor: 'pointer',
      }}
    >
     Working Professionals
    </Typography>.
  </Typography>
</Stack>

        </Stack>
            ) : (
        <>
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              pl: 0.5,
            }}
          >
            {/* Left - Title */}
            <Typography sx={{ fontSize: "18px", fontWeight: 500 }}>
              Shortlisted Candidates
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                alignItems: "center",
              }}
            >
              {selectedIds.length > 0 && (
                <Box sx={{ display: "flex", gap: 2 }}>
                  {/* Delete Button */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "4px",
                      px: 1.5,
                      height: 40, // 💡 Match height
                      cursor: "pointer",
                      background: "#EEEEEE",
                      "&:hover": {
                        background: "#E83F25",
                        color: "#FFFFFF",
                      },
                    }}
                    onClick={handleOpenDialog}
                  >
                    <DeleteIcon sx={{ fontSize: 20 }} />
                    <Typography sx={{ fontSize: 14 }}>Delete</Typography>
                  </Box>

                  {/* Send Invitation Button */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "4px",
                      px: 1.5,
                      height: 40,
                      cursor: "pointer",
                      background: "#EEEEEE",
                      "&:hover": {
                        background: "#328E6E",
                        color: "#FFFFFF",
                      },
                    }}
                    onClick={handleInvite}
                  >
                    <SendIcon sx={{ fontSize: 20 }} />
                    <Typography sx={{ fontSize: 14 }}>
                      Send Invitation
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Right - Date Pickers */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    maxDate={today}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: { width: 130, height: 40 }, // Optional: to be safe
                      },
                    }}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    maxDate={today}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: { width: 130, height: 40 }, // Optional
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
          </Toolbar>

          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
           <TableCell>Select</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Shortlisted Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Designation</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>CTC</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => {
                    return (
                      <TableRow key={user.user_id} sx={ user.status ? { opacity: 0.6} : {}}>
                       <TableCell padding="checkbox">
  <Tooltip title={user.status === true ? "Already Invited" : ""}>
    <span>
      <Checkbox
        checked={selectedIds.includes(user.user_id)}
        onChange={() => handleSelect(user.user_id)}
        disabled={user.status}
      />
    </span>
  </Tooltip>
</TableCell>

                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          {dayjs(user.ShortListed_date).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              backgroundColor: user.status
                                ? "#B0DB9C"
                                : "#EAEFEF",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "8px",
                              display: "inline-block",
                              fontSize: "13px",
                              fontWeight: 400,
                            }}
                          >
                            {user.status ? "Invited" : "Shortlisted"}
                          </Box>
                        </TableCell>
                        <TableCell>{user.Designation}</TableCell>
                        <TableCell>{user.Experience}</TableCell>
                        <TableCell>₹ {formatCTC(user.CTC)}</TableCell>

                        <TableCell>
                          <Tooltip
                            title={
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
                                <Typography variant="body2">
                                  More Details
                                </Typography>
                                <ArrowForwardOutlinedIcon fontSize="small" />
                              </Stack>
                            }
                            placement="top"
                            arrow
                          >
                            <IconButton
                              onClick={() => {
                                setLoading(true);
                                setSelectedUserId(user.user_id);
                                setLoading(false);
                                setDialogOpen(true);
                              }}
                              size="small"
                            >
                              <ArrowForwardOutlinedIcon
                                fontSize="small"
                                color={"primary"}
                              />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

                 <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                          <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                          />
                        </Box>


          </Box>
        </>
      )}

      {dialogOpen && selectedUserId && (
        <ShortlistedProfessionalDetails
          userId={selectedUserId}
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedUserId(null);
          }}
        />
      )}

      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delist Candidate</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delist this candidate ? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Delist
          </Button>
        </DialogActions>
      </Dialog>

      {invitationDialogOpen && (

      <InvitationDialog
  userIds={selectedIds}
  open={invitationDialogOpen}
  onClose={() => setInvitationDialogOpen(false)}

 onInvitationSent={() => {
  setUsers(prevUsers =>
    prevUsers.map(user =>
      selectedIds.includes(user.user_id)
        ? { ...user, status: true }
        : user
    )
  );
  setInvitationDialogOpen(false);
  setSelectedIds([]);
}}

/>
      )}


    </>
  );
};

export default ShortlistTable;
