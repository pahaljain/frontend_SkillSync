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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
          role: "Trainer",
        }
      );
      setTrainers([...trainers, response.data]);
      toast.success("Trainer added successfully!");
      handleClose();
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Error adding trainer. Please try again.");
    }
  };

  return (
    <Container
      sx={{
        mt: 4,
        maxWidth: "1200px",
        backgroundColor: "#fafafa",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        color="#3411A3"
        sx={{ textTransform: "uppercase" }}
      >
        Trainers
      </Typography>
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#3411A3",
            color: "#fff",
            "&:hover": { backgroundColor: "#250d73" },
          }}
          onClick={handleAddTrainerClick}
        >
          Add Trainer
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ border: "1px solid #ccc", mt: 2, backgroundColor: "#ffffff" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#3411A3",
                  color: "#fff",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#3411A3",
                  color: "#fff",
                }}
              >
                Email
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainers.map((trainer, index) => (
              <TableRow
                key={trainer._id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#f2f2f2",
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
          <Button onClick={handleClose} sx={{ color: "#3411A3" }}>
            Cancel
          </Button>
          <Button onClick={handleSignup} sx={{ color: "#3411A3" }}>
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
