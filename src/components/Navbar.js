import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../images/desk-logo.svg";
import { Link } from "react-router-dom"; // Better for SPA routing

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "#F5F7F8",
          py: isMobile ? "2px" : "12px",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: isMobile ? 2 : 5, // horizontal padding
          }}
        >
          {/* Logo + Brand */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <img
              src={logo}
              alt="Newrole Logo"
              width={isMobile ? 110 : 120}
              height="auto"
              loading="eager"
              style={{ display: "block" }}
            />
          </Box>

          {/* Future: Navigation / Mobile Toggle */}
          {/* 
          <IconButton onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
          */}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer (currently unused but present) */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: "80%" } }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon sx={{ color: "#261FB3", fontSize: 36 }} />
          </IconButton>
        </Box>

        {/* Future: Add nav links inside drawer here */}
      </Drawer>
    </>
  );
}
