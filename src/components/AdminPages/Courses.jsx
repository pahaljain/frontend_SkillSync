// src/components/Courses.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Button,
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
      <Grid container spacing={2}>
        {courses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={4}>
            <Card
              onClick={() => handleCourseClick(course._id)}
              sx={{
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 20,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {course.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Courses;
