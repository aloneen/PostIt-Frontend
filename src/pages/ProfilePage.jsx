import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, updateProfile, uploadAvatar, logoutUser } from '../redux/userSlice';
import { fetchPosts } from '../redux/postSlice';
import PostCard from '../components/PostCard';

import './css/ProfilePage.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser, profile, loading: userLoading, error } = useSelector(s => s.user);
  const { posts, status: postsStatus } = useSelector(s => s.posts);

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    dispatch(fetchProfile());
    if (postsStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [dispatch, currentUser, navigate, postsStatus]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setEmail(profile.email);
    }
  }, [profile]);

  if (userLoading || postsStatus === 'loading') return <p>Loading…</p>;
  if (error) return <p className="profile-page__error">{error}</p>;
  if (!profile) return <p>No profile data.</p>;

  const myPosts = posts.filter(p => p.user_id === profile.id);

  const handleAvatarChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await dispatch(uploadAvatar(file)).unwrap();
      dispatch(fetchProfile());
    } catch (err) {
      alert('Error uploading avatar: ' + err);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError(null);
    if (!username.trim() || !email.trim()) {
      setFormError('Both fields are required.');
      return;
    }
    try {
      await dispatch(updateProfile({ username, email })).unwrap();
      setIsEditing(false);
      dispatch(fetchProfile());
    } catch (err) {
      setFormError(err);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <h2 className="profile-page__title">My Profile</h2>

      <div className="profile-page__avatar-section">
        <img
          src={profile.avatar_url || '/default-avatar.png'}
          alt="Avatar"
          className="profile-page__avatar-img"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="profile-page__avatar-input"
          />
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-page__edit-form">
          <label>
            Username
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          {formError && <p className="profile-page__error">{formError}</p>}
          <button className="profile-page__btn" type="submit">Save</button>
          <button className="profile-page__btn" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div className="profile-page__info">
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <button className="profile-page__btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          <button className="profile-page__btn profile-page__btn--logout" onClick={handleLogout}>Logout</button>
        </div>
      )}

      <h3 className="profile-page__subtitle">My Posts</h3>
      {myPosts.length === 0 ? (
        <p>You haven’t written any posts yet.</p>
      ) : (
        <div className="profile-page__posts-grid">
          {myPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
