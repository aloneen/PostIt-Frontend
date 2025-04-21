import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '../redux/postSlice';
import { likePost, unlikePost, fetchLikes } from '../redux/likeSlice';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const likeEntry = useSelector(state => state.likes.byPost[post.id]) || { count: 0, liked: false };

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
        <button
          className="btn-delete"
          onClick={() => dispatch(deletePost(post.id))}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default PostCard;
