// src/components/PrivateRoute.jsx

import { Navigate } from "react-router-dom";
import Cookie from "js-cookie";

const PrivateRoute = ({ children }) => {
  const user = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;

  if (!user) {
    return <Navigate to="/login" />;
  }
``
  // Only allow trainers to access specific routes
  if (
    user.role === "Trainer" &&
    !window.location.pathname.includes("/courses")
  ) {
    return <Navigate to="/courses" />;
  }

  return children;
};

export default PrivateRoute;
