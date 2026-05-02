import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProviderLoginPage() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/connexion', { replace: true }); }, [navigate]);
  return null;
}
