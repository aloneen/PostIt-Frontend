import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/posts/${postId}/comments`);
      if (!res.ok) throw new Error('Error comment receiv');
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ post_id, content }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().user;
      const res = await fetch(`http://127.0.0.1:5000/posts/${post_id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Error comment create');
      const data = await res.json();
      return data.comment;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().user;
      const res = await fetch(`http://127.0.0.1:5000/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error comment delete');
      return commentId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: { comments: [], error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c.id !== action.payload);
      });
  },
});

export default commentSlice.reducer;
