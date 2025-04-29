import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, uploadPostImages } from '../redux/postSlice';
import { fetchCategories } from '../redux/categorySlice';
import { useNavigate } from 'react-router-dom';

import './css/CreatePost.css';


import { toast } from 'react-toastify';




const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading: catLoading } = useSelector(state => state.categories);
  const { currentUser } = useSelector(state => state.user);

  const [title, setTitle]             = useState('');
  const [content, setContent]         = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [files, setFiles]             = useState([]);
  const [error, setError]             = useState(null);


  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleFileChange = (e) => {
    // convert FileList to Array
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !selectedCategory) {
      setError('Fill all fields');
      return;
    }

    try {
      // 1) Create the post
      const result = await dispatch(createPost({
        title:         title.trim(),
        content:       content.trim(),
        category_id:   selectedCategory
      })).unwrap();

      // extract the new post's ID
      const postId = result.post.id;

      // 2) Upload images if any
      if (files.length) {
        await dispatch(uploadPostImages({ postId, images: files })).unwrap();
      }

      // 3) Redirect back to posts
      toast.success("Post created");
      navigate('/posts');
    } catch (err) {
      setError(err);
    }
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
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
