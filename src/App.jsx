import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import { loadUser } from './redux/userSlice';

const App = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/create-post" element={<PrivateRoute>{<CreatePost />}</PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute role="Admin">{<AdminPanel />}</PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
