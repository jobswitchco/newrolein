import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
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
  Pagination,
  Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ShortlistedProfessionalDetails from "./ShortlistedProfessionalDetails";
import ConversationDialog from "./ConversationComp";
import { toast } from "react-toastify";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import noInvitationsImg from '../../images/no_invitations_img.svg'


const InvitedTable = () => {
 

 const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const today = dayjs();
  const baseUrl = "http://localhost:8001/employersOn";
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showConversation, setShowConversation] = useState(false);


  const fetchProfessionals = async (pg = page) => {
    try {
      const payload = {
        page: pg,
        limit: 10
      };

      if (startDate) payload.startDate = dayjs(startDate).startOf('day').toISOString();
      if (endDate) payload.endDate = dayjs(endDate).endOf('day').toISOString();

      const response = await axios.post(
        baseUrl + "/get-all-invited-candidates",
        payload,
        { withCredentials: true }
      );

      setUsers(response.data.users || []);
      console.log('users::::::', response.data.users);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching professionals:", error);
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
    Not invited any candidate yet. You can do this from{' '}
    <Typography
      component="a"
      href="/employer/shortlisted_candidates"
      sx={{
        textDecoration: 'underline',
        color: 'primary.main',
        fontWeight: 400,
        cursor: 'pointer',
      }}
    >
     Shortlist
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
            <Typography sx={{ fontSize: "18px", fontWeight: 500 }}>
              Invited Candidates
            </Typography>

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
                      sx: { width: 130, height: 40 },
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
                      sx: { width: 130, height: 40 },
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Toolbar>

          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Shortlisted Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Designation</TableCell>
                    <TableCell>Experience</TableCell>
                    {/* <TableCell>CTC</TableCell> */}
                    <TableCell>Profile</TableCell>
                    <TableCell>Conversation</TableCell>
                  </TableRow>
                </TableHead>
               <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={user.user_id}  sx={{
    backgroundColor: !user.isRead ? '#EAEFEF' : 'inherit'
  }}>
                      <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        {dayjs(user.ShortListed_date).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ backgroundColor: "#B0DB9C", px: 1.5, py: 0.5, borderRadius: "8px", fontSize: "13px", width: 'fit-content' }}>
                          Invited
                        </Box>
                      </TableCell>
                      <TableCell>{user.Designation}</TableCell>
                      <TableCell>{user.Experience}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => {
                          setSelectedUserId(user.user_id);
                          setDialogOpen(true);
                        }} size="small">
                          <ArrowForwardOutlinedIcon fontSize="small" color="primary" />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedUserId(user.user_id);
                            setSelectedConversationId(user.conversation_id);
                            setShowConversation(true);
                          }}
                        >
                          <SendOutlinedIcon fontSize="small" color="secondary" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
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

   {showConversation && selectedConversationId && (
  <ConversationDialog
    open={showConversation}
    conversationId={selectedConversationId}
    onClose={() => {
      setShowConversation(false);
      setSelectedConversationId(null);
    }}
    onMessageRead={() => {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.conversation_id === selectedConversationId
            ? { ...user, isRead: true }
            : user
        )
      );
    }}
  />
)}


    </>
  );
};

export default InvitedTable;
