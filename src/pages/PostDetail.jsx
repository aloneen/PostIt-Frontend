import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, deletePost, updatePost } from '../redux/postSlice';
import CommentsSection from '../components/CommentsSection';

const PostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, status } = useSelector((state) => state.posts);
  const { currentUser } = useSelector((state) => state.user);
  const post = posts.find(p => p.id.toString() === id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!posts.length && status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length, status]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  if (!post) return <p>Loading post...</p>;

  const handleDelete = () => {
    dispatch(deletePost(post.id))
      .unwrap()
      .then(() => {
        navigate('/posts');
      })
      .catch(err => setError(err));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    dispatch(updatePost({ postId: post.id, title: title.trim(), content: content.trim() }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
      })
      .catch(err => setError(err));
  };

  return (
    <div className="page post-detail">
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {currentUser && currentUser.id === post.user_id && (
            <div>
              <button className='btn' onClick={() => setIsEditing(true)}>Edit</button>
              <button className='btn' onClick={handleDelete}>Delete</button>
            </div>
          )}
          <CommentsSection postId={post.id} />
        </>
      )}
    </div>
  );
};

export default PostDetail;
