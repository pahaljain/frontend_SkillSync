import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import axios from "axios";
import Cookie from "js-cookie";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  let navigate = useNavigate();
  const user = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const fetchCourses = async () => {
        try {
          let response;
          if (user.role === "Admin") {
            // Admin fetches all courses
            response = await axios.get("http://localhost:5000/api/courses");
          } else if (user.role === "Trainer") {
            // Trainer fetches only their assigned courses
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
  }, [navigate]);

  const handleCourseClick = (id) => {
    navigate(`/course/${id}`); // Navigate to course detail page
  };

  return (
    <div>
      <h1 className="text-blue-500 text-2xl">
        Welcome, {user ? user.name : "Guest"}!
      </h1>
      <Typography variant="h6" gutterBottom>
        {user.role === "Admin" ? "All Courses" : "Your Courses"}
      </Typography>
      <Grid container spacing={2}>
        {courses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={4}>
            <Card
              onClick={() => handleCourseClick(course._id)}
              style={{ cursor: "pointer" }}
            >
              <CardContent>
                <Typography variant="h6">{course.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {course.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;
