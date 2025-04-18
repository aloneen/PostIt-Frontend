import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import ModeratorPage from './pages/ModeratorPage';
import { loadUser } from './redux/userSlice';

const App = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/create-post" element={currentUser ? <CreatePost /> : <Navigate to="/login" />} />
            <Route path="/admin" element={ currentUser && currentUser.role === 'Admin' ? ( <AdminPanel /> ) : ( <Navigate to="/" /> )}/>
            <Route path="/moderator" element={ currentUser && (currentUser.role === 'Moderator' || currentUser.role === 'Admin') ? (
                  <ModeratorPage />
                ) : (
                  <Navigate to="/" />
                )
              }/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
