import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const { currentUser } = useSelector(state => state.user);

  if (!currentUser) return <Navigate to="/login" />;

  if (role) {
    if (Array.isArray(role)) {
      if (!role.includes(currentUser.role)) return <Navigate to="/" />;
    } else {
      if (currentUser.role !== role) return <Navigate to="/" />;
    }
  }

  return children;
};

export default PrivateRoute;
