import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminHome() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}
