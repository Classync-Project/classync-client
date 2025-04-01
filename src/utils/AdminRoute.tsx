import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const user = useSelector((state: any) => state.user.user);

  const isAdmin = user && user.email === import.meta.env.VITE_ADMIN_EMAIL;

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
