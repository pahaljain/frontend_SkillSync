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
  const navigate = useNavigate();
  const user = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const fetchDashboardData = async () => {
        try {
          const [
            employeeResponse,
            trainerResponse,
            courseResponse,
            performanceResponse,
          ] = await Promise.all([
            axios.get("http://localhost:5000/api/employees"),
            axios.get("http://localhost:5000/api/users"),
            axios.get("http://localhost:5000/api/courses"),
            axios.get("http://localhost:5000/api/performance"),
          ]);

          setTotalEmployees(employeeResponse.data.length);
          setTotalTrainers(trainerResponse.data.length);
          setTotalCourses(courseResponse.data.length);

          const aggregatedPerformanceData = performanceResponse.data.reduce(
            (acc, current) => {
              // Skip entries where employee is null
              if (!current.employee) {
                return acc;
              }

              const employeeId = current.employee._id;

              // If employee does not exist in accumulator, initialize it
              if (!acc[employeeId]) {
                acc[employeeId] = {
                  employee: current.employee,
                  totalScore: 0,
                  count: 0,
                };
              }

              // Update total score and increment count
              acc[employeeId].totalScore += current.overall_score;
              acc[employeeId].count += 1;

              return acc;
            },
            {}
          );

          console.log(aggregatedPerformanceData);


          // Convert the aggregated data into an array
          const performanceArray = Object.values(aggregatedPerformanceData).map(
            (entry) => ({
              ...entry.employee,
              overall_score: (entry.totalScore / entry.count).toFixed(2), // Average score
            })
          );

          setPerformanceData(performanceArray);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };
      fetchDashboardData();
    }
  }, [navigate]);

  const topPerformers = [...performanceData]
    .sort((a, b) => b.overall_score - a.overall_score)
    .slice(0, 5);
  const bottomPerformers = [...performanceData]
    .sort((a, b) => a.overall_score - b.overall_score)
    .slice(0, 5);

  return (
    <Container sx={{ mt: 4, maxWidth: "1200px" }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        color="primary"
        sx={{ textTransform: "uppercase" }}
      >
        {user ? user.role : "Guest"} Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: "#3411A3" }}>
            <CardContent>
              <Typography
                variant="h5"
                align="center"
                color="white"
                sx={{ textTransform: "uppercase" }}
              >
                Total Employees
              </Typography>
              <Typography variant="h6" align="center" color="white">
                {totalEmployees}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: "#3411A3" }}>
            <CardContent>
              <Typography
                variant="h5"
                align="center"
                color="white"
                sx={{ textTransform: "uppercase" }}
              >
                Total Trainers
              </Typography>
              <Typography variant="h6" align="center" color="white">
                {totalTrainers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: "#3411A3" }}>
            <CardContent>
              <Typography
                variant="h5"
                align="center"
                color="white"
                sx={{ textTransform: "uppercase" }}
              >
                Total Courses
              </Typography>
              <Typography variant="h6" align="center" color="white">
                {totalCourses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography
        variant="h5"
        align="center"
        sx={{ mt: 4, textTransform: "uppercase" }}
        color="primary"
      >
        Top 5 Performers
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={topPerformers}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" /> {/* Changed to employee name */}
          <YAxis />
          <Tooltip />
          <Bar dataKey="overall_score" fill="#F25F95" />
        </BarChart>
      </ResponsiveContainer>

      <Typography
        variant="h5"
        align="center"
        sx={{ mt: 4, textTransform: "uppercase" }}
        color="primary"
      >
        Bottom 5 Performers
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={bottomPerformers}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" /> {/* Changed to employee name */}
          <YAxis />
          <Tooltip />
          <Bar dataKey="overall_score" fill="#F25F95" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default Dashboard;
