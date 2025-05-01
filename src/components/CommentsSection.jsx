import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, createComment, deleteComment } from '../redux/commentSlice';
import ConfirmationModal from './ConfirmationModal';
import { toast } from 'react-toastify';
import './css/CommentsSection.css';

const CommentsSection = ({ postId }) => {
  const dispatch    = useDispatch();
  const { comments }  = useSelector(s => s.comments);
  const { currentUser } = useSelector(s => s.user);

  const [commentText, setCommentText] = useState('');
  const [error, setError]             = useState(null);
  const [confirmId, setConfirmId]     = useState(null);

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!commentText.trim()) {
      setError('Please enter a comment.');
      return;
    }
    dispatch(createComment({ post_id: postId, content: commentText }))
      .unwrap()
      .then(() => {
        setCommentText('');
        setError(null);
        toast.success('Comment posted');
      })
      .catch(err => {
        setError(err);
        toast.error('Failed to post comment: ' + err);
      });
  };

  const handleDelete = id => {
    dispatch(deleteComment(id))
      .unwrap()
      .then(() => toast.success('Comment deleted'))
      .catch(err => toast.error('Failed to delete comment: ' + err));
  };

  return (
    <div className="comments-section">
      <h4>Comments</h4>
      {currentUser ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <input className="comment-input" type="text" placeholder="Add a comment…" value={commentText} onChange={e => setCommentText(e.target.value)} />
          <button className="btn submit-btn" type="submit">Send</button>
          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <p className="login-prompt">Please log in to leave a comment.</p>
      )}

      <ul className="comments-list">
        {comments.map(c => (
          <li key={c.id} className="comment-item">
            {c.user_avatar && (
              <img className="comment-avatar" src={c.user_avatar} alt={'avatar'} />
            )}
            <div className="comment-body">
              <p className="comment-text">{c.content}</p>
              <small className="comment-meta">By {c.user_username}</small>
            </div>
            {(currentUser?.role === 'Admin' || currentUser?.id === c.user_id) && (
              <div>
                <button className="btn delete-comment-btn" onClick={() => setConfirmId(c.id)} >Delete</button>
                <ConfirmationModal
                  isOpen={confirmId === c.id}
                  title="Delete comment?"
                  message="This cannot be undone."
                  onCancel={() => setConfirmId(null)}
                  onConfirm={() => {
                    handleDelete(c.id);
                    setConfirmId(null);
                  }} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentsSection;
