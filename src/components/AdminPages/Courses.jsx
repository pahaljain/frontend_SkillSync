// src/components/Courses.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import Cookie from "js-cookie";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const user = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const fetchCourses = async () => {
        try {
          let response;
          if (user.role === "Admin") {
            response = await axios.get("http://localhost:5000/api/courses");
          } else if (user.role === "Trainer") {
            response = await axios.get(
              `http://localhost:5000/api/courses/trainer/${user.user_id}`
            );
          }
          setCourses(response.data);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };
      fetchCourses();
    }
  }, [navigate, user]);

  const handleCourseClick = (id) => {
    navigate(`/course/${id}`);
  };

  const handleAddCourse = () => {
    navigate("/addCourse"); // Navigate to the add course page
  };

  return (
    <Container sx={{ mt: 4, maxWidth: "1200px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Courses
      </Typography>
      {user && user.role === "Admin" && (
        <Box mb={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleAddCourse}>
            Add Course
          </Button>
        </Box>
      )}
      <TableContainer
        component={Paper}
        sx={{ border: "1px solid #ccc", mt: 2 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course, index) => (
              <TableRow
                key={course._id}
                onClick={() => handleCourseClick(course._id)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e0e0e0", // Alternating background colors
                  "&:hover": { backgroundColor: "#d3d3d3" }, // Hover color
                }}
              >
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Courses;
