import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../utils/context/AuthContext';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && auth.user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
