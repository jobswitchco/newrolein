import React from "react";
import { Link, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  SupportAgent as SupportAgentIcon,
  AccountBoxOutlined as AccountBoxOutlinedIcon,
  InsertInvitationOutlined as InsertInvitationOutlinedIcon,
} from "@mui/icons-material";
import { deepOrange, blue, green, brown } from "@mui/material/colors";
import logo from "../../images/desk-logo.svg";
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';

const theme = createTheme({
  palette: {
    primary: { main: deepOrange[500] },
    secondary: { main: green[500] },
  },
});

const ResponsiveDrawer = ({ window }) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawerWidth = 220;

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: '#F5F7F8' }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <img src={logo} alt="Logo" />
        {isSmallScreen && (
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>

      <List>
         <ListItem disablePadding>
          <Link to="/professional/dashboard" style={{ textDecoration: "none", color: "black", width: "100%" }} onClick={handleDrawerToggle}>
            <ListItemButton>
              <ListItemIcon><SpaceDashboardOutlinedIcon sx={{ color: green[800] }} /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem disablePadding>
          <Link to="/professional/career_details" style={{ textDecoration: "none", color: "black", width: "100%" }} onClick={handleDrawerToggle}>
            <ListItemButton>
              <ListItemIcon><AccountBoxOutlinedIcon sx={{ color: brown[800] }} /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem disablePadding>
          <Link to="/professional/invitations" style={{ textDecoration: "none", color: "black", width: "100%" }} onClick={handleDrawerToggle}>
            <ListItemButton>
              <ListItemIcon><InsertInvitationOutlinedIcon sx={{ color: blue[800] }} /></ListItemIcon>
              <ListItemText primary="Invitations" />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <List>
        <ListItem disablePadding>
          <Link to="/professional/account/details" style={{ textDecoration: "none", color: "black", width: "100%" }} onClick={handleDrawerToggle}>
            <ListItemButton>
              <ListItemIcon><SettingsOutlinedIcon sx={{ color: brown[500] }} /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem disablePadding>
          <Link to="/professional/support" style={{ textDecoration: "none", color: "black", width: "100%" }} onClick={handleDrawerToggle}>
            <ListItemButton>
              <ListItemIcon><SupportAgentIcon sx={{ color: blue[500] }} /></ListItemIcon>
              <ListItemText primary="Support" />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh" }}>

        {/* Transparent AppBar for mobile with menu icon on the left */}
        {isSmallScreen && (
          <AppBar position="fixed" elevation={0} sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <Toolbar>
              <IconButton edge="start" onClick={handleDrawerToggle}>
                <MenuIcon sx={{ color: '#11009E'}}/>
              </IconButton>
            </Toolbar>
          </AppBar>
        )}

        {/* Sidebar */}
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            anchor="left"
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
          >
            {drawerContent}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            maxWidth: { sm: `calc(100% - ${drawerWidth}px)` },
            pt: isSmallScreen ? 7 : 0,
            px: 2,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
