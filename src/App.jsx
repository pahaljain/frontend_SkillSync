// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"; // Import your theme
import "./App.css";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Cookie from "js-cookie";
import AddCourse from "./components/AdminPages/AddCourse";
import CourseDetail from "./components/AdminPages/CourseDetail";
import PrivateRoute from "./components/PrivateRoute";
import Courses from "./components/AdminPages/Courses";
import Employees from "./components/AdminPages/Employees";
import Trainers from "./components/AdminPages/Trainer";

function App() {
  const user = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
          <Route
            path="/login"
            element={
              Cookie.get("user") ? <Navigate to="/dashboard" /> : <Login />
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/addCourse"
            element={
              <PrivateRoute>
                <AddCourse />
              </PrivateRoute>
            }
          />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <Courses />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <Employees />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainers"
            element={
              <PrivateRoute>
                <Trainers />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
