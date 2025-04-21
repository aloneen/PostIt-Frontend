import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/postSlice';
import { fetchCategories } from '../redux/categorySlice';
import PostCard from '../components/PostCard';

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector(state => state.posts);
  const { categories, loading: catLoading } = useSelector(state => state.categories);

  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredPosts = selectedCategory
    ? posts.filter(p => p.category_id === parseInt(selectedCategory, 10))
    : posts;

  return (
    <div className="page posts">
      <h2>All Posts</h2>

      <div style={{ marginBottom: '1rem' }}>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {catLoading
            ? <option>Loading…</option>
            : categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))
          }
        </select>
      </div>

      {status === 'loading' && <p>Loading posts…</p>}
      {error && <p className="error">{error}</p>}

      {filteredPosts.length > 0
        ? filteredPosts.map(post => <PostCard key={post.id} post={post} />)
        : <p>No posts found.</p>
      }
    </div>
  );
};

export default Posts;
