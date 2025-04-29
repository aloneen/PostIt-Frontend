import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);



  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">PostIt</Link>
      </div>
      {/* <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        &#9776;
      </button> */}
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
           

            <Link to="/profile" className='btn' onClick={() => setMenuOpen(false)}>Profile</Link>

            
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
