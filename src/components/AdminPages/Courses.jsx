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
  CardMedia,
} from "@mui/material";
import axios from "axios";
import Cookie from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import images
import course1 from "../../assets/images/courses1.webp";
import course2 from "../../assets/images/courses2.webp";
import course3 from "../../assets/images/courses3.webp";
import course4 from "../../assets/images/courses4.webp";
import course5 from "../../assets/images/courses5.webp";
import course6 from "../../assets/images/courses6.webp";

const courseImages = [course1, course2, course3, course4, course5, course6];

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
    toast.success("Course added successfully!");
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
        {courses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card
              sx={{
                backgroundColor: "#3411A3",
                color: "white",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#4e1eac",
                },
                borderRadius: 2,
                boxShadow: 3,
              }}
              onClick={() => handleCourseClick(course._id)}
            >
              {/* Display image above the title */}
              <CardMedia
                component="img"
                height="140"
                image={courseImages[index % courseImages.length]} // Cycle through images
                alt={course.title}
              />
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
      <ToastContainer />
    </Container>
  );
};

export default Courses;
