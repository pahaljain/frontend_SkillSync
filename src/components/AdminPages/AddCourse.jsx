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
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [employeeIds, setEmployeeIds] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Trainers
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setTrainers(res.data))
      .catch((err) => console.error("Error fetching users:", err));

    // Fetch Employees
    axios
      .get("http://localhost:5000/api/employees")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedTrainer = trainers.find(
      (trainer) => trainer._id === trainerId
    );

    if (!selectedTrainer) {
      alert("Please select a valid trainer.");
      return;
    }

    const courseData = {
      title,
      description,
      trainer: {
        trainer_id: trainerId,
        trainer_name: selectedTrainer.name,
      },
      employees: employeeIds,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/courses",
        courseData
      );
      alert("Course added successfully");
      const courseId = response.data.course._id;

      for (const employeeId of employeeIds) {
        await enrollEmployee(courseId, employeeId);
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course");
    }
  };

  const enrollEmployee = async (courseId, employeeId) => {
    const enrollmentData = {
      course_id: courseId,
      employee_id: employeeId,
    };

    try {
      await axios.post("http://localhost:5000/api/enrollments", enrollmentData);
    } catch (error) {
      console.error("Error enrolling employee:", error);
      alert("Failed to enroll employee");
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allEmployeeIds = employees.map((emp) => emp._id);
      setEmployeeIds(allEmployeeIds);
    } else {
      setEmployeeIds([]);
    }
  };

  const isAllSelected = employeeIds.length === employees.length;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        maxWidth: 600,
        margin: "auto",
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
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
        sx={{ bgcolor: "#f5f5f5" }} // Light background for input
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
        sx={{ bgcolor: "#f5f5f5" }} // Light background for input
      />

      <FormControl fullWidth required>
        <InputLabel>Select Trainer</InputLabel>
        <Select
          value={trainerId}
          onChange={(e) => setTrainerId(e.target.value)}
          label="Select Trainer"
          sx={{ bgcolor: "#f5f5f5" }} // Light background for input
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
          sx={{ bgcolor: "#f5f5f5" }} // Light background for input
        >
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
              }
              label="Select All"
            />
          </MenuItem>
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
