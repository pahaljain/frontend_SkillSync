import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, Container } from "@mui/material";
import axios from "axios";
import Cookie from "js-cookie";

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setTrainers(response.data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchTrainers();
  }, []);

  return (
    <Container sx={{ mt: 4, maxWidth: "1200px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Trainers
      </Typography>
      <Grid container spacing={2}>
        {trainers.map((trainer) => (
          <Grid item key={trainer._id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {trainer.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {trainer.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Trainers;
