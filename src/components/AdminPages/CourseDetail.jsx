import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, Card, CardContent, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from "@mui/material";
import Cookie from 'js-cookie';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [message, setMessage] = useState('');
  const user = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
    fetchCourse();
  }, [id]);

  if (!course) {
    return <Typography variant="h6">Loading course details...</Typography>;
  }

  // Handle score input change
  const handleFeedbackChange = (employeeId, value) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [employeeId]: value,
    }));
  };

  // Handle score submission
  const handleSubmitScore = async (employeeId) => {
    try {
      const enrollmentId = course.employees.find((emp) => emp._id === employeeId).enrollment_id; // Assuming enrollment_id is stored in employee object
      const response = await axios.post('http://localhost:5000/api/performance/assign-score', {
        enrollment_id: enrollmentId,
        feedback: feedback[employeeId]
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error assigning score:', error);
      setMessage('Failed to assign score');
    }
  };

  return (
    <Box m={3}>
      {/* Course Name */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>{course.title}</Typography>
          <Typography variant="body1">{course.description}</Typography>
        </CardContent>
      </Card>

      {/* Trainer Box */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Card variant="outlined" sx={{ width: '48%', padding: 2 }}>
          <Typography variant="h6">Trainer</Typography>
          <Typography variant="body1">{course.trainer.trainer_name}</Typography>
        </Card>
        <Card variant="outlined" sx={{ width: '48%', padding: 2 }}>
          <Typography variant="h6">Total Enrollments</Typography>
          <Typography variant="body1">{course.employees.length}</Typography>
        </Card>
      </Box>

      {/* Employees Table */}
      <Typography variant="h6" sx={{ mb: 2 }}>Employees Enrolled</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Assign Feedback</TableCell>
              <TableCell>Submit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {course.employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee.name}</TableCell>
                
                {/* Input field for feedback */}
                <TableCell>
                  <TextField
                    label="Feedback"
                    value={feedback[employee._id] || ""}
                    onChange={(e) => handleFeedbackChange(employee._id, e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>

                {/* Submit button */}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmitScore(employee._id)}
                  >
                    Submit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Message after score submission */}
      {message && (
        <Typography variant="body1" color="success" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default CourseDetail;
