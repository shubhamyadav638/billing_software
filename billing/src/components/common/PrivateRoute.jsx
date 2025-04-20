import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "First login then access.!",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        setUnauthorized(true);
      });
    }
  }, [token]);

  if (!token && unauthorized) {
    return <Navigate to="/" replace />;
  }

  return token ? children : null;
};

export default PrivateRoute;
