// src/pages/PostDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts,
  deletePost,
  updatePost,
  uploadPostImages,
  deletePostImage
} from '../redux/postSlice';
import {
  fetchLikes,
  likePost,
  unlikePost
} from '../redux/likeSlice';
import { fetchCategories } from '../redux/categorySlice';
import CommentsSection from '../components/CommentsSection';

const PostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts, status } = useSelector(state => state.posts);
  const { categories, loading: catLoading } = useSelector(state => state.categories);
  const { currentUser } = useSelector(state => state.user);
  const likeEntry = useSelector(state => state.likes.byPost[id]) || { count: 0, liked: false };

  const post = posts.find(p => p.id.toString() === id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [filesToAdd, setFilesToAdd] = useState([]);
  const [error, setError] = useState(null);

  // initial load
  useEffect(() => {
    if (!posts.length && status === 'idle') dispatch(fetchPosts());
    dispatch(fetchLikes(id));
    dispatch(fetchCategories());
  }, [dispatch, id, posts.length, status]);

  // populate edit form
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category_id || '');
    }
  }, [post]);

  if (!post) return <p>Loading post…</p>;

  const toggleLike = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    likeEntry.liked
      ? dispatch(unlikePost(post.id))
      : dispatch(likePost(post.id));
  };

  const handleDelete = () => {
    dispatch(deletePost(post.id))
      .unwrap()
      .then(() => navigate('/posts'))
      .catch(err => setError(err));
  };

  const handleImageDelete = (imageId) => {
    dispatch(deletePostImage({ postId: post.id, imageId }))
      .unwrap()
      .catch(err => console.error(err));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      setError('Title, content, and category are required');
      return;
    }
    try {
      await dispatch(
        updatePost({
          postId: post.id,
          title: title.trim(),
          content: content.trim(),
          category_id: category
        })
      ).unwrap();

      if (filesToAdd.length) {
        await dispatch(uploadPostImages({ postId: post.id, images: filesToAdd })).unwrap();
      }
      setIsEditing(false);
      dispatch(fetchPosts());
    } catch (err) {
      setError(err);
    }
  };

  const handleFileChange = (e) => {
    setFilesToAdd([...filesToAdd, ...Array.from(e.target.files)]);
  };

  return (
    <div className="page post-detail">
      {isEditing ? (
        <form onSubmit={handleEditSubmit} encType="multipart/form-data">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Content"
            required
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {catLoading
              ? <option>Loading…</option>
              : categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))
            }
          </select>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '1rem 0' }}>
            {post.images.map(img => (
              <div key={img.id} style={{ position: 'relative' }}>
                <img src={img.url} alt="Post" style={{ maxWidth: 100, borderRadius: 4 }} />
                <button
                  type="button"
                  onClick={() => handleImageDelete(img.id)}
                  style={{
                    position: 'absolute', top: 0, right: 0,
                    background: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer'
                  }}
                >✕</button>
              </div>
            ))}
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {post.author_avatar && (
              <img
                src={post.author_avatar}
                alt="Author avatar"
                style={{ width: 40, height: 40, borderRadius: '50%' }}
              />
            )}
            <h2>{post.title}</h2>
          </div>
          <p><em>Category: {post.category_name}</em></p>
          <p>{post.content}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '1rem 0' }}>
            {post.images.map(img => (
              <img
                key={img.id}
                src={img.url}
                alt="Post"
                style={{ maxWidth: 200, borderRadius: 4 }}
              />
            ))}
          </div>
          <div style={{ margin: '1rem 0' }}>
            <button onClick={toggleLike}>
              {likeEntry.liked ? '💔 Unlike' : '❤️ Like'}
            </button>
            <span style={{ marginLeft: '0.5rem' }}>
              {likeEntry.count} {likeEntry.count === 1 ? 'like' : 'likes'}
            </span>
          </div>
          {currentUser?.id === post.user_id && (
            <div>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
          <CommentsSection postId={post.id} />
        </>
      )}
    </div>
  );
};

export default PostDetail;
