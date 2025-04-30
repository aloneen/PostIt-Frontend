import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHome, FaSearch, FaPlus, FaUserCog, FaUserShield, FaUser } from 'react-icons/fa';

import './Navbar.css';

const Navbar = () => {
  const { currentUser } = useSelector(state => state.user);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sidebar">
      <Link to="/" className={`icon ${isActive('/') ? 'active' : ''}`}>
        <FaHome />
      </Link>
      <Link to="/posts" className={`icon ${isActive('/posts') ? 'active' : ''}`}>
        <FaSearch />
      </Link>
      <Link to="/create-post" className={`icon ${isActive('/create-post') ? 'active' : ''}`}>
        <FaPlus />
      </Link>

      {currentUser?.role === 'Admin' && (
        <Link to="/admin" className={`icon ${isActive('/admin') ? 'active' : ''}`}>
          <FaUserShield />
        </Link>
      )}

      {(currentUser?.role === 'Moderator' || currentUser?.role === 'Admin') && (
        <Link to="/moderator" className={`icon ${isActive('/moderator') ? 'active' : ''}`}>
          <FaUserCog />
        </Link>
      )}

      <Link to={currentUser ? '/profile' : '/login'} className={`icon ${isActive('/profile') ? 'active' : ''}`}>
        <FaUser />
      </Link>
    </nav>
  );
};

export default Navbar;
