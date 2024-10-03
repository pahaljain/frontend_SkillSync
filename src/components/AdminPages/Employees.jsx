import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, Container } from "@mui/material";
import axios from "axios";
import Cookie from "js-cookie";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <Container sx={{ mt: 4, maxWidth: "1200px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Employees
      </Typography>
      <Grid container spacing={2}>
        {employees.map((employee) => (
          <Grid item key={employee._id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {employee.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {employee.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Employees;
