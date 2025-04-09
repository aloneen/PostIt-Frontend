import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchComments,
  createComment,
  deleteComment,
} from '../store/commentSlice'

const CommentsSection = ({ postId }) => {
  const dispatch = useDispatch()
  const { comments } = useSelector((state) => state.comments)
  const { user } = useSelector((state) => state.user)
  const [text, setText] = useState('')

  useEffect(() => {
    dispatch(fetchComments(postId))
  }, [dispatch, postId])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createComment({ post_id: postId, text }))
    setText('')
  }

  return (
    <div>
      <h4>Comments</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          placeholder="Add a comment..."
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
      {comments.map((c) => (
        <div key={c.id} style={{ marginTop: '10px', padding: '5px', borderBottom: '1px solid #ccc' }}>
          <p>{c.text}</p>
          <small>By: {c.user_username}</small>
          {(user?.role === 'Admin' || user?.id === c.user_id) && (
            <button onClick={() => dispatch(deleteComment(c.id))} style={{ color: 'red', marginLeft: '10px' }}>
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default CommentsSection
