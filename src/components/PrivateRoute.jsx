import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const { currentUser } = useSelector((state) => state.user);
  if (!currentUser) return <Navigate to="/login" />;
  if (role && currentUser.role !== role) return <Navigate to="/" />;
  return children;
};

export default PrivateRoute;
