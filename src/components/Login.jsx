import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";

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
    <Container maxWidth="sm">
      <Box
        mt={5}
        sx={{
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
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
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
