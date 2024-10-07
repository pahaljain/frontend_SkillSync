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
  const [performanceData, setPerformanceData] = useState([]);
  const user = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookie.get("user")) {
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
          const performanceResponse = await axios.get(
            "http://localhost:5000/api/performance"
          );

          setTotalEmployees(employeeResponse.data.length);
          setTotalTrainers(trainerResponse.data.length);
          setTotalCourses(courseResponse.data.length);
          setPerformanceData(performanceResponse.data);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };
      fetchDashboardData();
    }
  }, [navigate, user]);

  // Sorting top 5 and bottom 5 performers
  const topPerformers = [...performanceData]
    .sort((a, b) => b.overall_score - a.overall_score)
    .slice(0, 5);

  const bottomPerformers = [...performanceData]
    .sort((a, b) => a.overall_score - b.overall_score)
    .slice(0, 5);

  return (
    <Container sx={{ mt: 4, maxWidth: "1200px" }}>
      <Typography variant="h4" gutterBottom align="center">
        {user ? user.role : "Guest"} Dashboard
      </Typography>

      {/* Existing Total Data Section */}
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

      {/* Top 5 Performers Section */}
      <Typography variant="h5" align="center" sx={{ mt: 4 }}>
        Top 5 Performers
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {topPerformers.map((performer, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">
                  {performer.employee.name}
                </Typography>
                <Typography variant="body1" align="center">
                  Course: {performer.course.title}
                </Typography>
                <Typography variant="body2" align="center">
                  Score: {performer.overall_score}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bottom 5 Performers Section */}
      <Typography variant="h5" align="center" sx={{ mt: 4 }}>
        Bottom 5 Performers
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {bottomPerformers.map((performer, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">
                  {performer.employee.name}
                </Typography>
                <Typography variant="body1" align="center">
                  Course: {performer.course.title}
                </Typography>
                <Typography variant="body2" align="center">
                  Score: {performer.overall_score}
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
