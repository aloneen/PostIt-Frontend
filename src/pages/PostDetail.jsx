import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/postSlice';
import CommentsSection from '../components/CommentsSection';

const PostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { posts, status } = useSelector((state) => state.posts);
  const post = posts.find(p => p.id.toString() === id);

  useEffect(() => {
    if (!posts.length && status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length, status]);

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="page post-detail">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <CommentsSection postId={post.id} />
    </div>
  );
};

export default PostDetail;
