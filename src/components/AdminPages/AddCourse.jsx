import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [trainerName, setTrainerName] = useState(""); // Add trainerName
  const [employeeIds, setEmployeeIds] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();

  // Fetch trainers and employees when component mounts
  useEffect(() => {
    // Fetch Trainers
    axios
      .get("http://localhost:5000/api/users") // Ensure this endpoint is correct
      .then((res) => setTrainers(res.data))
      .catch((err) => console.error("Error fetching users:", err));

    // Fetch Employees
    axios
      .get("http://localhost:5000/api/employees") // Ensure this endpoint is correct
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []); // Empty dependency array to run once on mount
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Find selected trainer's name based on the trainerId
    const selectedTrainer = trainers.find((trainer) => trainer._id === trainerId);
  
    if (!selectedTrainer) {
      alert("Please select a valid trainer.");
      return;
    }
  
    const courseData = {
      title,
      description,
      trainer_id: trainerId, // Correct trainer_id field
      trainer_name: selectedTrainer.name, // Correct trainer_name field
      employees: employeeIds, // Array of employee IDs
    };
  
    try {
      const response = await axios.post("http://localhost:5000/api/courses", courseData);
      alert("Course added successfully");
      navigate("/dashboard"); // Redirect to dashboard or another page
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course");
    }
  };
  
  

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 600,
        margin: "auto",
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Add New Course
      </Typography>

      <TextField
        label="Course Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Description"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
        required
        fullWidth
      />

      <FormControl fullWidth required>
        <InputLabel>Select Trainer</InputLabel>
        <Select
          value={trainerId}
          onChange={(e) => {
            setTrainerId(e.target.value);
            const selectedTrainer = trainers.find(
              (trainer) => trainer._id === e.target.value
            );
            setTrainerName(selectedTrainer?.name || "");
          }}
          label="Select Trainer"
        >
          <MenuItem value="">
            <em>Choose a trainer</em>
          </MenuItem>
          {trainers.map((trainer) => (
            <MenuItem key={trainer._id} value={trainer._id}>
              {trainer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Select Employees</InputLabel>
        <Select
          multiple
          value={employeeIds}
          onChange={(e) => setEmployeeIds(e.target.value)}
          input={<OutlinedInput label="Select Employees" />}
          renderValue={(selected) =>
            employees
              .filter((emp) => selected.includes(emp._id))
              .map((emp) => emp.name)
              .join(", ")
          }
        >
          {employees.map((employee) => (
            <MenuItem key={employee._id} value={employee._id}>
              <Checkbox checked={employeeIds.indexOf(employee._id) > -1} />
              <ListItemText primary={employee.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Add Course
      </Button>
    </Box>
  );
};

export default AddCourse;
