import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, changeUserRole, setUserActive } from '../redux/userSlice';
import { toast } from 'react-toastify';
import ConfirmationModal from '../components/ConfirmationModal';
import { fetchPosts, deletePost } from '../redux/postSlice';
import './css/AdminPanel.css';


const AdminPanel = () => {
  const dispatch     = useDispatch();
  const { currentUser, allUsers = [], error } = useSelector(s => s.user);
  const { posts = [], error: postError } = useSelector(s => s.posts);

  // Only show everybody except yourself
  const otherUsers = allUsers.filter(u => u.id !== currentUser?.id);
  

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [postModalOpen, setPostModalOpen] = useState(false);


  const promptDeletePost = (post) => {
    setPostToDelete(post);
    setPostModalOpen(true);
  };
  
  const confirmDeletePost = () => {
    dispatch(deletePost(postToDelete.id))
      .unwrap()
      .then(() => toast.success('Post deleted'))
      .catch(err => toast.error('Failed to delete post: ' + err));
    setPostModalOpen(false);
    setPostToDelete(null);
  };
  
  const cancelDeletePost = () => {
    setPostModalOpen(false);
    setPostToDelete(null);
  };
  
  


  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleRoleChange = (userId, newRole) => {
    dispatch(changeUserRole({ userId, role: newRole }))
      .unwrap()
      .then(() => toast.success('Role has been changed'))
      .catch(err => toast.error('Failed to change role: ' + err));
  };

  // Called when clicking the Ban/Unban button
  const promptToggleActive = user => {
    setUserToToggle(user);
    setModalOpen(true);
  };

  // Actually perform ban/unban after confirmation
  const confirmToggleActive = () => {
    dispatch(
      setUserActive({
        userId:    userToToggle.id,
        is_active: !userToToggle.is_active
      })
    )
      .unwrap()
      .then(() => {
        toast.success(
          `${userToToggle.username} has been ${userToToggle.is_active ? 'banned' : 'unbanned'}`
        );
      })
      .catch(err => toast.error('Failed to update status: ' + err));
    setModalOpen(false);
    setUserToToggle(null);
  };

  const cancelToggleActive = () => {
    setModalOpen(false);
    setUserToToggle(null);
  };

  return (
    <div className="admin-panel">

      <h2>Admin Panel – Manage Users</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {otherUsers.length > 0 ? (

        <ul className="user-list">

        {otherUsers.map(user => (
          <li key={user.id}>
            <span>
              {user.username} ({user.email})
            </span>
            <select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)}>
              <option value="User">User</option>
              <option value="Moderator">Moderator</option>
              <option value="Admin">Admin</option>
            </select>
            <button onClick={() => promptToggleActive(user)} className={user.is_active ? 'ban-button' : 'unban-button'} >
              {user.is_active ? 'Ban' : 'Unban'}
            </button>
          </li>
        ))}
        </ul>
        
      ) : (
        <p>No other users found.</p>
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        title={
          userToToggle && userToToggle.is_active
            ? 'Confirm Ban'
            : 'Confirm Unban'
        }
        message={
          userToToggle
            ? `Are you sure you want to ${
                userToToggle.is_active ? 'ban' : 'unban'
              } "${userToToggle.username}"?`
            : ''
        }
        onConfirm={confirmToggleActive}
        onCancel={cancelToggleActive}/>

    <section className="admin-posts">
      <h3>Manage Posts</h3>

      {postError && <p style={{ color: 'red' }}>{postError}</p>}

      {posts.length > 0 ? (

        <ul style={{ listStyle: 'none', padding: 0 }}>

          {posts.map(post => (
            <li key={post.id} className="post-list-item">
            <div className="post-content-wrapper">
              <strong>{post.title}</strong> <br />
              <small>
                By: {post.user_username} | {new Date(post.created_at).toLocaleString()}
              </small>
              <p style={{ marginTop: '8px' }} className="post-content">{post.content}</p>
            </div>
            <div className="post-actions">
              <button
                onClick={() => promptDeletePost(post)}
                className="delete-post-button">
                Delete Post
              </button>
            </div>
          
            <ConfirmationModal
              isOpen={postModalOpen}
              title="Confirm Delete"
              message={
                postToDelete
                  ? `Are you sure you want to delete the post titled "${postToDelete.title}"?`
                  : ''
              }
              onConfirm={confirmDeletePost}
              onCancel={cancelDeletePost}
            />
          </li>
              
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
    </section>

    </div>
  );
};

export default AdminPanel;
