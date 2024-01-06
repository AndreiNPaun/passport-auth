import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Dashboard from '../../components/Admin/Dashboard';

const DashboardPage = () => {
  const navigate = useNavigate();
  const role = useSelector((state) => state.login.role);

  useEffect(() => {
    if (role !== 'owner' && role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  return <Dashboard />;
};

export default DashboardPage;
