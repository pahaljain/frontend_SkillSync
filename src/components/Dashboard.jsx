// Dashboard.jsx
import React, { useEffect } from "react";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  
  let navigate = useNavigate();
  const user = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;

  useEffect(() => {
      if (!user) {
        navigate("/login");
      }
  }, [navigate]);


  return (
    <div>
      <h1 className="text-blue-500 text-2xl">Welcome, {user ? user.name : "Guest"}!</h1>
    </div>
  );
};

export default Dashboard;
