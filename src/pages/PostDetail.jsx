import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts,
  deletePost,
  updatePost
} from '../redux/postSlice';
import {
  fetchLikes,
  likePost,
  unlikePost
} from '../redux/likeSlice';
import CommentsSection from '../components/CommentsSection';

const PostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts, status } = useSelector(state => state.posts);
  const { currentUser } = useSelector(state => state.user);
  const likeEntry = useSelector(state => state.likes.byPost[id]) || { count: 0, liked: false };

  const post = posts.find(p => p.id.toString() === id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  // Fetch posts & likes on mount
  useEffect(() => {
    if (!posts.length && status === 'idle') {
      dispatch(fetchPosts());
    }
    dispatch(fetchLikes(id));
  }, [dispatch, id, posts.length, status]);

  // Populate form fields when post loads
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  if (!post) return <p>Loading post…</p>;

  const handleDelete = () => {
    dispatch(deletePost(post.id))
      .unwrap()
      .then(() => navigate('/posts'))
      .catch(err => setError(err));
  };

  const handleEditSubmit = e => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    dispatch(
      updatePost({
        postId: post.id,
        title: title.trim(),
        content: content.trim(),
        category_id: post.category_id
      })
    )
      .unwrap()
      .then(() => setIsEditing(false))
      .catch(err => setError(err));
  };

  const toggleLike = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    likeEntry.liked
      ? dispatch(unlikePost(post.id))
      : dispatch(likePost(post.id));
  };

  return (
    <div className="page post-detail">
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>

          {/* Image gallery */}
          {post.images && post.images.length > 0 && (
            <div className="post-images" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {post.images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Post image ${idx + 1}`}
                  style={{ maxWidth: '200px', borderRadius: '4px' }}
                />
              ))}
            </div>
          )}

          {/* Like / Unlike */}
          <div style={{ margin: '1rem 0' }}>
            <button onClick={toggleLike}>
              {likeEntry.liked ? '💔 Unlike' : '❤️ Like'}
            </button>
            <span style={{ marginLeft: '0.5rem' }}>
              {likeEntry.count} {likeEntry.count === 1 ? 'like' : 'likes'}
            </span>
          </div>

          {/* Edit/Delete buttons for author */}
          {currentUser && currentUser.id === post.user_id && (
            <div>
              <button className="btn" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <button className="btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}

          <CommentsSection postId={post.id} />
        </>
      )}

      {error && !isEditing && <p className="error">{error}</p>}
    </div>
  );
};

export default PostDetail;
