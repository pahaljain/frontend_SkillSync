import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
} from "@mui/material";
import axios from "axios";
import Cookie from "js-cookie";

const Dashboard = () => {
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

  return (
    <Container sx={{ mt: 4, maxWidth: "1200px" }}>
      {" "}
      {/* Adjust maxWidth here */}
      <Typography variant="h4" gutterBottom align="center">
        Welcome, {user ? user.name : "Guest"}!
      </Typography>
      <Typography variant="h6" gutterBottom align="center">
        {user.role === "Admin" ? "All Courses" : "Your Courses"}
      </Typography>
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

export default Dashboard;
