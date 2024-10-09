import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  const [selectedFeedback, setSelectedFeedback] = useState("punctuality");
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
              if (!current.employee) {
                return acc;
              }

              const employeeId = current.employee._id;

              if (!acc[employeeId]) {
                acc[employeeId] = {
                  employee: current.employee,
                  totalScore: 0,
                  count: 0,
                  punctuality: 0,
                  hardworking: 0,
                  assignment_ontime: 0,
                  communication_skills: 0,
                };
              }

              acc[employeeId].totalScore += current.overall_score;
              acc[employeeId].count += 1;

              if (current.feedback) {
                acc[employeeId].punctuality +=
                  current.feedback.punctuality || 0;
                acc[employeeId].hardworking +=
                  current.feedback.hardworking || 0;
                acc[employeeId].assignment_ontime +=
                  current.feedback.assignment_ontime || 0;
                acc[employeeId].communication_skills +=
                  current.feedback.communication_skills || 0;
              }

              return acc;
            },
            {}
          );

          const performanceArray = Object.values(aggregatedPerformanceData).map(
            (entry) => ({
              ...entry.employee,
              overall_score: (entry.totalScore / entry.count).toFixed(2),
              punctuality: (entry.punctuality / entry.count).toFixed(2),
              hardworking: (entry.hardworking / entry.count).toFixed(2),
              assignment_ontime: (
                entry.assignment_ontime / entry.count
              ).toFixed(2),
              communication_skills: (
                entry.communication_skills / entry.count
              ).toFixed(2),
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

  const handleFeedbackChange = (event) => {
    setSelectedFeedback(event.target.value);
  };

  const createFeedbackChart = (data, key, title) => (
    <>
      <Typography
        variant="h5"
        align="center"
        sx={{ mt: 4, textTransform: "uppercase" }}
        color="primary"
      >
        {title}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <FormControl variant="filled" sx={{ minWidth: 190 }}>
          <InputLabel id="feedback-select-label">Feedback</InputLabel>
          <Select
            labelId="feedback-select-label"
            value={selectedFeedback}
            onChange={handleFeedbackChange}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: "200px",
                },
              },
            }}
          >
            <MenuItem value="punctuality">Punctuality</MenuItem>
            <MenuItem value="hardworking">Hardworking</MenuItem>
            <MenuItem value="assignment_ontime">Assignment On Time</MenuItem>
            <MenuItem value="communication_skills">
              Communication Skills
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={key} fill="#F25F95" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );

  // Sort and filter the performance data based on the selected feedback
  const filteredTopPerformers = [...performanceData]
    .sort((a, b) => b[selectedFeedback] - a[selectedFeedback]) // Sort based on selected feedback
    .slice(0, 5); // Get top 5 performers

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

      {/* Top Performers and Feedback Scores Chart */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography
              variant="h5"
              align="center"
              sx={{ mt: 4, textTransform: "uppercase" }}
              color="primary"
            >
              Top 5 Performers
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topPerformers}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="overall_score" fill="#F25F95" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {createFeedbackChart(
              filteredTopPerformers,
              selectedFeedback,
              `${
                selectedFeedback.charAt(0).toUpperCase() + selectedFeedback.slice(1)
              } Scores`
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
