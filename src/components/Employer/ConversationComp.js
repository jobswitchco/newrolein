import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Stack,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";

const ConversationComp = ({ open, conversationId, onClose, onMessageRead }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  // const baseUrl = "http://localhost:8001/employersOn";
      const baseUrl="/api/employersOn";

  const bottomRef = useRef(null);

  const fetchConversation = async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseUrl}/get-conversation-by-id`,
        { conversationId },
        { withCredentials: true }
      );
      const fetchedMessages = res.data.messages || [];
      setMessages(fetchedMessages);

      // Mark messages sent by the professional as read
      if (fetchedMessages.some(msg => msg.senderType === "professional")) {
        await axios.post(
          `${baseUrl}/mark-messages-read-by-employer`,
          { conversationId },
          { withCredentials: true }
        );
       onMessageRead?.(); 
        
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchConversation();
    }
  }, [open, conversationId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {

    setLoading(true);

      await axios.post(
        `${baseUrl}/send-message-to-user`,
        {
          conversationId,
          content: newMessage.trim(),
        },
        { withCredentials: true }
      );
      setNewMessage("");
      await fetchConversation();
    setLoading(false);

    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <AppBar
        elevation={0}
        sx={{
          position: "relative",
          bgcolor: "#FFFDF6",
          boxShadow: "none"
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "16px", color: "grey" }}>
            Conversation Window
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Refresh" placement="left" arrow>
              <span>
                <IconButton onClick={fetchConversation} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
            <IconButton edge="end" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 64px)",
          p: 2
        }}
      >
        <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
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
          ) : messages.length === 0 ? (
            <Typography>No messages found.</Typography>
          ) : (
            <Stack spacing={2}>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    alignSelf:
                      msg.senderType === "employer" ? "flex-end" : "flex-start",
                    backgroundColor:
                      msg.senderType === "employer" ? "#E0F7FA" : "#F1F8E9",
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    maxWidth: "75%",
                  }}
                >
                  <Typography variant="body1">{msg.content}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(msg.sentAt).format("MMM D, YYYY h:mm A")}
                  </Typography>
                
                </Box>
              ))}
              <div ref={bottomRef} />
            </Stack>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            borderTop: "1px solid #ccc",
            pt: 1
          }}
        >
          <TextField
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            multiline
            minRows={2}
            maxRows={6}
            fullWidth
            autoFocus
            sx={{
              '& .MuiInputBase-root': {
                overflow: 'hidden',
              },
              textarea: {
                resize: 'none',
              },
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationComp;
