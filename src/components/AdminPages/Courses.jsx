// src/components/Courses.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import Cookie from "js-cookie";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications

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

  const handleAddCourse = async () => {
    toast.success("Course added successfully!"); // Show success toast
    navigate("/addCourse");
  };

  return (
    <Container sx={{ mt: 4, maxWidth: "1200px" }}>
      <Typography
        variant="h4"
        sx={{ mt: 4, textTransform: "uppercase" }}
        gutterBottom
        align="center"
        color="primary"
      >
        Courses
      </Typography>
      {user && user.role === "Admin" && (
        <Box mb={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleAddCourse}>
            Add Course
          </Button>
        </Box>
      )}
      <Grid container spacing={2}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card
              sx={{
                backgroundColor: "#3411A3", // Primary color for the card background
                color: "white", // White text
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#4e1eac", // Slightly lighter on hover
                },
                borderRadius: 2,
                boxShadow: 3,
              }}
              onClick={() => handleCourseClick(course._id)}
            >
              <CardContent>
                <Typography variant="h5" sx={{ textTransform: "uppercase" }}>
                  {course.title}
                </Typography>
                <Typography variant="body2">{course.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </Container>
  );
};

export default Courses;
