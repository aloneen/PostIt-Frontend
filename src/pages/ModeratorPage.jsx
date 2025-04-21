// src/pages/ModeratorPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllComments, deleteComment } from '../redux/commentSlice';
import {
  fetchCategories,
  createCategory,
  deleteCategory
} from '../redux/categorySlice';

const ModeratorPage = () => {
  const dispatch = useDispatch();
  const { allComments = [], error: commentError } = useSelector(s => s.comments);
  const { categories = [], loading: catLoading, error: catError } = useSelector(s => s.categories);

  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    dispatch(fetchAllComments());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDeleteComment = (id) => {
    dispatch(deleteComment(id)).unwrap().catch(console.error);
  };

  const handleCreateCategory = e => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    dispatch(createCategory({ name: newCatName.trim() }))
      .unwrap()
      .then(() => setNewCatName(''))
      .catch(console.error);
  };

  const handleDeleteCategory = id => {
    dispatch(deleteCategory(id)).unwrap().catch(console.error);
  };

  return (
    <div className="moderator-page">
      <h2>Moderator Panel</h2>

      {/* --- Comments --- */}
      <section>
        <h3>Manage Comments</h3>
        {commentError && <p style={{ color: 'red' }}>{commentError}</p>}
        {allComments.length > 0 ? (
          <ul>
            {allComments.map(c => (
              <li key={c.id} style={{ marginBottom: '15px' }}>
                <p>{c.content}</p>
                <small>
                  By: {c.user_username} | Post ID: {c.post_id} | {new Date(c.created_at).toLocaleString()}
                </small>
                <br />
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  style={{ marginTop: '5px', color: 'red' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments found.</p>
        )}
      </section>

      {/* --- Categories --- */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Manage Categories</h3>
        {catError && <p style={{ color: 'red' }}>{catError}</p>}

        <form onSubmit={handleCreateCategory} style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="New category name"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            required
          />
          <button type="submit" style={{ marginLeft: '8px' }}>
            Create
          </button>
        </form>

        {catLoading ? (
          <p>Loading categories…</p>
        ) : categories.length > 0 ? (
          <ul>
            {categories.map(cat => (
              <li
                key={cat.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0'
                }}
              >
                {cat.name}
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  style={{ color: 'red' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No categories yet.</p>
        )}
      </section>
    </div>
  );
};

export default ModeratorPage;
