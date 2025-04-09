import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost, fetchPosts } from '../redux/postSlice';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title и Content не могут быть пустыми');
      return;
    }
    dispatch(createPost({ title: title.trim(), content: content.trim() }))
      .unwrap()
      .then(() => {
        dispatch(fetchPosts());
        navigate('/posts');
      })
      .catch((err) => setError(err));
  };

  return (
    <div className="page create-post">
      <h2>Create New Post</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
