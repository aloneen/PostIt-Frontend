import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = 'http://127.0.0.1:5000/comments'

export const fetchComments = createAsyncThunk('comments/fetch', async (postId) => {
  const res = await axios.get(`${API}?post_id=${postId}`)
  return res.data
})

export const createComment = createAsyncThunk('comments/create', async (commentData, thunkAPI) => {
  const token = thunkAPI.getState().user.token
  const res = await axios.post(API, commentData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
})

export const deleteComment = createAsyncThunk('comments/delete', async (id, thunkAPI) => {
  const token = thunkAPI.getState().user.token
  await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return id
})

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    status: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload)
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c.id !== action.payload)
      })
  },
})

export default commentSlice.reducer
