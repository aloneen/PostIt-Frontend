import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllComments, deleteComment } from '../redux/commentSlice';

const ModeratorPage = () => {
  const dispatch = useDispatch();
  const { allComments = [], error } = useSelector(state => state.comments);

  useEffect(() => {
    dispatch(fetchAllComments());
  }, [dispatch]);

  const handleDelete = (commentId) => {
    dispatch(deleteComment(commentId))
      .unwrap()
      .catch(err => console.error(err));
  };

  return (
    <div className="moderator-page">
      <h2>Moderator Panel - Manage Comments</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {allComments.length > 0 ? (
        <ul>
          {allComments.map(comment => (
            <li key={comment.id} style={{ marginBottom: '15px' }}>
              <p>{comment.content}</p>
              <small>
                By: {comment.user_username} | Post ID: {comment.post_id} | {new Date(comment.created_at).toLocaleString()}
              </small>
              <br />
              <button onClick={() => handleDelete(comment.id)} style={{ marginTop: '5px', color: 'red' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments found.</p>
      )}
    </div>
  );
};

export default ModeratorPage;
