import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && !isAdmin) {
      toast.error('Bu sayfaya erişim yetkiniz yok');
    }
  }, [loading, isAuthenticated, isAdmin]);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;