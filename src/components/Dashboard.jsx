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
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalTrainers, setTotalTrainers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const navigate = useNavigate();
  const user = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const fetchDashboardData = async () => {
        try {
          const employeeResponse = await axios.get(
            "http://localhost:5000/api/employees"
          );
          const trainerResponse = await axios.get(
            "http://localhost:5000/api/users"
          );
          const courseResponse = await axios.get(
            "http://localhost:5000/api/courses"
          );

          setTotalEmployees(employeeResponse.data.length);
          setTotalTrainers(trainerResponse.data.length);
          setTotalCourses(courseResponse.data.length);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };
      fetchDashboardData();
    }
  }, [navigate, user]);

  return (
    <Container sx={{ mt: 4, maxWidth: "1200px" }}>
      <Typography variant="h4" gutterBottom align="center">
        {user ? user.role : "Guest"} Dashboard
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" align="center">
                Total Employees
              </Typography>
              <Typography variant="h6" align="center">
                {totalEmployees}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" align="center">
                Total Trainers
              </Typography>
              <Typography variant="h6" align="center">
                {totalTrainers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" align="center">
                Total Courses
              </Typography>
              <Typography variant="h6" align="center">
                {totalCourses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
