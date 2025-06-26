import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  Stack,
  useTheme,
  useMediaQuery
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../images/desk-logo.svg";



export default function Navbar() {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 
    const [mobileOpen, setMobileOpen] = useState(false);




  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#F5F7F8", boxShadow: "none", py: isMobile ? '2px' : '12px'}}>
        <Toolbar sx={{ justifyContent: "space-between" }}>

        <Stack sx={{ display : 'flex', flexDirection : 'row', alignItems : 'center', gap: 16}}>

        
        <Typography variant="h4">
            <a href="/">
              <img className="img-fluid" src={logo} alt="creatorConsole" width={isMobile ? 110 : 120} />
            </a>
          </Typography>


          </Stack>
      

          {/* <Stack onClick={navigateToLogin} sx={{ display : 'flex', flexDirection : 'row', alignItems : 'center', background : '#11009E', borderRadius : '22px',
            px: 2, py: 1, gap: 1, cursor : 'pointer'
          }}>

             <Typography sx={{ fontSize : '16px', fontWeight : 400}}>
                 Login
                </Typography>

                <RedoOutlinedIcon sx={{ fontSize : '20px'}}/>


          </Stack> */}

          

        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: "80%" } }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon sx={{ color : '#261FB3', fontSize : '36px'}}/>
          </IconButton>
        </Box>
     
      </Drawer>
    </>
  );
}
