import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/postSlice';
import PostCard from '../components/PostCard';

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="page posts">
      <h2>All Posts</h2>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
};

export default Posts;
