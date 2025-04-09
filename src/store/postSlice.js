import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = 'http://127.0.0.1:5000/posts'

// Get all posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().user.token
    const res = await axios.get(API, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch posts')
  }
})

// Create a new post
export const createPost = createAsyncThunk('posts/createPost', async (postData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().user.token
    const res = await axios.post(API, postData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

// Delete post
export const deletePost = createAsyncThunk('posts/deletePost', async (id, thunkAPI) => {
  const token = thunkAPI.getState().user.token
  await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return id
})

// Update post
export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, updatedPost }, thunkAPI) => {
  const token = thunkAPI.getState().user.token
  const res = await axios.put(`${API}/${id}`, updatedPost, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
})

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload)
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p.id === action.payload.id)
        if (index !== -1) state.posts[index] = action.payload
      })
  },
})

export default postSlice.reducer
