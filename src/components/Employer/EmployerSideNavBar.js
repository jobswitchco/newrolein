import React from "react";
import PropTypes from "prop-types";
import {
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepOrange, blue, green, brown } from "@mui/material/colors";
import logo from "../../images/desk-logo.svg";
import CloseIcon from "@mui/icons-material/Close";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

const theme = createTheme({
  palette: {
    primary: { main: deepOrange[500] },
    secondary: { main: green[500] },
  },
});

const ResponsiveDrawer = (props) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = isSmallScreen ? "100%" : 220;
  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor : '#F5F7F8'}}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <img src={logo} alt="Logo" />
          {/* <Typography>Job Switch</Typography> */}
        </Box>
        {isSmallScreen && (
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
  
      {/* Top Section - Professionals */}
      <List>
        <ListItem disablePadding sx={{ mt: 1}}>
          <Link
            style={{ textDecoration: "none", color: "black", width: "100%" }}
            to="/employer/all_professionals"
            onClick={handleDrawerToggle}
          >
            <ListItemButton>
              <ListItemIcon>
                <PersonSearchOutlinedIcon sx={{ color: deepOrange[800] }} />
              </ListItemIcon>
              <ListItemText primary="Professionals" />
            </ListItemButton>
          </Link>
        </ListItem>


            <ListItem disablePadding sx={{ mt: 1}}>
          <Link
            style={{ textDecoration: "none", color: "black", width: "100%" }}
            to="/employer/shortlisted_candidates"
            onClick={handleDrawerToggle}
          >
            <ListItemButton>
              <ListItemIcon>
                <TaskAltOutlinedIcon sx={{ color: blue[800] }} />
              </ListItemIcon>
              <ListItemText primary="Shortlist" />
            </ListItemButton>
          </Link>
        </ListItem>

         <ListItem disablePadding sx={{ mt: 1}}>
          <Link
            style={{ textDecoration: "none", color: "black", width: "100%" }}
            to="/employer/invited_candidates"
            onClick={handleDrawerToggle}
          >
            <ListItemButton>
              <ListItemIcon>
                <MarkEmailReadOutlinedIcon sx={{ color: green[800] }} />
              </ListItemIcon>
              <ListItemText primary="Invited" />
            </ListItemButton>
          </Link>
        </ListItem>

      </List>
  
      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />
  
      {/* Bottom Section - Settings & Support */}
      <List>
        {[
          {
            text: "Settings",
            icon: <SettingsOutlinedIcon sx={{ color: brown[500] }} />,
            path: "/employer/account/details",
          },
          {
            text: "Support",
            icon: <SupportAgentIcon sx={{ color: blue[500] }} />,
            path: "/employer/support",
          },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link
              style={{ textDecoration: "none", color: "black", width: "100%" }}
              to={item.path}
              onClick={handleDrawerToggle}
            >
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  

  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", height: "100vh" }}>

        {/* Sidebar Navigation */}
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant="temporary"
            anchor="bottom"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
          <Box 
  component="main"
  sx={{
    flexGrow: 1,
    width: "100%",
    maxWidth: { sm: `calc(100% - ${drawerWidth}px)` },
    display: 'flex',
    flexDirection: 'column',
  }}
>
        
          {/* AppBar (Header) */}
          
          {/* <AppBar position="sticky" color="default" sx={{ boxShadow: "none", borderBottom: "1px solid #F5F7F8" }}>
  <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

    <Box sx={{ display: "flex", gap: 2, marginLeft: "auto" }}>
      
      <IconButton>
        <NotificationsIcon />
      </IconButton>
     
      <IconButton>
        <AccountCircleIcon />
      </IconButton>
     </Box>
  </Toolbar>
</AppBar> */}


          {/* Page Content */}
          {/* <Box sx={{ p: 2 }}>
            <Outlet />
          </Box> */}

           <Box sx={{ p: 2, flexGrow: 1, overflow: "auto" }}>
    <Outlet />
  </Box>

        </Box>
      </Box>
    </ThemeProvider>
  );
};

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
