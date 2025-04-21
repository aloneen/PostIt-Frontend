import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '../redux/postSlice';
import { likePost, unlikePost, fetchLikes } from '../redux/likeSlice';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(s => s.user);
  const likeEntry = useSelector(s => s.likes.byPost[post.id]) || { count: 0, liked: false };

  useEffect(() => {
    dispatch(fetchLikes(post.id));
  }, [dispatch, post.id]);

  const handleToggleLike = () => {
    if (!currentUser) {
      alert('Please log in to like posts.');
      navigate('/login');
      return;
    }
    likeEntry.liked
      ? dispatch(unlikePost(post.id))
      : dispatch(likePost(post.id));
  };

  return (
    <div className="post-card">
      {post.images && post.images[0] && (
        <img
          src={post.images[0].url}         // ← use .url, not the whole object
          alt="Thumbnail"
          style={{ width: '100%', height: 'auto', marginBottom: '8px', borderRadius: '4px' }}
        />
      )}

      <h3>{post.title}</h3>
      <p>{post.content}</p>

      <div style={{ marginBottom: '0.5rem' }}>
        <button onClick={handleToggleLike}>
          {likeEntry.liked ? '💔 Unlike' : '❤️ Like'}
        </button>
        <span style={{ marginLeft: '0.5rem' }}>
          {likeEntry.count} {likeEntry.count === 1 ? 'like' : 'likes'}
        </span>
      </div>

      <button onClick={() => navigate(`/posts/${post.id}`)}>View</button>
      {currentUser?.role === 'Admin' && (
        <button className="btn-delete" onClick={() => dispatch(deletePost(post.id))}>
          Delete
        </button>
      )}
    </div>
  );
};

export default PostCard;
