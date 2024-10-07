import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [overallScore, setOverallScore] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseResponse = await axios.get(
          `http://localhost:5000/api/courses/${id}`
        );
        setCourse(courseResponse.data);
        setEmployees(courseResponse.data.employees);

        // Fetch performance data
        const performanceResponses = await Promise.all(
          courseResponse.data.employees.map((employee) =>
            axios.get(
              `http://localhost:5000/api/performance/get/${employee._id}`
            )
          )
        );

        const fetchedFeedback = {};
        const fetchedOverallScore = {};

        performanceResponses.forEach((res) => {
          if (res && res.data) {
            const enrollment = res.data;

            // Now accessing enrollment.employee._id
            if (enrollment.employee && enrollment.employee._id) {
              if (enrollment.feedback) {
                fetchedFeedback[enrollment.employee._id] = enrollment.feedback;
                fetchedOverallScore[enrollment.employee._id] =
                  enrollment.overall_score;
              }
            } else {
              console.error("Employee data not found in response:", enrollment);
            }
          } else {
            console.error("Invalid response for an employee:", res);
          }
        });

        setFeedback(fetchedFeedback);
        setOverallScore(fetchedOverallScore);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
    fetchCourse();
  }, [id]);

  const handleClickOpen = (employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
    setMessage("");
  };

  const handleFeedbackChange = (field, value) => {
    const parsedValue = parseInt(value);
    if (parsedValue >= 0 && parsedValue <= 5) {
      setFeedback((prev) => ({
        ...prev,
        [selectedEmployee._id]: {
          ...prev[selectedEmployee._id],
          [field]: parsedValue,
        },
      }));
    }
  };

  const handleOverallScoreChange = (value) => {
    const parsedValue = parseInt(value);
    if (parsedValue >= 0 && parsedValue <= 10) {
      setOverallScore((prev) => ({
        ...prev,
        [selectedEmployee._id]: parsedValue,
      }));
    }
  };

  const handleSubmitScore = async () => {
    if (!selectedEmployee) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/enrollments/${selectedEmployee._id}/${course._id}`
      );
      const enrollmentId = response.data.enrollment_id;

      await axios.post("http://localhost:5000/api/performance/assign-score", {
        enrollment_id: enrollmentId,
        feedback: feedback[selectedEmployee._id],
        overall_score: overallScore[selectedEmployee._id],
      });

      setMessage("Score assigned successfully");
      handleClose();
    } catch (error) {
      console.error("Error assigning score:", error);
      setMessage("Failed to assign score");
    }
  };

  if (!course) {
    return <Typography variant="h6">Loading course details...</Typography>;
  }

  return (
    <Box m={3}>
      {/* Title Section */}
      <Typography variant="h4" gutterBottom>
        {course.title}
      </Typography>

      {/* Description Section */}
      <Typography variant="body1" paragraph>
        {course.description}
      </Typography>

      {/* Small Cards for Trainer and Total Employees */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ padding: 2, bgcolor: "#eee" }}>
            <Typography variant="h6">
              Trainer: {course.trainer.trainer_name}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ padding: 2, bgcolor: "#eee" }}>
            <Typography variant="h6">
              Total Enrolled Employees: {employees.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Employees Table */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Employees Enrolled
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Punctuality (0-5)</TableCell>
              <TableCell>Hardworking (0-5)</TableCell>
              <TableCell>Assignment On Time (0-5)</TableCell>
              <TableCell>Communication Skills (0-5)</TableCell>
              <TableCell>Overall Score (0-10)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>
                  {feedback[employee._id]?.punctuality || 0}
                </TableCell>
                <TableCell>
                  {feedback[employee._id]?.hardworking || 0}
                </TableCell>
                <TableCell>
                  {feedback[employee._id]?.assignment_ontime || 0}
                </TableCell>
                <TableCell>
                  {feedback[employee._id]?.communication_skills || 0}
                </TableCell>
                <TableCell>{overallScore[employee._id] || 0}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleClickOpen(employee)}
                  >
                    Assign Score
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Assigning Scores */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Scores to {selectedEmployee?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please fill in the scores for the selected employee. Each score
            should be between the specified range.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                type="number"
                label="Punctuality"
                value={feedback[selectedEmployee?._id]?.punctuality || ""}
                onChange={(e) =>
                  handleFeedbackChange("punctuality", e.target.value)
                }
                inputProps={{ min: 0, max: 5, step: 1 }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                label="Hardworking"
                value={feedback[selectedEmployee?._id]?.hardworking || ""}
                onChange={(e) =>
                  handleFeedbackChange("hardworking", e.target.value)
                }
                inputProps={{ min: 0, max: 5, step: 1 }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                label="Assignment On Time"
                value={feedback[selectedEmployee?._id]?.assignment_ontime || ""}
                onChange={(e) =>
                  handleFeedbackChange("assignment_ontime", e.target.value)
                }
                inputProps={{ min: 0, max: 5, step: 1 }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                label="Communication Skills"
                value={
                  feedback[selectedEmployee?._id]?.communication_skills || ""
                }
                onChange={(e) =>
                  handleFeedbackChange("communication_skills", e.target.value)
                }
                inputProps={{ min: 0, max: 5, step: 1 }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                label={<strong>Overall Score</strong>}
                value={overallScore[selectedEmployee?._id] || ""}
                onChange={(e) => handleOverallScoreChange(e.target.value)}
                inputProps={{ min: 0, max: 10, step: 1 }}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          {message && (
            <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmitScore}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseDetail;
