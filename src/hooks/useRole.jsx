import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/permissions';

export const useRole = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  const checkPermission = (permission) => {
    return user ? hasPermission(user.role, permission) : false;
  };

  return {
    role: user?.role || null,
    studentId: user?.studentId || null,
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission: checkPermission,
  };
};
