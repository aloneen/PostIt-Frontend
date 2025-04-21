import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLikes = createAsyncThunk(
  'likes/fetchLikes',
  async (postId, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const res = await fetch(`http://127.0.0.1:5000/posts/${postId}/likes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Error loading likes');
      }
      return await res.json(); // { likes: number, liked: boolean }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'likes/likePost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const res = await fetch(`http://127.0.0.1:5000/posts/${postId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Error liking post');
      }
      return postId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const unlikePost = createAsyncThunk(
  'likes/unlikePost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const res = await fetch(`http://127.0.0.1:5000/posts/${postId}/unlike`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Error unliking post');
      }
      return postId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const likeSlice = createSlice({
  name: 'likes',
  initialState: {
    byPost: {},       // { [postId]: { count, liked } }
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLikes.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchLikes.fulfilled, (state, action) => {
        state.loading = false;
        const { likes: count, liked } = action.payload;
        state.byPost[action.meta.arg] = { count, liked };
      })
      .addCase(fetchLikes.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const id = action.payload;
        const prev = state.byPost[id] || { count: 0, liked: false };
        state.byPost[id] = { count: prev.count + 1, liked: true };
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const id = action.payload;
        const prev = state.byPost[id] || { count: 1, liked: true };
        state.byPost[id] = { count: prev.count - 1, liked: false };
      });
  }
});

export default likeSlice.reducer;
