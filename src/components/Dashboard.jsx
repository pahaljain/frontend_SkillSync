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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

      {/* Top 5 Performers Chart */}
      <Typography variant="h5" align="center" sx={{ mt: 4 }}>
        Top 5 Performers
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={topPerformers}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="employee.name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="overall_score" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      {/* Bottom 5 Performers Chart */}
      <Typography variant="h5" align="center" sx={{ mt: 4 }}>
        Bottom 5 Performers
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={bottomPerformers}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="employee.name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="overall_score" fill="#ff4d4f" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default Dashboard;
