import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogActions, IconButton, Box, TextField, Button, Chip, CircularProgress, FormControl, Tooltip, InputLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import axios from 'axios';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const InvitationDialog = ({ userIds = [], open, onClose, onInvitationSent  }) => {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = "http://localhost:8001/employersOn";


  useEffect(() => {
    if (!open || userIds.length === 0) return;

    setLoading(true);
    axios.post(`${baseUrl}/get-professional-names`, { userIds }, { withCredentials: true })
      .then(res => {
        setUsers(res.data.users);
      })
      .catch(err => {
        console.error("Failed to fetch user names", err);
      })
      .finally(() => setLoading(false));
  }, [userIds, open]);



  const handleSend = () => {
    if (!message) {
      return alert('Message is required.');
    }

    axios.post(`${baseUrl}/send-interview-invitation`, { userIds, message }, { withCredentials: true })
      .then(res => {
        if(res.data.sent){
            toast.success('Invitation(s) Sent Successfully!');
           setTimeout(() => {
  onInvitationSent?.(); // notify parent to update state
         
        }, 1500);
        }
      })
      .catch(err => {
            toast.error('Server error. Please try again!');
      })
      .finally(() => setLoading(false));
   
  };

  return (

    <>
    <Dialog
      open={open}
      fullScreen
      onClose={(_, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      onClose();
    }
  }}
      disableEscapeKeyDown
      slotProps={{
        paper: {
          sx: {
            width: '65vw',
            height: '100vh',
            ml: 'auto',
            borderRadius: 0,
            position: 'relative',
          },
        },
      }}
    >
      <Box position="absolute" top={10} right={10}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ mt: 5 }}>
        {/* Show loader until user names are fetched */}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Recipient Chips */}

<FormControl fullWidth variant="standard">
  <InputLabel shrink sx={{ fontSize : '20px', fontWeight : 500}}>To</InputLabel>
  <Box
    sx={{
      borderRadius: 1,
      px: 1,
      py: 1.2,
      minHeight: 56,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 0.5,
      mt: 2
    }}
  >
    {users.map((user) => (
      <Chip
        key={user._id}
        label={user.applicantName}
        size="medium"
        sx={{ pointerEvents: 'none', fontSize : '15px', mb: 1 }}
      />
    ))}
  </Box>
</FormControl>



      

            {/* Message */}
            <TextField
              label="Invitation"
              fullWidth
              multiline
              minRows={12}
              sx={{ mt: 3 }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </>
        )}
      </DialogContent>

  

  <DialogActions sx={{ mr: 4, mb: 4 }}>
  <Tooltip
    title={!message ? "All fields are mandatory" : ""} placement="top"
    arrow
    disableHoverListener={!!message}
  >
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Button
        variant="contained"
        onClick={handleSend}
        disabled={loading || !message}
        sx={{
            textTransform: 'none',
          bgcolor: !message ? '#9e9e9e' : 'green',
          color: !message ? '#fff' : '#fff',
          cursor: !message ? 'not-allowed' : 'pointer',
          '&:hover': {
            bgcolor: !message ? '#9e9e9e' : 'darkgreen',
          },
        }}
        startIcon={!message ? <DoNotDisturbAltOutlinedIcon /> : null}
      >
        Send Invitation
      </Button>
    </span>
  </Tooltip>
</DialogActions>


    </Dialog>


       <ToastContainer
            position="top-left"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{ zIndex: 15000 }}
          />

    </>
  );
};

export default InvitationDialog;
