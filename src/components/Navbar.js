import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import gmail from "../images/gmail.png";
import { Grid } from '@mui/material';
import lens from "../images/lens.png";
import Profile from './Profile';

export default function Navbar(props) {
  return (
    <Grid container>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          elevation={0}
          position="static"
          sx={{
            top: "0",
            zIndex: "2",
            backgroundColor: "#F9F9F9",
            minHeight: "5vw", // Decreased navbar height
            minWidth: "100vw",
            paddingTop: "5px", // Reduced padding
            paddingRight: "30px",
            '@media (max-width: 600px)': {
              minHeight: "9vw", // Smaller navbar height on mobile
              paddingTop: "3vw",
              paddingRight: "10px",
            }
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Grid item xs={2}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img style={{ width: "2.3vw", marginLeft: "4vw" }} src={gmail} alt="Gmail" />
                <Typography
                  sx={{
                    color: "#3C3C3C",
                    marginLeft: "1vw",
                    fontSize: "1.8vw",
                    '@media (max-width: 600px)': {
                      fontSize: "4vw",
                      marginLeft: "3vw"
                    }
                  }}
                  variant="h6"
                  component="div"
                >
                  Gmail
                </Typography>
              </div>
            </Grid>

            <Grid item xs={8}>
              <div
                style={{
                  marginLeft: "auto", // Pushes the search box to the right
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "40px",
                  backgroundColor: "#E4EFFA",
                  width: "55vw",
                  height: "3.5vw", // Adjusted search box height
                  '@media (max-width: 600px)': {
                    width: "75vw",
                    height: "6vw", // Smaller height for mobile
                    marginLeft: "0" // No margin-left for mobile
                  }
                }}
              >
                <img
                  src={lens}
                  alt="search"
                  style={{
                    width: "1.3vw",
                    height: "1.3vw",
                    alignItems: "center",
                    marginLeft: "15px",
                    '@media (max-width: 600px)': {
                      width: "3vw",
                      height: "3vw",
                    }
                  }}
                />
                <input
                  placeholder="Search mail"
                  style={{
                    marginLeft: "3vw",
                    height: "3vw",
                    width: "45vw",
                    backgroundColor: "#E4EFFA",
                    border: "none",
                    outline: "none",
                    fontSize: "1vw", // Adjusted font size
                    '@media (max-width: 600px)': {
                      marginLeft: "2vw",
                      height: "5vw",
                      width: "65vw",
                      fontSize: "3vw", // Smaller placeholder font size on mobile
                    }
                  }}
                />
              </div>
            </Grid>

            <Grid item xs={1}>
              <Box
                sx={{
                  '@media (max-width: 600px)': {
                    transform: "translateY(-10px)", // Move profile up on mobile
                  }
                }}
              >
                <Profile />
              </Box>
            </Grid>
          </div>
        </AppBar>
      </Box>
    </Grid>
  );
}




// import * as React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import gmail from "../images/gmail.png"
// import { Grid } from '@mui/material';
// import lens from "../images/lens.png"
// import Profile from './Profile';

// export default function Navbar(props) {
//   return (
//     <Grid container>
//       <Box sx={{ flexGrow: 1 }}>
//         <AppBar elevation={0} position="static" sx={{ top: "0", zIndex: "2", backgroundColor: "#F9F9F9", minHeight: "5vw", minWidth: "100vw", paddingTop: "7px", paddingRight: "30px" }}>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <Grid item xs={2}>
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: "0.8vw", color: "#3C3C3C" }}>
//                   <img src={menu} alt="User Name"style={{ width: "2vw", marginLeft: "2vw" }} />
//                 </IconButton> */}
//                 <img style={{ width: "2.3vw",marginLeft: "4vw" }} src={gmail} alt="Gmail" />
//                 <Typography sx={{ color: "#3C3C3C", marginLeft: "1vw", fontSize: "1.8vw" }} variant="h6" component="div">
//                   Gmail
//                 </Typography>
//               </div>
//             </Grid>
//             <Grid item xs={8}>
//               <div style={{ marginLeft: "3vw", display: "flex", alignItems: "center", borderRadius: "40px", backgroundColor: "#E4EFFA", width: "55vw", height: "3.7vw" }}>
//                 <img src={lens} alt="search" style={{ width: "1.3vw", height: "1.3vw", alignItems: "center", marginLeft: "15px" }} />
//                 <input placeholder='Search mail' style={{ marginLeft: "3vw", height: "3vw", width: "45vw", backgroundColor: "#E4EFFA", border: "none", outline: "none" }} />
//               </div>
//             </Grid>
//             <Grid item xs={1}>
//               <Profile />
//             </Grid>
//           </div>
//         </AppBar>
//       </Box>
//     </Grid>
//   );
// }
