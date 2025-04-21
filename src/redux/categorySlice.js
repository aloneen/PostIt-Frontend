// src/redux/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/categories');
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Ошибка загрузки категорий');
      }
      return await res.json(); // array of { id, name }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Create a new category (Moderator or Admin)
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async ({ name }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const res = await fetch('http://127.0.0.1:5000/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Ошибка создания категории');
      }
      return await res.json(); // { id, name }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete an existing category (Moderator or Admin)
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const res = await fetch(`http://127.0.0.1:5000/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Ошибка удаления категории');
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createCategory
      .addCase(createCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteCategory
      .addCase(deleteCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(c => c.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default categorySlice.reducer;
