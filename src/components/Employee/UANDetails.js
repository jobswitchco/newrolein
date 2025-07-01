import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Stack,
   Dialog,
  DialogContent
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import {RecentActors} from '@mui/icons-material';
import { IconButton } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';



// const baseUrl = "http://localhost:8001/usersOn";
      const baseUrl="/api/usersOn";


const UANDetails = () => {
  const [editing, setEditing] = useState({ uanNumber: false, linkedinUrl: false });
  const [inputValues, setInputValues] = useState({ uanNumber: "", linkedinUrl: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({ uanNumber: false, linkedinUrl: false });
  const [helpDialog, setHelpDialog] = useState({ open: false, field: "" });


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.post(`${baseUrl}/get-user-additional-details`, {}, { withCredentials: true });
        if (res.data.success) {
          setInputValues({
            uanNumber: res.data.data.uanNumber || "",
            linkedinUrl: res.data.data.linkedinUrl || ""
          });
        } else {
          toast.error("Failed to fetch user details");
        }
      } catch (err) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const handleSave = async (field) => {
    try {
      setSaving((prev) => ({ ...prev, [field]: true }));
      const res = await axios.post(
        `${baseUrl}/update-user-additional-details`,
        { [field]: inputValues[field] },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(`${field === "uanNumber" ? "UAN Number" : "LinkedIn URL"} updated`);
        setEditing((prev) => ({ ...prev, [field]: false }));
      } else {
        toast.error("Failed to update");
      }
    } catch (err) {
      toast.error("Error while saving");
    } finally {
      setSaving((prev) => ({ ...prev, [field]: false }));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100px">
        <CircularProgress sx={{ color: "#71C0BB" }} />
      </Box>
    );
  }

  return (
    <>
    <Box sx={{ border: "1px solid #ccc", p: 3, borderRadius: 2, mt: 2 }}>

   

       <Stack sx={{ display : 'flex', flexDirection : 'row', gap: 1, alignItems : 'center', mb: 0.5}}>
                        <RecentActors sx={{ fontSize : '22px'}}/>
              <Typography sx={{ fontSize: "16px", fontWeight: 500, color : '#FF4F0F' }}>Additional Details</Typography>
      
      
                      </Stack>

                      <Typography sx={{ mb: 3, fontSize: '14px', color: '#093FB4'}}>Profiles with a verified UAN & LinkedIn URL attract 10x more recruiter views.</Typography>
     

   {["uanNumber", "linkedinUrl"].map((field) => (
  <Box key={field} mb={3}>
    <Box display="flex" alignItems="center" gap={2}>
      <TextField
        fullWidth
        label={field === "uanNumber" ? "UAN (Universal Account Number)" : "LinkedIn URL"}
        value={inputValues[field]}
        onClick={() => setEditing((prev) => ({ ...prev, [field]: true }))}
        onChange={(e) =>
          setInputValues((prev) => ({ ...prev, [field]: e.target.value }))
        }
        InputProps={{
          readOnly: !editing[field],
        }}
      />
      {editing[field] && (
        <Button
          variant="contained"
          onClick={() => handleSave(field)}
          disabled={saving[field]}
        >
          {saving[field] ? "Saving..." : "Save"}
        </Button>
      )}
    </Box>

    {/* Caption and Tooltip Below */}
  <Box display="flex" alignItems="center" gap={0.5} mt={0.5} ml={0.5}>
  <Typography variant="caption" sx={{ color: "gray", fontSize: "12px" }}>
    Why it is important
  </Typography>
  <IconButton
    size="small"
    sx={{ p: 0, color: "gray" }}
    onClick={() => setHelpDialog({ open: true, field })}
  >
    <HelpOutlineIcon fontSize="small" />
  </IconButton>
</Box>

  </Box>
))}


    </Box>

    <Dialog open={helpDialog.open} onClose={() => setHelpDialog({ open: false, field: "" })}>
  <DialogContent>
    <Typography sx={{ fontSize: '14px' }}>
      {helpDialog.field === "uanNumber"
        ? "Your UAN helps verify your current employer privately. It is never shared with recruiters."
        : "Adding your LinkedIn URL helps recruiters better understand your professional background and skills."}
    </Typography>
  </DialogContent>
</Dialog>

</>
  );
};

export default UANDetails;
