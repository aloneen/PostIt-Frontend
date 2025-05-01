import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { deletePost } from '../redux/postSlice';
import { fetchLikes, likePost, unlikePost } from '../redux/likeSlice';
import ConfirmationModal from './ConfirmationModal';
import { toast } from 'react-toastify';
import './css/PostCard.css';

const PostCard = ({ post }) => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const { currentUser } = useSelector(s => s.user);
  const likeEntry   = useSelector(s => s.likes.byPost[post.id]) || { count: 0, liked: false };
  const [confirmOpen, setConfirmOpen] = useState(false);

  // load like count + liked flag
  useEffect(() => {
    dispatch(fetchLikes(post.id));
  }, [dispatch, post.id]);

  const handleToggleLike = e => {
    e.stopPropagation();
    if (!currentUser) {
      toast.info('Log in to like posts');
      return navigate('/login');
    }
    likeEntry.liked
      ? dispatch(unlikePost(post.id))
      : dispatch(likePost(post.id));
  };

  const handleDelete = () => {
    dispatch(deletePost(post.id))
      .unwrap()
      .then(() => toast.success('Post deleted'))
      .catch(err => toast.error('Delete failed: ' + err));
  };

  return (
    <>
      <div className="post-card" onClick={() => navigate(`/posts/${post.id}`)}>
        {post.images?.[0] && (
          <div className="post-card-image">
            <img src={post.images[0].url} alt={post.title} className="post-thumbnail"/>
          </div>
        )}

        <div className="post-card-body">
          <h3 className="post-card-title">{post.title}</h3>
          <p className="post-card-text">{post.content}</p>
        </div>

        <div className="post-card-footer">

          <button className="like-btn" onClick={handleToggleLike}>
            <FaHeart className="heart-icon" color={likeEntry.liked ? '#e25555' : '#ccc'}/>
          </button>

          <span className="like-count">{likeEntry.count}</span>

          {currentUser?.role === 'Admin' && (
            <button className="delete-btn" onClick={e => { e.stopPropagation(); setConfirmOpen(true); }}>
              Delete
            </button>

          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmOpen}
        title="Delete Post"
        message="This action cannot be undone. Are you sure?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          handleDelete();
        }} />
    </>
  );
};

export default PostCard;
