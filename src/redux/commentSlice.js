import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Запрос комментариев для конкретного поста (уже существующий)
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/posts/${postId}/comments`);
      if (!res.ok) throw new Error('Ошибка получения комментариев');
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Новый thunk для получения всех комментариев (для модератора)
export const fetchAllComments = createAsyncThunk(
  'comments/fetchAllComments',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().user;
      const res = await fetch('http://127.0.0.1:5000/comments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Ошибка получения комментариев');
      }
      const data = await res.json();
      return data; // ожидается массив комментариев
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
      if (!res.ok) throw new Error('Ошибка создания комментария');
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
      if (!res.ok) throw new Error('Ошибка удаления комментария');
      return commentId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  comments: [],
  allComments: [],
  error: null
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(fetchAllComments.fulfilled, (state, action) => {
        state.allComments = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        state.allComments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c.id !== action.payload);
        state.allComments = state.allComments.filter(c => c.id !== action.payload);
      });
  },
});

export default commentSlice.reducer;
