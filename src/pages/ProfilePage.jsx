import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector }   from 'react-redux';
import { useNavigate }                from 'react-router-dom';
import { fetchProfile, updateProfile, uploadAvatar } from '../redux/userSlice';
import { fetchPosts }                 from '../redux/postSlice';
import PostCard                       from '../components/PostCard';
import { logoutUser } from '../redux/userSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // redux state
  const { currentUser, profile, loading: userLoading, error } = useSelector(s => s.user);
  const { posts, status: postsStatus } = useSelector(s => s.posts);


  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername]   = useState('');
  const [email, setEmail]         = useState('');
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


  if (userLoading || postsStatus === 'loading') {
    return <p>Loading…</p>;
  }
  if (error) {
    return <p className="error">{error}</p>;
  }
  if (!profile) {
    return <p>No profile data.</p>;
  }


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
    <div className="page profile-page container">
      <h2>My Profile</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: '1rem' }}>
        <img
          src={profile.avatar_url || '/default-avatar.png'}
          alt="Avatar"
          style={{ width: 100, height: 100, borderRadius: '50%' }}
        />

        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </label>
          {formError && <p className="error">{formError}</p>}
          <button className="btn" type="submit">Save</button>
          <button className="btn" type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong>    {profile.email}</p>
          
          <button className="btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>

          <br />
          <br />

          <button onClick={handleLogout}>Logout</button>
        </>
      )}

      <h3 style={{ marginTop: '2rem' }}>My Posts</h3>
      {myPosts.length === 0 ? (
        <p>You haven’t written any posts yet.</p>
      ) : (
        <div
          className="posts-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '1rem'
          }}
        >
          {myPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
