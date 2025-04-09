import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '../redux/postSlice';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleDelete = () => {
    dispatch(deletePost(post.id));
  };

  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <button onClick={() => navigate(`/posts/${post.id}`)}>View</button>
      {currentUser?.role === 'Admin' && (
        <button className="btn-delete" onClick={handleDelete}>
          Delete
        </button>
      )}
    </div>
  );
};

export default PostCard;
