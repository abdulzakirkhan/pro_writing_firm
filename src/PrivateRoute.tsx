import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children, type }) => {
  const user = useSelector((state) => state.auth?.user);

  if (type === "private" && !user) {
    // Not logged in — block private route
    return <Navigate to="/signin" replace />;
  }

  if (type === "public" && user) {
    // Already logged in — block auth route
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;


// PublicRoute