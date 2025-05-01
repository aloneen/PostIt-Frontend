import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllComments, deleteComment } from '../redux/commentSlice';
import { fetchCategories, createCategory, deleteCategory } from '../redux/categorySlice';
import ConfirmationModal from '../components/ConfirmationModal';
import { toast } from 'react-toastify';
import './css/AdminPanel.css';

const ModeratorPage = () => {
  const dispatch = useDispatch();
  const { allComments = [], error: commentError } = useSelector((s) => s.comments);
  const { categories = [], loading: catLoading, error: catError } = useSelector((s) => s.categories);

  const [newCatName, setNewCatName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteComment, setConfirmDeleteComment] = useState(false);

  useEffect(() => {
    dispatch(fetchAllComments());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    dispatch(createCategory({ name: newCatName.trim() }))
      .unwrap()
      .then(() => {
        toast.success('Category created');
        setNewCatName('');
      })
      .catch((err) => {
        toast.error('Failed to create category: ' + err);
      });
  };

  const handleDeleteComment = (id) => {
    dispatch(deleteComment(id))
      .unwrap()
      .then(() => {
        toast.success('Comment deleted');
      })
      .catch(err => {
        toast.error('Failed to delete commment: ' + err);
      });
  };

  const handleDeleteCategory = (id) => {
    dispatch(deleteCategory(id))
      .unwrap()
      .then(() => {
        toast.success('Category deleted');
      })
      .catch((err) => {
        toast.error('Failed to delete category: ' + err);
      });
  };

  return (
    <div className="moderator-page">
      <h2>Moderator Panel</h2>

      {/* Categories */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Manage Categories</h3>
        {catError && <p style={{ color: 'red' }}>{catError}</p>}

        <form onSubmit={handleCreateCategory}className="manage-categories-form">
          <input type="text" placeholder="New category name" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} required/>
          <button type="submit">Create</button>
        </form>

        {catLoading ? (
          <p>Loading categories…</p>
        ) : categories.length > 0 ? (
          <ul>
            {categories.map((cat) => (
              <li key={cat.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                }}>
                {cat.name}
                <button onClick={() => setConfirmDelete(true)} style={{ color: 'white' }}>Delete</button>

                <ConfirmationModal
                  isOpen={confirmDelete}
                  title="Delete this category?"
                  message="This action cannot be undone."
                  onCancel={() => setConfirmDelete(false)}
                  onConfirm={() => {
                    setConfirmDelete(false);
                    handleDeleteCategory(cat.id);
                  }} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No categories yet.</p>
        )}
      </section>

      {/* Comments section remains unchanged */}
      <section>
        <h3>Manage Comments</h3>
        {commentError && <p style={{ color: 'red' }}>{commentError}</p>}
        {allComments.length > 0 ? (
          <ul>
            {allComments.map((c) => (
              <li key={c.id} style={{ marginBottom: '15px' }}>
                <p className="moderator-comment-text">{c.content}</p>

                <small>
                  By: {c.user_username} | Post ID: {c.post_id} |{' '}
                  {new Date(c.created_at).toLocaleString()}
                </small>
                <br />
                <button onClick={() => setConfirmDeleteComment(true)} style={{ marginTop: '5px', color: 'white' }}>Delete</button>

                <ConfirmationModal
                  isOpen={confirmDeleteComment}
                  title="Delete this comment?"
                  message="This action cannot be undone."
                  onCancel={() => setConfirmDeleteComment(false)}
                  onConfirm={() => {
                    setConfirmDeleteComment(false);
                    handleDeleteComment(c.id);
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments found.</p>
        )}
      </section>
    </div>
  );
};

export default ModeratorPage;



