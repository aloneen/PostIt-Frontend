import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../store/userSlice'

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  return (
    <nav style={{ display: 'flex', gap: '15px', padding: '10px', backgroundColor: '#f4f4f4' }}>
      <Link to="/">Home</Link>
      <Link to="/posts">Posts</Link>
      <Link to="/create-post">Create Post</Link>
      {currentUser?.role === 'Admin' && <Link to="/admin">Admin Panel</Link>}
      {currentUser ? (
        <>
          <span>Hello, {currentUser.username}</span>
          <button onClick={() => dispatch(logoutUser())}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
}

export default Navbar
