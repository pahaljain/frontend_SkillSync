import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Cookie from "js-cookie";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logout functionality
  const handleLogout = () => {
    Cookie.remove("user"); // Remove the cookie
    navigate("/login"); // Redirect to login
  };

  // Get user from cookie
  const user = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;

  // Define the styles for active links
  const activeStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Light background for active link
    borderRadius: "4px", // Rounded corners
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1 }}
          style={{ textDecoration: "none", color: "white" }}
        >
          SkillSync
        </Typography>
        <Box>
          {!user ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={location.pathname === "/login" ? activeStyle : {}}
              >
                Login
              </Button>
              {/* Uncomment if Signup is needed */}
              {/* <Button
                color="inherit"
                component={Link}
                to="/signup"
                sx={location.pathname === "/signup" ? activeStyle : {}}
              >
                Signup
              </Button> */}
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/courses"
                sx={location.pathname === "/courses" ? activeStyle : {}}
              >
                Courses
              </Button>
              {/* Show admin-specific buttons */}
              {user.role === "Admin" && (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/employees"
                    sx={location.pathname === "/employees" ? activeStyle : {}}
                  >
                    Employees
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/trainers"
                    sx={location.pathname === "/trainers" ? activeStyle : {}}
                  >
                    Trainers
                  </Button>
                </>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
