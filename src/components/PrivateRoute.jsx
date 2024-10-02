import React from "react";
import { Navigate } from "react-router-dom";
import Cookie from "js-cookie";

const PrivateRoute = ({ children }) => {
  const user = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
