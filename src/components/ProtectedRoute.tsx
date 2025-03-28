import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is at root, redirect to user/1
  if (location.pathname === "/") {
    return <Navigate to="/user/1" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
