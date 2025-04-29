import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, createComment, deleteComment } from '../redux/commentSlice';

import ConfirmationModal from './ConfirmationModal';
import { toast } from 'react-toastify';

const CommentsSection = ({ postId }) => {
  const dispatch = useDispatch();
  const { comments } = useSelector(state => state.comments);
  const { currentUser } = useSelector(state => state.user);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);


  const [confirmId, setConfirmId]     = useState(null);

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!commentText.trim()) {
      setError('Comment required');
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
      .then(() => {
        toast.success('Comment deleted');
      })
      .catch(err => {
        toast.error('Failed to delete comment: ' + err);
      });
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
            onChange={e => setCommentText(e.target.value)}
          />
          <button type="submit">Send</button>
          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <p>Please log in to add a comment.</p>
      )}
      <div className="comments-list">
        {comments.map(c => (
          <div key={c.id} className="comment" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {c.user_avatar && (
              <img
                src={c.user_avatar}
                alt={`${c.user_username}'s avatar`}
                style={{ width: 32, height: 32, borderRadius: '50%' }}
              />
            )}
            <div>
              <p>{c.content}</p>
              <small>By: {c.user_username}</small>
            </div>
             {(currentUser?.role === 'Admin' || currentUser?.id === c.user_id) && (
              <>
                <button 
                  className="btn btn-delete"
                  onClick={() => setConfirmId(c.id)}
                >
                  Delete
                </button>
                <ConfirmationModal
                  isOpen={confirmId === c.id}
                  title="Delete this comment?"
                  onCancel={() => setConfirmId(null)}
                  onConfirm={() => {
                    handleDelete(c.id);
                    setConfirmId(null);
                  }}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
