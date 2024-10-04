// src/components/Trainers.jsx

import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify components
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toastify

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setTrainers(response.data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchTrainers();
  }, []);

  const handleAddTrainerClick = () => {
    setOpen(true); // Open the dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        {
          name,
          email,
          password,
          role: "Trainer", // Assuming role is Trainer for this form
        }
      );
      setTrainers([...trainers, response.data]); // Add the new trainer to the list
      toast.success("Trainer added successfully!"); // Show success toast
      handleClose(); // Close the dialog
      // Clear the form fields
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Error adding trainer. Please try again."); // Show error toast
    }
  };

  return (
    <Container sx={{ mt: 4, maxWidth: "1200px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Trainers
      </Typography>
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTrainerClick}
        >
          Add Trainer
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ border: "1px solid #ccc", mt: 2 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainers.map((trainer, index) => (
              <TableRow
                key={trainer._id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e0e0e0",
                  "&:hover": { backgroundColor: "#d3d3d3" },
                }}
              >
                <TableCell>{trainer.name}</TableCell>
                <TableCell>{trainer.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Adding Trainer */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Trainer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSignup} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Container */}
      <ToastContainer />
    </Container>
  );
};

export default Trainers;
