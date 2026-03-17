import { Navigate } from 'react-router-dom';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token');
  const user = localStorage.getItem('admin_user');

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const parsed = JSON.parse(user);
    if (!parsed.is_admin) {
      return <Navigate to="/admin/login" replace />;
    }
  } catch {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
