import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, createComment, deleteComment } from '../redux/commentSlice';

const CommentsSection = ({ postId }) => {
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comments);
  const { currentUser } = useSelector((state) => state.user);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setError('Комментарий не может быть пустым');
      return;
    }
    dispatch(createComment({ post_id: postId, content: commentText }))
      .unwrap()
      .then(() => {
        setCommentText('');
        setError(null);
      })
      .catch((err) => setError(err));
  };

  const handleDelete = (id) => {
    dispatch(deleteComment(id));
  };

  return (
    <div className="comments-section">
      <h4>Comments</h4>
      {currentUser ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          <button type="submit">Send</button>
          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <p>Please log in to add a comment.</p>
      )}
      <div className="comments-list">
        {comments.map((c) => (
          <div key={c.id} className="comment">
            <p>{c.content}</p>
            <small>By: {c.user_username}</small>
            {(currentUser?.role === 'Admin' || currentUser?.id === c.user_id) && (
              <button className="btn-delete" onClick={() => handleDelete(c.id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
