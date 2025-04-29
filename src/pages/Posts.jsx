import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector }    from 'react-redux';
import { fetchPosts }                   from '../redux/postSlice';
import { fetchCategories }             from '../redux/categorySlice';
import PostCard                         from '../components/PostCard';



import './css/Posts.css';

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector(s => s.posts);
  const { categories, loading: catLoading } = useSelector(s => s.categories);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTitle, setSearchTitle]           = useState('');

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // filter by category
  let filtered = selectedCategory
    ? posts.filter(p => p.category_id === Number(selectedCategory))
    : posts;

  // further filter by title search
  if (searchTitle.trim()) {
    const term = searchTitle.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(term)
    );
  }

  return (
    <div className="posts-page">
      <h2 className="posts-page__title">All Posts</h2>

      <input
        type="text"
        className="posts-page__search-title"
        placeholder="🔎 Search by title…"
        value={searchTitle}
        onChange={e => setSearchTitle(e.target.value)}
      />

      <div className="posts-page__filter">
        <button
          className={`pill ${selectedCategory === '' ? 'pill--active' : ''}`}
          onClick={() => setSelectedCategory('')}
        >
          All
        </button>
        {catLoading
          ? <span className="pill pill--loading">Loading…</span>
          : categories.map(c => (
              <button
                key={c.id}
                className={`pill ${String(c.id) === selectedCategory ? 'pill--active' : ''}`}
                onClick={() => setSelectedCategory(String(c.id))}
              >
                {c.name}
              </button>
            ))
        }
      </div>

      {status === 'loading' && <p className="posts-page__message">Loading posts…</p>}
      {error && <p className="posts-page__message posts-page__error">{error}</p>}

      {filtered.length > 0 ? (
        <div className="posts-page__grid">
          {filtered.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      ) : (
        <p className="posts-page__message">No posts match your criteria.</p>
      )}
    </div>
  );
};

export default Posts;
