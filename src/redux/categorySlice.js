import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/categories');
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Error loading categories');
      }
      return await res.json(); // [{ id, name }]
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
      .addCase(fetchCategories.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false; state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      });
  }
});

export default categorySlice.reducer;