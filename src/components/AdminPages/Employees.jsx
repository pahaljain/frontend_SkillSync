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

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, [open]);

  const handleAddEmployeeClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setEmail("");
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/employees", {
        name,
        email,
      });
      setEmployees([...employees, response.data]);
      toast.success("Employee added successfully!");
      handleClose();
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee. Please try again.");
    }
  };

  const handleRemoveEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees(employees.filter((employee) => employee._id !== id));
      toast.success("Employee removed successfully!");
    } catch (error) {
      console.error("Error removing employee:", error);
      toast.error("Error removing employee. Please try again.");
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
        Employees
      </Typography>
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddEmployeeClick}
          sx={{
            "&:hover": { backgroundColor: "#250d73" }, // Darker shade for hover
          }}
        >
          Add Employee
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
                  backgroundColor: "#3411A3", // Primary color
                  color: "#fff", // White text color
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#3411A3", // Primary color
                  color: "#fff", // White text color
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#3411A3", // Primary color
                  color: "#fff", // White text color
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#f2f2f2",
                  "&:hover": { backgroundColor: "#d3d3d3" },
                }}
              >
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#F25F95", // Set to your specified color
                      color: "#fff", // White text color
                      "&:hover": { backgroundColor: "#d84b7a" }, // Darker shade for hover
                    }}
                    onClick={() => handleRemoveEmployee(employee._id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Adding Employee */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Employee</DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddEmployee} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Container */}
      <ToastContainer />
    </Container>
  );
};

export default Employees;
