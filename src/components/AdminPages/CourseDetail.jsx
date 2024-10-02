import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, Card, CardContent, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

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
            </TableRow>
          </TableHead>
          <TableBody>
            {course.employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourseDetail;
