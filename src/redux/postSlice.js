import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const uploadPostImages = createAsyncThunk(
  'posts/uploadPostImages',
  async ({ postId, images }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const formData = new FormData();
      images.forEach(img => formData.append('images', img));
      const res = await fetch(`http://127.0.0.1:5000/posts/${postId}/images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Error uploading images');
      }
      const data = await res.json(); // { images: [url, ...] }
      return { postId, images: data.images };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/posts');
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Error loading posts');
      }
      return await res.json(); // include category_id in each post object
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ title, content, category_id }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const res = await fetch('http://127.0.0.1:5000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, category_id })
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Error creating post');
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, title, content, category_id }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const res = await fetch(`http://127.0.0.1:5000/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, category_id })
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Error updating post');
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const res = await fetch(`http://127.0.0.1:5000/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Error deleting post');
      }
      return postId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.status = 'loading'; state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'; state.error = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.posts[idx] = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.id !== action.payload);
      })
      .addCase(uploadPostImages.fulfilled, (state, action) => {
        const { postId, images } = action.payload;
        const post = state.posts.find(p => p.id === postId);
        if (post) post.images = images;
      });
  }
});

export default postSlice.reducer;