import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, uploadAvatar } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, profile, userPosts } = useSelector(state => state.user);

  useEffect(() => {
    if (!currentUser) return navigate('/login');
    dispatch(fetchProfile());
  }, [dispatch, currentUser, navigate]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) await dispatch(uploadAvatar(file)).unwrap();
  };

  if (!profile) return <p>Loading profile…</p>;

  return (
    <div className="page profile-page container">
      <h2>My Profile</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <img
          src={profile.avatar_url || '/default-avatar.png'}
          alt="Avatar"
          style={{ width: 100, height: 100, borderRadius: '50%' }}
        />
        <div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>
      </div>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      {/* <p><strong>Role:</strong> {profile.role}</p> */}

      <h3>My Posts</h3>
      <div className="posts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '20px' }}>
        {userPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
