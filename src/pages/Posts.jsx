import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts } from '../store/postSlice'
import PostCard from '../components/PostCard'

const Posts = () => {
  const dispatch = useDispatch()
  const { posts, status } = useSelector((state) => state.posts)

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  return (
    <div>
      <h2>All Posts</h2>
      {status === 'loading' && <p>Loading...</p>}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Posts
