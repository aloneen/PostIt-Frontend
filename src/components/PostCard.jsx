import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deletePost } from '../store/postSlice'
import { useNavigate } from 'react-router-dom'

const PostCard = ({ post }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)

  const handleDelete = () => {
    dispatch(deletePost(post.id))
  }

  return (
    <div style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <button onClick={() => navigate(`/posts/${post.id}`)}>View</button>
      {user?.role === 'Admin' && (
        <button onClick={handleDelete} style={{ color: 'red' }}>
          Delete
        </button>
      )}
    </div>
  )
}

export default PostCard
