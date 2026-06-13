import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 heures

function isAuthenticated(): boolean {
  const token = localStorage.getItem('admin_token');
  const user = localStorage.getItem('admin_user');
  const loginTime = localStorage.getItem('admin_login_time');

  if (!token || !user) return false;

  if (loginTime && Date.now() - parseInt(loginTime) > SESSION_TIMEOUT) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_login_time');
    localStorage.removeItem('token');
    return false;
  }

  try {
    const parsed = JSON.parse(user);
    return parsed.is_admin === true;
  } catch {
    return false;
  }
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const resetTimer = () => localStorage.setItem('admin_login_time', Date.now().toString());
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
