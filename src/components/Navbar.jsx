import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">PostIt</Link>
      </div>
      <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        &#9776;
      </button>
      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/posts" onClick={() => setMenuOpen(false)}>Posts</Link>
        {currentUser ? (
          
          <>

            <Link to="/create-post" onClick={() => setMenuOpen(false)}>Create Post</Link>
            {currentUser.role === 'Admin' && (
              <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
            )}
            {(currentUser.role === 'Moderator' || currentUser.role === 'Admin') && (
              <Link to="/moderator" onClick={() => setMenuOpen(false)}>Moderator Panel</Link>
            )}
            {/* <span className="user-greeting">
              Welcome, {currentUser.username}
            </span> */}

            <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>

            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
