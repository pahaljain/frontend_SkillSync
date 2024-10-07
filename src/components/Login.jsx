import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Grid,
  Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import loginImage from "./../assets/images/login.webp"; // Make sure the path is correct

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      const user = response.data;

      // Set a cookie with user information
      Cookie.set("user", JSON.stringify(user), { expires: 7 });
      navigate("/dashboard");
    } catch (error) {
      setError(error.response.data.message || "Login failed");
    }
  };

  return (
    <div
      className="login-form "
      style={{
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <div className="flex gap-10 p-4 bg-white rounded-xl">
        <Box
          component="img"
          src={loginImage}
          alt="Login"
          sx={{
            width: "370px",
            height: "500px",
            marginLeft: "50px",
            objectFit: "contain",
          }}
        />
        <Grid item xs={12} md={6} display="flex" alignItems="center">
          <Card
            sx={{
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "#fff",
              width: "80%",
            }}
          >
            <Typography variant="h4" gutterBottom align="center">
              Login
            </Typography>
            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Login
              </Button>
            </form>
          </Card>
        </Grid>
      </div>
    </div>
  );
};

export default Login;
