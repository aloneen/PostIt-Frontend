import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../redux/postSlice';
import { fetchCategories } from '../redux/categorySlice';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading: catLoading } = useSelector(state => state.categories);
  const { currentUser } = useSelector(state => state.user);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !selectedCategory) {
      setError('Fill all fields');
      return;
    }
    try {
      await dispatch(createPost({
        title: title.trim(),
        content: content.trim(),
        category_id: selectedCategory
      })).unwrap();
      navigate('/posts');
    } catch (err) {
      setError(err);
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="page create-post">
      <h2>Create New Post</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
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
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
