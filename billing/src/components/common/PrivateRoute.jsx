import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("First login then access.!");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
