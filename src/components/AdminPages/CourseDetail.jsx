import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Cookie from "js-cookie";

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
        
        // Fetch performance scores for enrolled employees
        const performanceResponses = await Promise.all(
          courseResponse.data.employees.map((employee) =>
            axios.get(`http://localhost:5000/api/performance/get/${employee._id}`)
          )
        );
        
        const fetchedFeedback = {};
        const fetchedOverallScore = {};

        performanceResponses.forEach((res) => {
          const enrollment = res.data;
          if (enrollment.feedback) {
            fetchedFeedback[enrollment.employee_id] = enrollment.feedback;
            fetchedOverallScore[enrollment.employee_id] =
              enrollment.overall_score;
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
      handleClose(); // Close the dialog after submission
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
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {course.title}
          </Typography>
          <Typography variant="body1">{course.description}</Typography>
        </CardContent>
      </Card>

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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Assign Scores to {selectedEmployee?.name}</DialogTitle>
        <DialogContent>
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
          <TextField
            type="number"
            label="Communication Skills"
            value={feedback[selectedEmployee?._id]?.communication_skills || ""}
            onChange={(e) =>
              handleFeedbackChange("communication_skills", e.target.value)
            }
            inputProps={{ min: 0, max: 5, step: 1 }}
            variant="outlined"
            fullWidth
          />
          <TextField
            type="number"
            label="Overall Score"
            value={overallScore[selectedEmployee?._id] || ""}
            onChange={(e) => handleOverallScoreChange(e.target.value)}
            inputProps={{ min: 0, max: 10, step: 1 }}
            variant="outlined"
            fullWidth
          />
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
