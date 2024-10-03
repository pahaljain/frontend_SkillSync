import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Cookie from "js-cookie"; // Import js-cookie

const Navbar = () => {
  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = () => {
    Cookie.remove("user"); // Remove the cookie
    navigate("/login"); // Redirect to login
  };

  // Get user from cookie
  const user = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;

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
          <Button color="inherit" component={Link} to="/courses">
            Courses
          </Button>
          <Button color="inherit" component={Link} to="/employees">
            Employees
          </Button>
          <Button color="inherit" component={Link} to="/trainers">
            Trainers
          </Button>

          {!user ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
